import { apiRequest } from "@/api/config";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { ArrowLeft, Volume2 } from "lucide-react";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useTranslation } from "react-i18next";
import { useLocation, useNavigate } from "react-router-dom";

const Shuffle = () => {
  const { t } = useTranslation();
  const { state } = useLocation();
  const navigate = useNavigate();
  const { selectedCollectionId, preset, languageCode } = state;
  const [words, setWords] = useState([]);
  const [currentWord, setCurrentWord] = useState(null);
  const [options, setOptions] = useState([]);
  const [isCorrect, setIsCorrect] = useState(null);
  const [score, setScore] = useState(0);
  const [showTryAgain, setShowTryAgain] = useState(false);
  const [usedWords, setUsedWords] = useState([]);

  const getAllWordsByCollection = async () => {
    try {
      let response = {};
      if (preset) {
        response = await apiRequest.get(
          `/api/preset-collections/byId/${selectedCollectionId}`
        );
      } else {
        response = await apiRequest.get(
          `/api/words/wordCollection/${selectedCollectionId}`
        );
      }
      if (response.status === 200) {
        if (preset) {
          if (response.data.words.length < 4) {
            toast.error(t("exercisesPage.notEnoughWords"));
            navigate(-1);
            return;
          }
          setWords(response.data.words);
          nextWord(response.data.words);
        } else {
          if (response.data.length < 4) {
            toast.error(t("exercisesPage.notEnoughWords"));
            navigate(-1);
            return;
          }
          setWords(response.data);
          nextWord(response.data);
        }
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

  const nextWord = (wordsArray) => {
    const remainingWords = wordsArray.filter(
      (word) => !usedWords.includes(word.targetWord)
    );

    if (remainingWords.length === 0) {
      resetGame();
      return;
    }
    const shuffledWords = shuffleArray(remainingWords);
    const newCurrentWord = shuffledWords[0];
    setCurrentWord(newCurrentWord);
    setUsedWords((prev) => [...prev, newCurrentWord.targetWord]);

    const incorrectOptions = shuffleArray(
      shuffledWords.filter((word) => word !== newCurrentWord)
    )
      .slice(0, 3)
      .map((word) => word.targetWord);

    const allOptions = shuffleArray([
      ...incorrectOptions,
      newCurrentWord.targetWord,
    ]);
    setOptions(allOptions);
    setIsCorrect(null);
    setShowTryAgain(false);
  };

  const handleOptionClick = (selectedOption) => {
    if (isCorrect !== null) return;

    if (selectedOption === currentWord.targetWord) {
      setIsCorrect(true);
      setScore(score + 1);
      setTimeout(() => nextWord(words), 700);
    } else {
      setIsCorrect(false);
      setShowTryAgain(true);
    }
  };

  const handleTryAgain = () => {
    setIsCorrect(null);
    setShowTryAgain(false);
    nextWord(words);
    setScore(0);
  };

  const resetGame = () => {
    setUsedWords([]);
    setScore(0);
    setShowTryAgain(false);
    setIsCorrect(null);
    nextWord(words);
  };

  const playAudio = async (text, lang) => {
    try {
      const response = await apiRequest.post(
        "/api/tts/synthesize",
        { text, languageCode: lang },
        { responseType: "blob" }
      );
      const audioBlob = new Blob([response.data], { type: "audio/mpeg" });
      const audioUrl = URL.createObjectURL(audioBlob);
      const audio = new Audio(audioUrl);
      audio.play();
    } catch (error) {
      console.error("Error playing audio:", error);
    }
  };

  if (!currentWord) {
    return (
      <main className="bg-background text-foreground py-4">
        <div className="mx-auto text-center">
          <div className="py-4 flex items-center gap-2 text-2xl font-semibold">
            <Skeleton className="h-8 w-64" />
          </div>
          <Skeleton className="h-px w-full my-1" />
          <div className="pt-6 w-full flex justify-center">
            <div className="relative w-1/2 sm:w-1/4">
              <Skeleton className="h-12 w-full rounded-lg" />
            </div>
          </div>
          <Skeleton className="h-12 w-64 mx-auto my-6" />
          <div className="grid grid-cols-2 gap-4">
            {[...Array(4)].map((_, index) => (
              <Skeleton key={index} className="h-14 w-full rounded-lg" />
            ))}
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="bg-background text-foreground py-4">
      <div className="mx-auto text-center">
        <div className="flex items-center gap-2 text-2xl font-semibold text-gray-900 dark:text-white">
          <div className="flex gap-2 items-center">
            <Button size="sm" variant="outline" onClick={() => navigate(-1)}>
              <ArrowLeft className="w-5 h-5" />
            </Button>
          </div>
          <div className="py-4 flex items-center gap-2 text-xl font-semibold">
            <span>{t("shuffleExercise.title")}</span>
          </div>
        </div>
        <div className="pt-6 w-full flex justify-center">
          <div className="relative w-1/3 md:w-1/6">
            <div className="rounded-lg py-0.5 px-0.25 md:py-1 md:px-2 text-xl font-bold bg-primary text-primary-foreground">
              {t("shuffleExercise.score")} {score}
            </div>
            {isCorrect && (
              <span className="absolute top-0 right-0 transform translate-x-1 -translate-y-1 bg-background text-white rounded-full w-6 h-6 flex items-center justify-center text-xs animate-bounce">
                +1
              </span>
            )}
          </div>
        </div>
        <div className="flex items-center justify-center my-7">
          <Button
            variant="ghost"
            className="py-0 pr-0 h-14 w-14"
            onClick={() => playAudio(currentWord.nativeWord, languageCode)}
          >
            <Volume2 className="mt-1.5" />
            <span className="sr-only">{t("common.playAudio")}</span>
          </Button>
          <span className="text-3xl font-semibold ">
            {currentWord.nativeWord}
          </span>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {options.map((option, index) => (
            <button
              key={index}
              onClick={() => handleOptionClick(option)}
              className={`
              py-1 px-2 md:py-3 md:px-4 text-lg font-medium rounded-lg transition-colors duration-200 overflow-auto
              ${
                isCorrect === true && option === currentWord.targetWord
                  ? "bg-primary text-white"
                  : isCorrect === false && option !== currentWord.targetWord
                  ? "bg-destructive text-white"
                  : isCorrect === false && option === currentWord.targetWord
                  ? "bg-primary hover:bg-primary/90 text-white"
                  : "bg-gray-200 hover:bg-gray-300"
              }
              ${isCorrect !== null ? "cursor-not-allowed" : "cursor-pointer"}
            `}
              disabled={isCorrect !== null}
            >
              {option}
            </button>
          ))}
        </div>
        {isCorrect === false && (
          <div className="mt-4 text-destructive font-bold">
            {t("shuffleExercise.incorrect")} {currentWord.targetWord}
          </div>
        )}
        {showTryAgain && (
          <Button
            onClick={handleTryAgain}
            className="mt-4 font-bold py-2 px-4 rounded"
          >
            {t("shuffleExercise.tryAgain")}
          </Button>
        )}
      </div>
    </main>
  );
};

export default Shuffle;
