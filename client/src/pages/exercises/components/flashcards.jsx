import { apiRequest } from "@/api/config";
import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom"

const Flashcards = () => {
    const { state } = useLocation();
    const { selectedCollectionId } = state;
    const [words, setWords] = useState([]);

    const getAllWordsByCollection = async () => {
        try {
            const response = await apiRequest.get(`/api/words/wordCollection/${selectedCollectionId}`);
            if (response.status === 200) {
                setWords(response.data);
            }
        } catch (error) {
            console.error(error)
        }
    };

    useEffect(() => {
        getAllWordsByCollection();
    }, []);

    return (
        <div>
            Flashcards
            <div>
                {words.map((word) => (
                    <div key={word._id}>{word.nativeWord} - {word.targetWord}</div>
                ))}
            </div>
        </div>
    )
}

export default Flashcards