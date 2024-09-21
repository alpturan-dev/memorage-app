import { Button } from "@/components/ui/button"
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useEffect, useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import { apiRequest } from "@/api/config"
import { useTranslation } from "react-i18next"
import { useExercises } from "@/hooks/useExercises"

const Exercises = () => {
    const { t } = useTranslation();
    const navigate = useNavigate();
    const exercises = useExercises();
    const [selectedExercise, setSelectedExercise] = useState(null);
    const [selectedCollectionId, setSelectedCollectionId] = useState(null);
    const [wordCollections, setWordCollections] = useState([]);

    const getAllWordCollections = async () => {
        try {
            const response = await apiRequest.get('/api/wordCollections');
            if (response.status === 200) {
                setWordCollections(response.data);
            }
        } catch (error) {
            console.error(error)
        }
    };

    useEffect(() => {
        getAllWordCollections();
    }, []);

    return (
        <div className="flex flex-col min-h-screen bg-muted/40">
            <main className="flex-1 py-2">
                <Link to="/exercises" className="py-4 flex items-center gap-2 text-2xl font-semibold">
                    <span>{t('exercisesPage.title')}</span>
                </Link>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
                    {exercises.map((exercise, index) => (
                        <Dialog key={index}>
                            <DialogTrigger asChild>
                                <Card onClick={() => setSelectedExercise(exercise)}>
                                    <CardHeader>
                                        <CardTitle>{exercise.name}</CardTitle>
                                        <CardDescription>{exercise.description}</CardDescription>
                                    </CardHeader>
                                    <CardContent className="flex items-center justify-center h-40">
                                        <div className="text-primary hover:text-primary-foreground">
                                            <PlayIcon className="w-8 h-8" />
                                            <span className="sr-only">Start {exercise.name}</span>
                                        </div>
                                    </CardContent>
                                </Card>
                            </DialogTrigger>
                            <DialogContent className="sm:max-w-[425px]">
                                <DialogHeader>
                                    <DialogTitle>{t('exercisesPage.dialogTitle')}</DialogTitle>
                                    <DialogDescription>
                                        {t('exercisesPage.dialogSubtitle', { exerciseName: exercise.name })}
                                    </DialogDescription>
                                </DialogHeader>
                                <div className="grid gap-4 py-4 w-full">
                                    <div className="flex items-center gap-4">
                                        <Label htmlFor="collection" className="text-right">
                                            {t('exercisesPage.collection')}
                                        </Label>
                                        <Select
                                            id="collection"
                                            value={selectedCollectionId}
                                            onValueChange={setSelectedCollectionId}
                                            className="col-span-4"
                                        >
                                            <SelectTrigger className="w-full">
                                                <SelectValue placeholder={t('collectionsPage.selectLanguage')} />
                                            </SelectTrigger>
                                            <SelectContent>
                                                {wordCollections.map((item) => (
                                                    <SelectItem key={item._id} value={item._id}>{item.name}</SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                    </div>
                                </div>
                                <DialogFooter>
                                    <Button
                                        onClick={() => {
                                            if (selectedCollectionId) {
                                                navigate(`/exercises/${selectedExercise.path}`, { state: { selectedCollectionId } })
                                            }
                                        }}
                                    >
                                        {t('exercisesPage.start')}
                                    </Button>
                                </DialogFooter>
                            </DialogContent>
                        </Dialog>
                    ))}
                    <div className="relative opacity-60">
                        <div className={'absolute top-1 right-1 text-base z-50 font-bold bg-gradient-to-r from-[#016DCC] to-purple-600 bg-clip-text text-transparent rounded-sm px-0.5'}>
                            {t('comingSoon.comingSoon')}
                        </div>
                        <Card className="cursor-not-allowed">
                            <CardHeader>
                                <CardTitle>{t('fillInTheBlanksExercise.name')}</CardTitle>
                                <CardDescription>{t('fillInTheBlanksExercise.description')}</CardDescription>
                            </CardHeader>
                            <CardContent className="flex items-center justify-center h-40">
                                <div className="text-primary hover:text-primary-foreground">
                                    <PlayIcon className="w-8 h-8" />
                                    <span className="sr-only">Start {t('fillInTheBlanksExercise.name')}</span>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </main>
        </div>
    )
}

export default Exercises;

function PlayIcon(props) {
    return (
        <svg
            {...props}
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
        >
            <polygon points="6 3 20 12 6 21 6 3" />
        </svg>
    )
}
