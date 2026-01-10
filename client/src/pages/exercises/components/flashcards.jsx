import { apiRequest } from "@/api/config";
import { Button } from "@/components/ui/button";
import { useEffect, useRef, useState } from "react";
import { useLocation } from "react-router-dom";

const Flashcards = () => {
  const { state } = useLocation();
  const { selectedCollectionId } = state;
  const [words, setWords] = useState([]);
  const [currentWordIndex, setCurrentWordIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const activityRecorded = useRef(false);

  const getAllWordsByCollection = async () => {
    try {
      const response = await apiRequest.get(
        `/api/words/wordCollection/${selectedCollectionId}`,
        { params: { limit: 10000 } }
      );
      if (response.status === 200) {
        setWords(response.data.words);
      }
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    getAllWordsByCollection();
  }, []);

  const flipCard = () => {
    setIsFlipped(!isFlipped);
    // Record activity on first flip (user started practicing)
    if (!activityRecorded.current) {
      activityRecorded.current = true;
      apiRequest
        .post("/api/dashboard/activity", { type: "exercise" })
        .catch(console.error);
    }
  };

  const nextCard = () => {
    setIsFlipped(false);
    setCurrentWordIndex((prevIndex) => (prevIndex + 1) % words.length);
  };

  const previousCard = () => {
    setIsFlipped(false);
    setCurrentWordIndex((prevIndex) => {
      if (prevIndex === 0) return words.length - 1;
      return (prevIndex - 1) % words.length;
    });
  };

  if (words.length === 0) {
    return <div>Loading...</div>;
  }

  const currentWord = words[currentWordIndex];

  return (
    <main className="flex-1 container px-4 md:px-62">
      <div className="max-w-2xl mx-auto p-4 text-center">
        <div className="py-4 flex items-center gap-2 text-2xl font-semibold underline underline-offset-2">
          <span>Flashcards Exercise</span>
        </div>
        <div
          className="mx-auto py-8 w-full h-40 bg-white rounded-lg shadow-md dark:bg-gray-800 dark:text-white flex items-center justify-center perspective-1000 cursor-pointer transform-style-preserve-3d transition-transform duration-600 ease-in-out hover:shadow-lg"
          onClick={flipCard}
        >
          {isFlipped ? currentWord.targetWord : currentWord.nativeWord}
        </div>
        <div className="flex items-center justify-center gap-4 py-4">
          <Button
            className="p-2 px-4 text-sm font-semibold rounded-lg"
            onClick={previousCard}
          >
            Previous
          </Button>
          <Button
            className="p-2 px-4 text-sm font-semibold rounded-lg"
            onClick={nextCard}
          >
            Next
          </Button>
        </div>
      </div>
    </main>
  );
};

export default Flashcards;