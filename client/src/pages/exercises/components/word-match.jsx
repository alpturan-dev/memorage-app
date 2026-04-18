import { apiRequest } from "@/api/config";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Progress } from "@/components/ui/progress";
import { Skeleton } from "@/components/ui/skeleton";
import {
  ArrowLeft,
  CheckCircle2,
  LogOut,
  RotateCcw,
  Trophy,
} from "lucide-react";
import { useEffect, useLayoutEffect, useRef, useState } from "react";
import toast from "react-hot-toast";
import { useTranslation } from "react-i18next";
import { useLocation, useNavigate } from "react-router-dom";
import { twJoin } from "tailwind-merge";

const BATCH_SIZE = 6;
const MIN_WORDS = 4;
const PAIR_COLORS = [
  "#2563eb",
  "#16a34a",
  "#dc2626",
  "#ea580c",
  "#9333ea",
  "#0891b2",
  "#db2777",
  "#65a30d",
];

const shuffleArray = (array) => {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
};

const WordMatch = () => {
  const { t } = useTranslation();
  const { state } = useLocation();
  const navigate = useNavigate();

  if (!state) {
    navigate("/exercises", { replace: true });
    return null;
  }

  const { selectedCollectionId, preset } = state;
  const tr = (key, opts) => t(`wordMatchExercise.${key}`, opts);

  const [allWords, setAllWords] = useState([]);
  const [batch, setBatch] = useState([]);
  const [batchStart, setBatchStart] = useState(0);
  const [nativeOrder, setNativeOrder] = useState([]);
  const [targetOrder, setTargetOrder] = useState([]);
  const [selected, setSelected] = useState(null);
  const [matches, setMatches] = useState({});
  const [wrongPair, setWrongPair] = useState(null);
  const [score, setScore] = useState(0);
  const [attempts, setAttempts] = useState(0);
  const [completedCount, setCompletedCount] = useState(0);
  const [isCompleted, setIsCompleted] = useState(false);
  const [showExitDialog, setShowExitDialog] = useState(false);
  const [lineSegments, setLineSegments] = useState([]);

  const containerRef = useRef(null);
  const nativeRefs = useRef({});
  const targetRefs = useRef({});
  const activityRecorded = useRef(false);

  const totalWords = allWords.length;
  const progressPercent =
    totalWords > 0 ? (completedCount / totalWords) * 100 : 0;

  const getAllWordsByCollection = async () => {
    try {
      let response = {};
      if (preset) {
        response = await apiRequest.get(
          `/api/preset-collections/byId/${selectedCollectionId}`,
        );
      } else {
        response = await apiRequest.get(
          `/api/words/wordCollection/${selectedCollectionId}`,
          { params: { limit: 10000 } },
        );
      }
      if (response.status === 200) {
        if (response.data.words.length < MIN_WORDS) {
          toast.error(t("exercisesPage.notEnoughWords"));
          navigate(-1);
          return;
        }
        const shuffled = shuffleArray(response.data.words);
        setAllWords(shuffled);
        loadBatch(shuffled, 0);
      }
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    getAllWordsByCollection();
  }, []);

  const loadBatch = (wordsArray, startIndex) => {
    const remaining = wordsArray.slice(startIndex);
    if (remaining.length < MIN_WORDS) {
      setIsCompleted(true);
      return;
    }
    const size = Math.min(BATCH_SIZE, remaining.length);
    const nextBatch = remaining.slice(0, size).map((w, i) => ({
      ...w,
      _pairId: `${startIndex}-${i}`,
    }));
    setBatch(nextBatch);
    setBatchStart(startIndex);
    setNativeOrder(shuffleArray(nextBatch));
    setTargetOrder(shuffleArray(nextBatch));
    setSelected(null);
    setMatches({});
    setWrongPair(null);
    setLineSegments([]);
    nativeRefs.current = {};
    targetRefs.current = {};
  };

  const recordActivityOnce = () => {
    if (activityRecorded.current) return;
    activityRecorded.current = true;
    apiRequest
      .post("/api/dashboard/activity", { type: "exercise" })
      .catch(console.error);
  };

  const handleNativeClick = (pairId) => {
    if (matches[pairId] || wrongPair) return;
    if (!selected) {
      setSelected({ side: "native", pairId });
      return;
    }
    if (selected.side === "native") {
      setSelected({ side: "native", pairId });
      return;
    }
    checkMatch(pairId, selected.pairId);
  };

  const handleTargetClick = (pairId) => {
    if (matches[pairId] || wrongPair) return;
    if (!selected) {
      setSelected({ side: "target", pairId });
      return;
    }
    if (selected.side === "target") {
      setSelected({ side: "target", pairId });
      return;
    }
    checkMatch(selected.pairId, pairId);
  };

  const checkMatch = (nativePairId, targetPairId) => {
    setAttempts((prev) => prev + 1);
    setSelected(null);
    if (nativePairId === targetPairId) {
      const colorIndex = Object.keys(matches).length % PAIR_COLORS.length;
      const newMatches = {
        ...matches,
        [nativePairId]: PAIR_COLORS[colorIndex],
      };
      setMatches(newMatches);
      setScore((prev) => prev + 1);
      setCompletedCount((prev) => prev + 1);
      recordActivityOnce();

      if (Object.keys(newMatches).length === batch.length) {
        const nextStart = batchStart + batch.length;
        setTimeout(() => {
          if (nextStart >= allWords.length) {
            setIsCompleted(true);
          } else {
            loadBatch(allWords, nextStart);
          }
        }, 900);
      }
    } else {
      setWrongPair({ nativePairId, targetPairId });
      setTimeout(() => setWrongPair(null), 700);
    }
  };

  const computeLines = () => {
    const container = containerRef.current;
    if (!container) return;
    const containerRect = container.getBoundingClientRect();
    const segs = [];
    for (const pairId of Object.keys(matches)) {
      const nEl = nativeRefs.current[pairId];
      const tEl = targetRefs.current[pairId];
      if (!nEl || !tEl) continue;
      const nRect = nEl.getBoundingClientRect();
      const tRect = tEl.getBoundingClientRect();
      segs.push({
        pairId,
        color: matches[pairId],
        x1: nRect.right - containerRect.left,
        y1: nRect.top + nRect.height / 2 - containerRect.top,
        x2: tRect.left - containerRect.left,
        y2: tRect.top + tRect.height / 2 - containerRect.top,
      });
    }
    setLineSegments(segs);
  };

  useLayoutEffect(() => {
    computeLines();
  }, [matches, nativeOrder, targetOrder]);

  useEffect(() => {
    const handleResize = () => computeLines();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [matches]);

  const resetGame = () => {
    const shuffled = shuffleArray(allWords);
    setAllWords(shuffled);
    setScore(0);
    setAttempts(0);
    setCompletedCount(0);
    setIsCompleted(false);
    activityRecorded.current = false;
    loadBatch(shuffled, 0);
  };

  const handleBackClick = () => {
    if (completedCount > 0 && !isCompleted) {
      setShowExitDialog(true);
    } else {
      navigate(-1);
    }
  };

  const getWordStyle = (pairId, side) => {
    const isMatched = !!matches[pairId];
    const isSelected = selected?.side === side && selected?.pairId === pairId;
    const isWrong =
      wrongPair &&
      ((side === "native" && wrongPair.nativePairId === pairId) ||
        (side === "target" && wrongPair.targetPairId === pairId));

    if (isMatched) {
      return "bg-green-50 dark:bg-green-950/40 border-green-500 text-green-800 dark:text-green-200 cursor-default";
    }
    if (isWrong) {
      return "bg-red-50 dark:bg-red-950/40 border-red-400 text-red-800 dark:text-red-200 animate-shake";
    }
    if (isSelected) {
      return "bg-primary/10 border-primary text-foreground ring-2 ring-primary/30";
    }
    return "bg-card border-border hover:border-primary/50 hover:shadow-md text-foreground cursor-pointer";
  };

  if (batch.length === 0 && !isCompleted) {
    return (
      <main className="bg-background text-foreground py-4">
        <div className="max-w-2xl mx-auto">
          <div className="flex items-center gap-3 mb-6">
            <Skeleton className="h-9 w-9 rounded-md" />
            <Skeleton className="h-6 w-48" />
          </div>
          <Skeleton className="h-2 w-full rounded-full mb-8" />
          <div className="grid grid-cols-2 gap-4">
            {[...Array(6)].map((_, i) => (
              <Skeleton key={i} className="h-14 w-full rounded-xl" />
            ))}
            {[...Array(6)].map((_, i) => (
              <Skeleton key={`b-${i}`} className="h-14 w-full rounded-xl" />
            ))}
          </div>
        </div>
      </main>
    );
  }

  if (isCompleted) {
    const percentage =
      attempts > 0 ? Math.round((score / attempts) * 100) : 0;
    return (
      <main className="bg-background text-foreground py-4">
        <div className="max-w-md mx-auto text-center animate-fade-in-up">
          <div className="bg-card rounded-3xl p-8 shadow-md border border-border">
            <div className="flex justify-center mb-4">
              <div className="bg-primary/10 rounded-full p-5">
                <Trophy className="h-12 w-12 text-primary" />
              </div>
            </div>
            <h2 className="text-2xl font-bold mb-2">{tr("completed")}</h2>
            <p className="text-muted-foreground text-sm mb-6">
              {tr("completedDescription")}
            </p>
            <div className="bg-muted/50 rounded-2xl p-6 mb-6">
              <span className="text-sm text-muted-foreground font-medium">
                {tr("accuracy")}
              </span>
              <div className="text-5xl font-bold text-primary mt-1">
                {percentage}%
              </div>
              <div className="text-sm text-muted-foreground mt-2">
                {tr("matchesOf", { score, attempts })}
              </div>
            </div>
            <div className="flex flex-col gap-3">
              <Button onClick={resetGame} className="w-full gap-2">
                <RotateCcw className="h-4 w-4" />
                {tr("restart")}
              </Button>
              <Button
                variant="outline"
                onClick={() => navigate(-1)}
                className="w-full gap-2"
              >
                <ArrowLeft className="h-4 w-4" />
                {tr("goBack")}
              </Button>
            </div>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="bg-background text-foreground py-4 animate-fade-in-up">
      <div className="max-w-2xl mx-auto">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <Button size="sm" variant="outline" onClick={handleBackClick}>
              <ArrowLeft className="w-4 h-4" />
            </Button>
            <h1 className="text-lg font-semibold">{tr("title")}</h1>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium text-muted-foreground">
              {tr("progressOf", {
                current: completedCount,
                total: totalWords,
              })}
            </span>
          </div>
        </div>

        <Progress value={progressPercent} className="h-2 mb-6" />

        <div className="flex justify-center mb-5">
          <div className="inline-flex items-center gap-2 rounded-full px-5 py-2 text-sm font-semibold shadow-sm bg-card border border-border">
            <span className="text-muted-foreground">{tr("score")}:</span>
            <span className="text-lg font-bold text-primary">{score}</span>
          </div>
        </div>

        <p className="text-center text-sm text-muted-foreground mb-4">
          {tr("instruction")}
        </p>

        <div ref={containerRef} className="relative">
          <svg
            className="absolute inset-0 w-full h-full pointer-events-none"
            style={{ zIndex: 1 }}
          >
            {lineSegments.map((s) => (
              <line
                key={s.pairId}
                x1={s.x1}
                y1={s.y1}
                x2={s.x2}
                y2={s.y2}
                stroke={s.color}
                strokeWidth="3"
                strokeLinecap="round"
                className="animate-fade-in-up"
              />
            ))}
          </svg>

          <div className="grid grid-cols-2 gap-4 sm:gap-10 relative" style={{ zIndex: 2 }}>
            <div className="flex flex-col gap-3">
              {nativeOrder.map((word) => (
                <button
                  key={`n-${word._pairId}`}
                  ref={(el) => {
                    if (el) nativeRefs.current[word._pairId] = el;
                  }}
                  onClick={() => handleNativeClick(word._pairId)}
                  disabled={!!matches[word._pairId]}
                  className={twJoin(
                    "py-3 px-4 text-base font-medium rounded-xl border-2 transition-all duration-200 outline-none active:scale-[0.97] font-serif",
                    getWordStyle(word._pairId, "native"),
                  )}
                  style={
                    matches[word._pairId]
                      ? { borderColor: matches[word._pairId] }
                      : undefined
                  }
                >
                  <span className="flex items-center justify-center gap-2 break-words">
                    {matches[word._pairId] && (
                      <CheckCircle2
                        className="h-4 w-4 shrink-0"
                        style={{ color: matches[word._pairId] }}
                      />
                    )}
                    {word.nativeWord}
                  </span>
                </button>
              ))}
            </div>

            <div className="flex flex-col gap-3">
              {targetOrder.map((word) => (
                <button
                  key={`t-${word._pairId}`}
                  ref={(el) => {
                    if (el) targetRefs.current[word._pairId] = el;
                  }}
                  onClick={() => handleTargetClick(word._pairId)}
                  disabled={!!matches[word._pairId]}
                  className={twJoin(
                    "py-3 px-4 text-base font-medium rounded-xl border-2 transition-all duration-200 outline-none active:scale-[0.97] font-serif",
                    getWordStyle(word._pairId, "target"),
                  )}
                  style={
                    matches[word._pairId]
                      ? { borderColor: matches[word._pairId] }
                      : undefined
                  }
                >
                  <span className="flex items-center justify-center gap-2 break-words">
                    {matches[word._pairId] && (
                      <CheckCircle2
                        className="h-4 w-4 shrink-0"
                        style={{ color: matches[word._pairId] }}
                      />
                    )}
                    {word.targetWord}
                  </span>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      <Dialog open={showExitDialog} onOpenChange={setShowExitDialog}>
        <DialogContent className="sm:max-w-sm" aria-describedby="exit-desc">
          <DialogHeader className="text-center sm:text-center">
            <DialogTitle>{tr("exitTitle")}</DialogTitle>
            <DialogDescription id="exit-desc">
              {tr("exitDescription")}
            </DialogDescription>
          </DialogHeader>

          <div className="grid grid-cols-2 gap-3 py-2">
            <div className="bg-muted/50 rounded-xl p-4 text-center">
              <div className="text-2xl font-bold text-foreground">
                {completedCount}
                <span className="text-sm font-normal text-muted-foreground">
                  {" "}
                  / {totalWords}
                </span>
              </div>
              <span className="text-xs text-muted-foreground">
                {tr("wordsMatched")}
              </span>
            </div>
            <div className="bg-muted/50 rounded-xl p-4 text-center">
              <div className="text-2xl font-bold text-primary">
                {attempts > 0 ? Math.round((score / attempts) * 100) : 0}
                <span className="text-sm font-normal text-muted-foreground">
                  %
                </span>
              </div>
              <span className="text-xs text-muted-foreground">
                {tr("accuracy")}
              </span>
            </div>
          </div>

          <DialogFooter className="flex gap-2 sm:flex-row">
            <Button
              variant="outline"
              className="flex-1 gap-2"
              onClick={() => setShowExitDialog(false)}
            >
              {tr("exitContinue")}
            </Button>
            <Button
              variant="destructive"
              className="flex-1 gap-2"
              onClick={() => {
                setShowExitDialog(false);
                navigate(-1);
              }}
            >
              <LogOut className="h-4 w-4" />
              {tr("exitEnd")}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </main>
  );
};

export default WordMatch;
