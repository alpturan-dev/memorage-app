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
  ChevronLeft,
  ChevronRight,
  LogOut,
  RotateCcw,
  Shuffle as ShuffleIcon,
  Trophy,
  Volume2,
} from "lucide-react";
import { useEffect, useRef, useState } from "react";
import toast from "react-hot-toast";
import { useTranslation } from "react-i18next";
import { useLocation, useNavigate } from "react-router-dom";
import { twJoin } from "tailwind-merge";

const Flashcards = () => {
  const { t } = useTranslation();
  const { state } = useLocation();
  const navigate = useNavigate();

  if (!state) {
    navigate("/exercises", { replace: true });
    return null;
  }

  const { selectedCollectionId, languageCode } = state;
  const [words, setWords] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [reviewed, setReviewed] = useState(new Set([0]));
  const [isCompleted, setIsCompleted] = useState(false);
  const [animationKey, setAnimationKey] = useState(0);
  const [showExitDialog, setShowExitDialog] = useState(false);
  const activityRecorded = useRef(false);

  const totalCards = words.length;
  const reviewedCount = reviewed.size;
  const progressPercent =
    totalCards > 0 ? (reviewedCount / totalCards) * 100 : 0;

  const shuffleArray = (array) => {
    const shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
  };

  const getAllWordsByCollection = async () => {
    try {
      const response = await apiRequest.get(
        `/api/words/wordCollection/${selectedCollectionId}`,
        { params: { limit: 10000 } },
      );
      if (response.status === 200) {
        if (response.data.words.length === 0) {
          toast.error(t("exercisesPage.notEnoughWords"));
          navigate(-1);
          return;
        }
        setWords(response.data.words);
      }
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    getAllWordsByCollection();
  }, []);

  const recordActivityOnce = () => {
    if (!activityRecorded.current) {
      activityRecorded.current = true;
      apiRequest
        .post("/api/dashboard/activity", { type: "exercise" })
        .catch(console.error);
    }
  };

  const flipCard = () => {
    setIsFlipped((prev) => !prev);
    recordActivityOnce();
  };

  const goToIndex = (nextIndex) => {
    setIsFlipped(false);
    setCurrentIndex(nextIndex);
    setAnimationKey((prev) => prev + 1);
    setReviewed((prev) => {
      const next = new Set(prev);
      next.add(nextIndex);
      if (next.size === totalCards && totalCards > 0) {
        setIsCompleted(true);
      }
      return next;
    });
  };

  const nextCard = () => {
    if (totalCards === 0) return;
    const nextIndex = (currentIndex + 1) % totalCards;
    goToIndex(nextIndex);
  };

  const previousCard = () => {
    if (totalCards === 0) return;
    const prevIndex = currentIndex === 0 ? totalCards - 1 : currentIndex - 1;
    goToIndex(prevIndex);
  };

  const shuffleDeck = () => {
    if (totalCards === 0) return;
    setWords((prev) => shuffleArray(prev));
    setIsFlipped(false);
    setCurrentIndex(0);
    setReviewed(new Set([0]));
    setIsCompleted(false);
    setAnimationKey((prev) => prev + 1);
  };

  const resetDeck = () => {
    setIsFlipped(false);
    setCurrentIndex(0);
    setReviewed(new Set([0]));
    setIsCompleted(false);
    setAnimationKey((prev) => prev + 1);
  };

  const handleBackClick = () => {
    if (reviewedCount > 1 && !isCompleted) {
      setShowExitDialog(true);
    } else {
      navigate(-1);
    }
  };

  const playAudio = async (text, lang) => {
    try {
      const response = await apiRequest.post(
        "/api/tts/synthesize",
        { text, languageCode: lang },
        { responseType: "blob" },
      );
      const audioBlob = new Blob([response.data], { type: "audio/mpeg" });
      const audioUrl = URL.createObjectURL(audioBlob);
      const audio = new Audio(audioUrl);
      audio.play();
    } catch (error) {
      console.error("Error playing audio:", error);
    }
  };

  // Loading state
  if (words.length === 0 && !isCompleted) {
    return (
      <main className="bg-background text-foreground py-4">
        <div className="max-w-2xl mx-auto">
          <div className="flex items-center gap-3 mb-6">
            <Skeleton className="h-9 w-9 rounded-md" />
            <Skeleton className="h-6 w-48" />
          </div>
          <Skeleton className="h-2 w-full rounded-full mb-8" />
          <Skeleton className="h-64 w-full rounded-2xl mb-6" />
          <div className="flex justify-center gap-3">
            <Skeleton className="h-10 w-24 rounded-xl" />
            <Skeleton className="h-10 w-24 rounded-xl" />
          </div>
        </div>
      </main>
    );
  }

  // Completion screen
  if (isCompleted) {
    return (
      <main className="bg-background text-foreground py-4">
        <div className="max-w-md mx-auto text-center animate-fade-in-up">
          <div className="bg-card rounded-3xl p-8 shadow-md border border-border">
            <div className="flex justify-center mb-4">
              <div className="bg-primary/10 rounded-full p-5">
                <Trophy className="h-12 w-12 text-primary" />
              </div>
            </div>

            <h2 className="text-2xl font-bold mb-2">
              {t("flashcardsExercise.completed")}
            </h2>
            <p className="text-muted-foreground text-sm mb-6">
              {t("flashcardsExercise.completedDescription")}
            </p>

            <div className="bg-muted/50 rounded-2xl p-6 mb-6">
              <span className="text-sm text-muted-foreground font-medium">
                {t("flashcardsExercise.cardsReviewed")}
              </span>
              <div className="text-5xl font-bold text-primary mt-1">
                {reviewedCount}
                <span className="text-lg text-muted-foreground font-normal">
                  {" "}
                  / {totalCards}
                </span>
              </div>
            </div>

            <div className="flex flex-col gap-3">
              <Button onClick={resetDeck} className="w-full gap-2">
                <RotateCcw className="h-4 w-4" />
                {t("flashcardsExercise.restart")}
              </Button>
              <Button
                variant="outline"
                onClick={() => navigate(-1)}
                className="w-full gap-2"
              >
                <ArrowLeft className="h-4 w-4" />
                {t("flashcardsExercise.goBack")}
              </Button>
            </div>
          </div>
        </div>
      </main>
    );
  }

  const currentWord = words[currentIndex];

  return (
    <main className="bg-background text-foreground py-4 animate-fade-in-up">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <Button size="sm" variant="outline" onClick={handleBackClick}>
              <ArrowLeft className="w-4 h-4" />
            </Button>
            <h1 className="text-lg font-semibold">
              {t("flashcardsExercise.title")}
            </h1>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium text-muted-foreground">
              {t("flashcardsExercise.cardOf", {
                current: currentIndex + 1,
                total: totalCards,
              })}
            </span>
          </div>
        </div>

        {/* Progress bar */}
        <Progress value={progressPercent} className="h-2 mb-6" />

        {/* Flip card */}
        <div
          key={animationKey}
          className="mb-6 animate-scale-in"
          style={{ perspective: "1200px" }}
        >
          <div
            onClick={flipCard}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === " ") {
                e.preventDefault();
                flipCard();
              }
            }}
            className="relative w-full h-64 sm:h-72 cursor-pointer select-none outline-none"
            style={{
              transformStyle: "preserve-3d",
              transition: "transform 0.6s",
              transform: isFlipped ? "rotateY(180deg)" : "rotateY(0deg)",
            }}
          >
            {/* Front */}
            <div
              className="absolute inset-0 bg-card rounded-2xl border border-border shadow-sm p-6 flex flex-col items-center justify-center"
              style={{ backfaceVisibility: "hidden", WebkitBackfaceVisibility: "hidden" }}
            >
              <span className="text-xs uppercase tracking-wider text-muted-foreground mb-3">
                {t("flashcardsExercise.flipHint")}
              </span>
              <div className="flex items-center justify-center gap-3">
                <Button
                  variant="ghost"
                  size="sm"
                  className="rounded-full h-10 w-10 p-0 hover:bg-primary/10"
                  onClick={(e) => {
                    e.stopPropagation();
                    playAudio(currentWord.nativeWord, languageCode);
                  }}
                >
                  <Volume2 className="h-5 w-5" />
                  <span className="sr-only">{t("common.playAudio")}</span>
                </Button>
                <span className="text-3xl sm:text-4xl font-bold tracking-tight font-serif text-center break-words">
                  {currentWord.nativeWord}
                </span>
              </div>
            </div>

            {/* Back */}
            <div
              className="absolute inset-0 bg-card rounded-2xl border border-border shadow-sm p-6 flex flex-col items-center justify-center"
              style={{
                backfaceVisibility: "hidden",
                WebkitBackfaceVisibility: "hidden",
                transform: "rotateY(180deg)",
              }}
            >
              <span className="text-3xl sm:text-4xl font-bold tracking-tight font-serif text-primary text-center break-words">
                {currentWord.targetWord}
              </span>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <div className="grid grid-cols-3 gap-3 mb-4">
          <Button
            variant="outline"
            onClick={previousCard}
            className="gap-2"
            disabled={totalCards <= 1}
          >
            <ChevronLeft className="h-4 w-4" />
            <span className="hidden sm:inline">
              {t("flashcardsExercise.previous")}
            </span>
          </Button>
          <Button onClick={flipCard} className="gap-2">
            <RotateCcw className="h-4 w-4" />
            {t("flashcardsExercise.flip")}
          </Button>
          <Button
            variant="outline"
            onClick={nextCard}
            className="gap-2"
            disabled={totalCards <= 1}
          >
            <span className="hidden sm:inline">
              {t("flashcardsExercise.next")}
            </span>
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>

        {/* Deck controls */}
        <div className="flex justify-center gap-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={shuffleDeck}
            className={twJoin(
              "gap-2 text-muted-foreground hover:text-foreground",
              totalCards <= 1 && "opacity-50 pointer-events-none",
            )}
          >
            <ShuffleIcon className="h-4 w-4" />
            {t("flashcardsExercise.shuffle")}
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={resetDeck}
            className="gap-2 text-muted-foreground hover:text-foreground"
          >
            <RotateCcw className="h-4 w-4" />
            {t("flashcardsExercise.reset")}
          </Button>
        </div>
      </div>

      {/* Exit confirmation dialog */}
      <Dialog open={showExitDialog} onOpenChange={setShowExitDialog}>
        <DialogContent className="sm:max-w-sm" aria-describedby="exit-desc">
          <DialogHeader className="text-center sm:text-center">
            <DialogTitle>{t("flashcardsExercise.exitTitle")}</DialogTitle>
            <DialogDescription id="exit-desc">
              {t("flashcardsExercise.exitDescription")}
            </DialogDescription>
          </DialogHeader>

          <div className="bg-muted/50 rounded-xl p-4 text-center">
            <div className="text-2xl font-bold text-foreground">
              {reviewedCount}
              <span className="text-sm font-normal text-muted-foreground">
                {" "}
                / {totalCards}
              </span>
            </div>
            <span className="text-xs text-muted-foreground">
              {t("flashcardsExercise.cardsReviewed")}
            </span>
          </div>

          <DialogFooter className="flex gap-2 sm:flex-row">
            <Button
              variant="outline"
              className="flex-1 gap-2"
              onClick={() => setShowExitDialog(false)}
            >
              {t("flashcardsExercise.exitContinue")}
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
              {t("flashcardsExercise.exitEnd")}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </main>
  );
};

export default Flashcards;
