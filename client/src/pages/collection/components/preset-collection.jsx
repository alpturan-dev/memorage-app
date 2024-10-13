import { apiRequest } from "@/api/config";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Skeleton } from "@/components/ui/skeleton";
import { useTranslation } from "react-i18next";
import ExerciseDialog from "./exercise-dialog";
import { languages } from "@/constants/constants";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Volume2 } from "lucide-react";

const PresetCollection = () => {
    const { t } = useTranslation();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const params = useParams();
    const [words, setWords] = useState([]);
    const [selectedCollection, setSelectedCollection] = useState({});

    const getPresetCollection = async () => {
        try {
            setLoading(true);
            const response = await apiRequest.get(`/api/preset-collections/${params.languageCode}/${params.level}`);
            if (response.status === 200) {
                setWords(response.data.words.reverse());
                setSelectedCollection({
                    name: languages.find((item) => item.code === params.languageCode).name + " " + params.level,
                    _id: response.data._id
                })
            }
        } catch (error) {
            console.error(error)
        } finally {
            setLoading(false);
        }
    };

    const playAudio = async (text, lang) => {
        try {
            const response = await apiRequest.post('/api/tts/synthesize', { text, languageCode: lang }, { responseType: 'blob' });
            const audioBlob = new Blob([response.data], { type: 'audio/mpeg' });
            const audioUrl = URL.createObjectURL(audioBlob);
            const audio = new Audio(audioUrl);
            audio.play();
        } catch (error) {
            console.error('Error playing audio:', error);
        }
    };

    useEffect(() => {
        getPresetCollection();
    }, []);

    return (
        <div className="bg-background text-foreground py-4">
            <div className="grid gap-4">
                <div className="flex items-center justify-between">
                    {loading ? (
                        <Skeleton className="h-[30px] w-[100px]" />
                    ) : (
                        <div className="flex gap-2 items-center">
                            <Button size="sm" variant="outline" onClick={() => navigate('/collections')}>
                                <ArrowLeft />
                            </Button>
                            <h1 className="text-xl font-bold">{selectedCollection.name}</h1>
                        </div>
                    )}
                    {loading ? (
                        <Skeleton className="h-[30px] w-[100px]" />
                    ) : (
                        <div className="flex gap-2 items-center">
                            <div className="hidden lg:block">
                                <ExerciseDialog selectedCollectionId={selectedCollection._id} preset={true} languageCode={params.languageCode} />
                            </div>
                            <div>{t('collectionPage.totalWords')} {words.length}</div>
                        </div>
                    )}
                </div>
                <div className="block lg:hidden">
                    <ExerciseDialog selectedCollectionId={selectedCollection._id} preset={true} languageCode={params.languageCode} />
                </div>
                <div className="grid gap-3">
                    {loading ?
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                            {Array.from({ length: 9 }, (_, index) => (
                                <Skeleton key={index} className="h-[68px] w-full rounded-xl" />
                            ))}
                        </div>
                        : (
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                {words.map((item, index) => (
                                    <div key={index} className="grid grid-cols-[1fr_auto] items-center gap-2 p-3 rounded-md bg-gray-100">
                                        <div className="flex items-center gap-2">
                                            <div className="font-medium">{item.nativeWord}</div>
                                            <Button
                                                variant="ghost"
                                                size="sm"
                                                className="h-6 w-6 p-0"
                                                onClick={() => playAudio(item.nativeWord, params.languageCode)}
                                            >
                                                <Volume2 className="h-4 w-4" />
                                                <span className="sr-only">{t('common.playAudio')}</span>
                                            </Button>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            {/* Add to collection.. */}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                </div>
            </div>
        </div>
    )
}

export default PresetCollection
