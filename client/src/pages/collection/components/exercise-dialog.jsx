import { useState } from 'react'
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button";
// import { exercises } from "@/constants/constants";
import { useNavigate } from 'react-router-dom';
import { ArrowUpRight, PlayIcon } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { twJoin } from 'tailwind-merge';
import { useExercises } from '@/hooks/useExercises';
import { scrollToTop } from '@/lib/utils';
import { apiRequest } from '@/api/config';

const ExerciseDialog = ({ selectedCollectionId, preset = false, languageCode = null }) => {
    const { t } = useTranslation();
    const navigate = useNavigate();
    const exercises = useExercises();
    const [open, setOpen] = useState(false);
    const [selectedExercise, setSelectedExercise] = useState(null)

    const getCollectionById = async (id) => {
        try {
            const collectionRes = await apiRequest.get(`/api/wordCollections/${id}`);
            if (collectionRes.status === 200) {
                return collectionRes.data;
            }
        } catch (error) {
            console.error(error)
        }
    };

    const handleNavigate = async () => {
        if (!preset) {
            const col = await getCollectionById(selectedCollectionId);
            navigate(`/exercises/${selectedExercise.path}`, { state: { selectedCollectionId, preset, languageCode: col.targetLanguage.code } })
        } else {
            navigate(`/exercises/${selectedExercise.path}`, { state: { selectedCollectionId, preset, languageCode } })
        }
        scrollToTop();
    }

    return (
        <Dialog open={open} onOpenChange={(val) => {
            setOpen(val);
            setSelectedExercise(null)
        }}>
            <DialogTrigger asChild>
                <Button size="sm" className="text-xs w-full md:w-auto flex gap-1">
                    {t('collectionPage.exerciseDialogButton')}
                    <ArrowUpRight size="1rem" />
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[625px]" aria-describedby={undefined}>
                <DialogHeader>
                    <DialogTitle>{t('collectionPage.exerciseDialogTitle')}</DialogTitle>
                </DialogHeader>
                <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 gap-4'>
                    {exercises.map((exercise, index) => (
                        <Card key={index} onClick={() => setSelectedExercise(exercise)} className={twJoin(selectedExercise === exercise && 'shadow-md transition-shadow duration-300 bg-gray-600 text-white', 'h-24 px-4 py-2 flex items-center cursor-pointer')}>
                            <CardContent className="flex items-center justify-center p-0">
                                <div className="text-primary hover:text-primary-foreground">
                                    <PlayIcon className="w-8 h-8" />
                                    <span className="sr-only">Start {exercise.name}</span>
                                </div>
                            </CardContent>
                            <CardHeader className="p-2 flex ">
                                <CardTitle className="text-sm">{exercise.name}</CardTitle>
                                <CardDescription className={twJoin(selectedExercise === exercise && "text-white", "text-xs")}>{exercise.description}</CardDescription>
                            </CardHeader>
                        </Card>
                    ))}
                </div>
                <DialogFooter>
                    <Button
                        disabled={selectedExercise === null}
                        onClick={async () => {
                            if (selectedCollectionId) {
                                await handleNavigate();
                            }
                        }}
                    >
                        {t('exercisesPage.start')}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}

export default ExerciseDialog