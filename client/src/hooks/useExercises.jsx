import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';

export const useExercises = () => {
    const { t, i18n } = useTranslation();
    const [exercises, setExercises] = useState([]);

    useEffect(() => {
        const updatedExercises = [
            {
                path: "shuffle",
                name: t('shuffleExercise.name'),
                description: t('shuffleExercise.description')
            },
            {
                path: "reverse-shuffle",
                name: t('reverseShuffleExercise.name'),
                description: t('reverseShuffleExercise.description')
            },
            {
                path: "flashcards",
                name: t('flashcardsExercise.name'),
                description: t('flashcardsExercise.description')
            }
        ];
        setExercises(updatedExercises);
    }, [t, i18n.language]);

    return exercises;
};