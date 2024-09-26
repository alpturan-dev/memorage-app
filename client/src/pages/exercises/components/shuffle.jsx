import { apiRequest } from "@/api/config";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useLocation } from "react-router-dom";

const Shuffle = () => {
    const { t } = useTranslation();
    const { state } = useLocation();
    const { selectedCollectionId, preset } = state;
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
                response = await apiRequest.get(`/api/preset-collections/byId/${selectedCollectionId}`);
            } else {
                response = await apiRequest.get(`/api/words/wordCollection/${selectedCollectionId}`);
            }
            if (response.status === 200) {
                if (preset) {
                    setWords(response.data.words);
                    nextWord(response.data.words);
                } else {
                    setWords(response.data);
                    nextWord(response.data);
                }
            }
        } catch (error) {
            console.error(error)
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
        const remainingWords = wordsArray.filter(word => !usedWords.includes(word.targetWord));

        if (remainingWords.length === 0) {
            resetGame();
            return;
        }
        const shuffledWords = shuffleArray(remainingWords);
        const newCurrentWord = shuffledWords[0];
        setCurrentWord(newCurrentWord);
        setUsedWords(prev => [...prev, newCurrentWord.targetWord]);

        const incorrectOptions = shuffleArray(shuffledWords.filter(word => word !== newCurrentWord))
            .slice(0, 3)
            .map(word => word.targetWord);

        const allOptions = shuffleArray([...incorrectOptions, newCurrentWord.targetWord]);
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

    if (!currentWord) {
        return <main className="bg-background text-foreground py-4">
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
    }

    return (
        <main className="bg-background text-foreground py-4">
            <div className="mx-auto text-center">
                <div className="py-4 flex items-center gap-2 text-2xl font-semibold">
                    <span>{t('shuffleExercise.title')}</span>
                </div>
                <hr className="shadow-xl" />
                <div className="pt-6 w-full flex justify-center">
                    <div className="relative w-1/2 sm:w-1/4">
                        <h2 className="rounded-lg py-2 px-4 text-2xl font-bold bg-gray-700 text-white">
                            {t('shuffleExercise.score')} {score}
                        </h2>
                        {isCorrect && (
                            <span className="absolute top-0 right-0 transform translate-x-1 -translate-y-1 bg-green-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs animate-bounce">
                                +1
                            </span>
                        )}
                    </div>
                </div>
                <div className="text-3xl font-semibold my-6">{currentWord.nativeWord}</div>
                <div className="grid grid-cols-2 gap-4">
                    {options.map((option, index) => (
                        <button
                            key={index}
                            onClick={() => handleOptionClick(option)}
                            className={`
              py-3 px-4 text-lg font-medium rounded-lg transition-colors duration-200 overflow-auto
              ${isCorrect === true && option === currentWord.targetWord
                                    ? 'bg-green-500 text-white'
                                    : isCorrect === false && option !== currentWord.targetWord
                                        ? 'bg-red-500 text-white'
                                        : isCorrect === false && option === currentWord.targetWord
                                            ? 'bg-green-500 hover:bg-green-300'
                                            : 'bg-gray-200 hover:bg-gray-300'}
              ${isCorrect !== null ? 'cursor-not-allowed' : 'cursor-pointer'}
            `}
                            disabled={isCorrect !== null}
                        >
                            {option}
                        </button>
                    ))}
                </div>
                {isCorrect === false && (
                    <div className="mt-4 text-red-600 font-bold">
                        {t('shuffleExercise.incorrect')} {currentWord.targetWord}
                    </div>
                )}
                {showTryAgain && (
                    <Button
                        onClick={handleTryAgain}
                        className="mt-4 font-bold py-2 px-4 rounded"
                    >
                        {t('shuffleExercise.tryAgain')}
                    </Button>
                )}
            </div>
        </main>
    )
}

export default Shuffle