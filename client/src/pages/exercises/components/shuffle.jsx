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
  RefreshCcw,
  RotateCcw,
  Trophy,
  Volume2,
  XCircle,
} from "lucide-react";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useTranslation } from "react-i18next";
import { useLocation, useNavigate } from "react-router-dom";
import { twJoin } from "tailwind-merge";

const Shuffle = () => {
  const { t } = useTranslation();
  const { state } = useLocation();
  const navigate = useNavigate();

  if (!state) {
    navigate("/exercises", { replace: true });
    return null;
  }

  const { selectedCollectionId, preset, languageCode } = state;
  const [words, setWords] = useState([]);
  const [currentWord, setCurrentWord] = useState(null);
  const [options, setOptions] = useState([]);
  const [isCorrect, setIsCorrect] = useState(null);
  const [selectedOption, setSelectedOption] = useState(null);
  const [score, setScore] = useState(0);
  const [usedWords, setUsedWords] = useState([]);
  const [isCompleted, setIsCompleted] = useState(false);
  const [animationKey, setAnimationKey] = useState(0);
  const [showExitDialog, setShowExitDialog] = useState(false);

  const totalWords = words.length;
  const currentQuestion = usedWords.length;
  const progressPercent =
    totalWords > 0 ? (currentQuestion / totalWords) * 100 : 0;

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
        if (response.data.words.length < 4) {
          toast.error(t("exercisesPage.notEnoughWords"));
          navigate(-1);
          return;
        }
        setWords(response.data.words);
        nextWord(response.data.words);
      }
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    getAllWordsByCollection();
  }, []);

  const shuffleArray = (array) => {
    const shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
  };

  const nextWord = (wordsArray, usedWordsOverride) => {
    const used = usedWordsOverride ?? usedWords;
    const remainingWords = wordsArray.filter(
      (word) => !used.includes(word.targetWord),
    );

    if (remainingWords.length === 0) {
      setIsCompleted(true);
      return;
    }

    const shuffledWords = shuffleArray(remainingWords);
    const newCurrentWord = shuffledWords[0];
    setCurrentWord(newCurrentWord);
    setUsedWords((prev) => [...prev, newCurrentWord.targetWord]);

    const incorrectOptions = shuffleArray(
      wordsArray.filter((word) => word !== newCurrentWord),
    )
      .slice(0, 3)
      .map((word) => word.targetWord);

    const allOptions = shuffleArray([
      ...incorrectOptions,
      newCurrentWord.targetWord,
    ]);
    setOptions(allOptions);
    setIsCorrect(null);
    setSelectedOption(null);
    setAnimationKey((prev) => prev + 1);
  };

  const handleOptionClick = (option) => {
    if (isCorrect !== null) return;
    setSelectedOption(option);

    if (option === currentWord.targetWord) {
      setIsCorrect(true);
      setScore((prev) => prev + 1);
      apiRequest
        .post("/api/dashboard/activity", { type: "exercise" })
        .catch(console.error);
      setTimeout(() => {
        nextWord(words);
      }, 1200);
    } else {
      setIsCorrect(false);
    }
  };

  const handleNext = () => {
    const emptyUsed = [];
    setScore(0);
    setUsedWords(emptyUsed);
    nextWord(words, emptyUsed);
  };

  const resetGame = () => {
    const emptyUsed = [];
    setUsedWords(emptyUsed);
    setScore(0);
    setIsCorrect(null);
    setSelectedOption(null);
    setIsCompleted(false);
    nextWord(words, emptyUsed);
  };

  const handleBackClick = () => {
    if (currentQuestion > 0 && !isCompleted) {
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

  const getOptionStyle = (option) => {
    if (isCorrect === null) {
      return "bg-card border-2 border-border hover:border-primary/50 hover:shadow-md text-foreground";
    }
    if (option === currentWord.targetWord) {
      return "bg-green-50 dark:bg-green-950/40 border-2 border-green-500 text-green-800 dark:text-green-200";
    }
    if (option === selectedOption && isCorrect === false) {
      return "bg-red-50 dark:bg-red-950/40 border-2 border-red-400 text-red-800 dark:text-red-200";
    }
    return "bg-muted/50 border-2 border-transparent text-muted-foreground opacity-50";
  };

  // Loading state
  if (!currentWord && !isCompleted) {
    return (
      <main className="bg-background text-foreground py-4">
        <div className="max-w-2xl mx-auto">
          <div className="flex items-center gap-3 mb-6">
            <Skeleton className="h-9 w-9 rounded-md" />
            <Skeleton className="h-6 w-48" />
          </div>
          <Skeleton className="h-2 w-full rounded-full mb-8" />
          <Skeleton className="h-40 w-full rounded-2xl mb-6" />
          <div className="grid grid-cols-2 gap-3">
            {[...Array(4)].map((_, index) => (
              <Skeleton key={index} className="h-16 w-full rounded-xl" />
            ))}
          </div>
        </div>
      </main>
    );
  }

  // Completion screen
  if (isCompleted) {
    const percentage =
      totalWords > 0 ? Math.round((score / totalWords) * 100) : 0;
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
              {t("shuffleExercise.completed")}
            </h2>
            <p className="text-muted-foreground text-sm mb-6">
              {t("shuffleExercise.completedDescription")}
            </p>

            <div className="bg-muted/50 rounded-2xl p-6 mb-6">
              <span className="text-sm text-muted-foreground font-medium">
                {t("shuffleExercise.finalScore")}
              </span>
              <div className="text-5xl font-bold text-primary mt-1">
                {score}
                <span className="text-lg text-muted-foreground font-normal">
                  {" "}
                  / {totalWords}
                </span>
              </div>
              <div className="text-sm text-muted-foreground mt-2">
                {percentage}%
              </div>
            </div>

            <div className="flex flex-col gap-3">
              <Button onClick={resetGame} className="w-full gap-2">
                <RotateCcw className="h-4 w-4" />
                {t("shuffleExercise.restart")}
              </Button>
              <Button
                variant="outline"
                onClick={() => navigate(-1)}
                className="w-full gap-2"
              >
                <ArrowLeft className="h-4 w-4" />
                {t("shuffleExercise.goBack")}
              </Button>
            </div>
          </div>
        </div>
      </main>
    );
  }

  // Main exercise view
  return (
    <main className="bg-background text-foreground py-4">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <Button size="sm" variant="outline" onClick={handleBackClick}>
              <ArrowLeft className="w-4 h-4" />
            </Button>
            <h1 className="text-lg font-semibold">
              {t("shuffleExercise.title")}
            </h1>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium text-muted-foreground">
              {t("shuffleExercise.questionOf", {
                current: currentQuestion,
                total: totalWords,
              })}
            </span>
          </div>
        </div>

        {/* Progress bar */}
        <Progress value={progressPercent} className="h-2 mb-6" />

        {/* Score badge */}
        <div className="flex justify-center mb-5">
          <div
            className={twJoin(
              "inline-flex items-center gap-2 rounded-full px-5 py-2 text-sm font-semibold shadow-sm transition-all",
              "bg-card border border-border",
            )}
          >
            <span className="text-muted-foreground">
              {t("shuffleExercise.score")}:
            </span>
            <span
              className={twJoin(
                "text-lg font-bold text-primary transition-all",
                isCorrect === true && "animate-pop",
              )}
            >
              {score}
            </span>
          </div>
        </div>

        {/* Word card */}
        <div
          key={animationKey}
          className="bg-card rounded-2xl border border-border shadow-sm p-6 mb-6 text-center animate-scale-in"
        >
          <div className="flex items-center justify-center gap-3">
            <Button
              variant="ghost"
              size="sm"
              className="rounded-full h-10 w-10 p-0 hover:bg-primary/10"
              onClick={() => playAudio(currentWord.nativeWord, languageCode)}
            >
              <Volume2 className="h-5 w-5" />
              <span className="sr-only">{t("common.playAudio")}</span>
            </Button>
            <span className="text-3xl font-bold tracking-tight">
              {currentWord.nativeWord}
            </span>
          </div>
        </div>

        {/* Options grid */}
        <div
          key={`opts-${animationKey}`}
          className="grid grid-cols-1 sm:grid-cols-2 gap-3"
        >
          {options.map((option, index) => (
            <button
              key={index}
              onClick={() => handleOptionClick(option)}
              disabled={isCorrect !== null}
              style={{ animationDelay: `${index * 60}ms` }}
              className={twJoin(
                "relative py-4 px-5 text-base font-medium rounded-xl transition-all duration-200 animate-fade-in-up",
                getOptionStyle(option),
                isCorrect === null && "cursor-pointer active:scale-[0.97]",
                isCorrect !== null && "cursor-default",
              )}
            >
              <span className="flex items-center justify-center gap-2">
                {isCorrect !== null && option === currentWord.targetWord && (
                  <CheckCircle2 className="h-5 w-5 text-green-600 dark:text-green-400 shrink-0" />
                )}
                {isCorrect === false && option === selectedOption && (
                  <XCircle className="h-5 w-5 text-red-500 dark:text-red-400 shrink-0" />
                )}
                <span className="truncate">{option}</span>
              </span>
            </button>
          ))}
        </div>

        {/* Feedback area */}
        {isCorrect === true && (
          <div className="mt-5 text-center animate-fade-in-up">
            <span className="inline-flex items-center gap-2 text-green-600 dark:text-green-400 font-semibold text-sm">
              <CheckCircle2 className="h-4 w-4" />
              {t("shuffleExercise.correct")}
            </span>
          </div>
        )}

        {isCorrect === false && (
          <div className="mt-5 text-center animate-fade-in-up">
            <p className="inline-flex items-center gap-2 text-red-600 dark:text-red-400 font-semibold text-sm mb-4">
              <XCircle className="h-4 w-4" />
              {t("shuffleExercise.incorrect")}{" "}
              <span className="font-bold">{currentWord.targetWord}</span>
            </p>
            <div className="flex justify-center gap-3">
              <Button
                variant="outline"
                size="sm"
                onClick={handleNext}
                className="gap-2"
              >
                <RefreshCcw className="h-4 w-4" />
                {t("shuffleExercise.nextWord")}
              </Button>
            </div>
          </div>
        )}
      </div>

      {/* Exit confirmation dialog */}
      <Dialog open={showExitDialog} onOpenChange={setShowExitDialog}>
        <DialogContent className="sm:max-w-sm" aria-describedby="exit-desc">
          <DialogHeader className="text-center sm:text-center">
            <DialogTitle>{t("shuffleExercise.exitTitle")}</DialogTitle>
            <DialogDescription id="exit-desc">
              {t("shuffleExercise.exitDescription")}
            </DialogDescription>
          </DialogHeader>

          <div className="grid grid-cols-2 gap-3 py-2">
            <div className="bg-muted/50 rounded-xl p-4 text-center">
              <div className="text-2xl font-bold text-foreground">
                {currentQuestion}
                <span className="text-sm font-normal text-muted-foreground">
                  {" "}
                  / {totalWords}
                </span>
              </div>
              <span className="text-xs text-muted-foreground">
                {t("shuffleExercise.wordsCompleted")}
              </span>
            </div>
            <div className="bg-muted/50 rounded-xl p-4 text-center">
              <div className="text-2xl font-bold text-primary">
                {score}
                <span className="text-sm font-normal text-muted-foreground">
                  {" "}
                  / {currentQuestion}
                </span>
              </div>
              <span className="text-xs text-muted-foreground">
                {t("shuffleExercise.correctAnswers")}
              </span>
            </div>
          </div>

          <DialogFooter className="flex gap-2 sm:flex-row">
            <Button
              variant="outline"
              className="flex-1 gap-2"
              onClick={() => setShowExitDialog(false)}
            >
              {t("shuffleExercise.exitContinue")}
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
              {t("shuffleExercise.exitEnd")}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </main>
  );
};

export default Shuffle;
