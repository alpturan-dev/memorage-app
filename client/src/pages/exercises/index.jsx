import { Button } from "@/components/ui/button"
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useEffect, useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import { exercises } from "@/constants/constants";
import { apiRequest } from "@/api/config"
import { useTranslation } from "react-i18next"

const Exercises = () => {
    const { t } = useTranslation();
    const navigate = useNavigate();
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
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
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
                </div>
            </main>
        </div>
    )
}

export default Exercises;

function FilePenIcon(props) {
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
            <path d="M12 22h6a2 2 0 0 0 2-2V7l-5-5H6a2 2 0 0 0-2 2v10" />
            <path d="M14 2v4a2 2 0 0 0 2 2h4" />
            <path d="M10.4 12.6a2 2 0 1 1 3 3L8 21l-4 1 1-4Z" />
        </svg>
    )
}


function LayoutGridIcon(props) {
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
            <rect width="7" height="7" x="3" y="3" rx="1" />
            <rect width="7" height="7" x="14" y="3" rx="1" />
            <rect width="7" height="7" x="14" y="14" rx="1" />
            <rect width="7" height="7" x="3" y="14" rx="1" />
        </svg>
    )
}


function MicIcon(props) {
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
            <path d="M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3Z" />
            <path d="M19 10v2a7 7 0 0 1-14 0v-2" />
            <line x1="12" x2="12" y1="19" y2="22" />
        </svg>
    )
}


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


function PuzzleIcon(props) {
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
            <path d="M19.439 7.85c-.049.322.059.648.289.878l1.568 1.568c.47.47.706 1.087.706 1.704s-.235 1.233-.706 1.704l-1.611 1.611a.98.98 0 0 1-.837.276c-.47-.07-.802-.48-.968-.925a2.501 2.501 0 1 0-3.214 3.214c.446.166.855.497.925.968a.979.979 0 0 1-.276.837l-1.61 1.61a2.404 2.404 0 0 1-1.705.707 2.402 2.402 0 0 1-1.704-.706l-1.568-1.568a1.026 1.026 0 0 0-.877-.29c-.493.074-.84.504-1.02.968a2.5 2.5 0 1 1-3.237-3.237c.464-.18.894-.527.967-1.02a1.026 1.026 0 0 0-.289-.877l-1.568-1.568A2.402 2.402 0 0 1 1.998 12c0-.617.236-1.234.706-1.704L4.23 8.77c.24-.24.581-.353.917-.303.515.077.877.528 1.073 1.01a2.5 2.5 0 1 0 3.259-3.259c-.482-.196-.933-.558-1.01-1.073-.05-.336.062-.676.303-.917l1.525-1.525A2.402 2.402 0 0 1 12 1.998c.617 0 1.234.236 1.704.706l1.568 1.568c.23.23.556.338.877.29.493-.074.84-.504 1.02-.968a2.5 2.5 0 1 1 3.237 3.237c-.464.18-.894.527-.967 1.02Z" />
        </svg>
    )
}


function ShuffleIcon(props) {
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
            <path d="M2 18h1.4c1.3 0 2.5-.6 3.3-1.7l6.1-8.6c.7-1.1 2-1.7 3.3-1.7H22" />
            <path d="m18 2 4 4-4 4" />
            <path d="M2 6h1.9c1.5 0 2.9.9 3.6 2.2" />
            <path d="M22 18h-5.9c-1.3 0-2.6-.7-3.3-1.8l-.5-.8" />
            <path d="m18 14 4 4-4 4" />
        </svg>
    )
}