import { apiRequest } from "@/api/config";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";

const Shuffle = () => {
    const { state } = useLocation();
    const { selectedCollectionId } = state;
    const [words, setWords] = useState([]);
    const [currentWord, setCurrentWord] = useState(null);
    const [options, setOptions] = useState([]);
    const [isCorrect, setIsCorrect] = useState(null);
    const [score, setScore] = useState(0);
    const [showTryAgain, setShowTryAgain] = useState(false);

    const getAllWordsByCollection = async () => {
        try {
            const response = await apiRequest.get(`/api/words/wordCollection/${selectedCollectionId}`);
            if (response.status === 200) {
                setWords(response.data);
                nextWord(response.data);
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
        const shuffledWords = shuffleArray(wordsArray || words);
        const newCurrentWord = shuffledWords[0];
        setCurrentWord(newCurrentWord);

        const incorrectOptions = shuffleArray(shuffledWords.filter(word => word !== newCurrentWord))
            .slice(0, 3)
            .map(word => word.targetWord);

        const allOptions = shuffleArray([...incorrectOptions, newCurrentWord.targetWord]);
        setOptions(allOptions);
        setIsCorrect(null);
        setShowTryAgain(false);
    };

    const handleOptionClick = (selectedOption) => {
        if (isCorrect !== null) return; // Prevent multiple clicks

        if (selectedOption === currentWord.targetWord) {
            setIsCorrect(true);
            setScore(score + 1);
            setTimeout(() => nextWord(), 1000);
        } else {
            setIsCorrect(false);
            setShowTryAgain(true);
        }
    };

    const handleTryAgain = () => {
        setIsCorrect(null);
        setShowTryAgain(false);
    };

    if (!currentWord) {
        return <div className="text-center text-xl">Loading...</div>;
    }

    return (
        <main className="flex-1 container px-4 md:px-62">
            <div className="max-w-2xl mx-auto p-4 text-center">
                <div className="py-4 flex items-center gap-2 text-2xl font-semibold underline underline-offset-2">
                    <span>Shuffle Exercise</span>
                </div>
                <h2 className="text-2xl font-bold mb-4">Score: {score}</h2>
                <hr className="shadow-xl" />
                <div className="text-3xl font-semibold my-6">{currentWord.nativeWord}</div>
                <div className="grid grid-cols-2 gap-4">
                    {options.map((option, index) => (
                        <button
                            key={index}
                            onClick={() => handleOptionClick(option)}
                            className={`
              py-3 px-4 text-lg font-medium rounded-lg transition-colors duration-200
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
                        Incorrect. The correct answer is: {currentWord.targetWord}
                    </div>
                )}
                {showTryAgain && (
                    <Button
                        onClick={handleTryAgain}
                        className="mt-4 font-bold py-2 px-4 rounded"
                    >
                        Try Again
                    </Button>
                )}
            </div>
        </main>
    )
}

export default Shuffle