import { apiRequest } from "@/api/config";
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import ImportWordsComponent from "./components/import-words-component";
import { Skeleton } from "@/components/ui/skeleton";
import { useTranslation } from "react-i18next";
import { ArrowLeft, EditIcon, FileX2 } from "lucide-react";
import ExerciseDialog from "./components/exercise-dialog";
import { CardContent } from "@/components/ui/card";
import { scrollToTop } from "@/lib/utils";
import { twJoin } from "tailwind-merge";

const Collection = () => {
    const { t } = useTranslation();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const params = useParams();
    const [words, setWords] = useState([]);
    const wordInitialState = {
        nativeWord: "",
        targetWord: "",
        wordCollectionId: params.id
    };
    const [newWord, setNewWord] = useState(wordInitialState);
    const [formAction, setFormAction] = useState("add");
    const [selectedCollection, setSelectedCollection] = useState({});

    const getAllWordsByCollection = async () => {
        try {
            setLoading(true);
            const response = await apiRequest.get(`/api/words/wordCollection/${params.id}`);
            if (response.status === 200) {
                setWords(response.data.reverse());
                await getCollectionById(params.id);
            }
        } catch (error) {
            console.error(error)
        } finally {
            setLoading(false);
        }
    };

    const getCollectionById = async (id) => {
        try {
            setLoading(true);
            const collectionRes = await apiRequest.get(`/api/wordCollections/${id}`);
            if (collectionRes.status === 200) {
                setSelectedCollection(collectionRes.data);
            }
        } catch (error) {
            console.error(error)
        } finally {
            setLoading(false);
        }
    };

    const handleAddOrEditWord = async (e) => {
        e.preventDefault();
        try {
            setLoading(true);
            if (formAction === "add") {
                const response = await apiRequest.post('/api/words', newWord);
                if (response.status === 201) {
                    await getAllWordsByCollection();
                }
            } else if (formAction === "edit") {
                const response = await apiRequest.put(`/api/words/${newWord.id}`, newWord);
                if (response.status === 200) {
                    await getAllWordsByCollection();
                }
            }
        } catch (error) {
            console.error(error);
        } finally {
            setNewWord(wordInitialState);
            setFormAction("add");
            setLoading(false);
        }
    }

    const handleDeleteWord = async (id) => {
        try {
            setLoading(true);
            const response = await apiRequest.delete(`/api/words/${id}`);
            if (response.status === 200) {
                setWords(words.filter((item) => item._id !== id));
            }
        } catch (error) {
            console.error(error)
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (newWord.nativeWord === "" && newWord.targetWord === "") {
            setFormAction("add");
        }
    }, [newWord]);

    useEffect(() => {
        getAllWordsByCollection();
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
                        <div>{t('collectionPage.totalWords')} {words.length}</div>
                    )}
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
                    <div className="flex items-center gap-2 md:gap-1">
                        <Input type="text" placeholder={t('collectionPage.word')}
                            value={newWord.nativeWord}
                            disabled={loading}
                            onChange={(e) => setNewWord({
                                ...newWord,
                                nativeWord: e.target.value
                            })}
                            className={twJoin(formAction === "edit" && "animate-pulse")}
                        />
                        <Input type="text" placeholder={t('collectionPage.translation')}
                            value={newWord.targetWord}
                            disabled={loading}
                            onChange={(e) => setNewWord({
                                ...newWord,
                                targetWord: e.target.value
                            })}
                            className={twJoin(formAction === "edit" && "animate-pulse")}
                        />
                        <Button variant="outline" size="sm" onClick={handleAddOrEditWord}>
                            {loading ? (
                                <>...</>
                            ) : formAction === "add" ? (
                                <PlusIcon className="w-4 h-4" />
                            ) : (
                                <EditIcon className="w-4 h-4 text-green-500" />
                            )}
                        </Button>
                    </div>
                    <div className="w-full col-span-1 md:col-span-2 flex justify-center md:justify-end order-first md:order-none">
                        <div className="grid grid-cols-5 gap-2">
                            <div className="col-span-2">
                                <ExerciseDialog selectedCollectionId={selectedCollection._id} />
                            </div>
                            <div className="col-span-3">
                                <ImportWordsComponent wordCollectionId={params.id} getAllWordsByCollection={getAllWordsByCollection} selectedCollection={selectedCollection} />
                            </div>
                        </div>
                    </div>
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
                                {words.length > 0 ? (
                                    words.map((item) => (
                                        <div key={item._id} className="grid grid-cols-[1fr_auto] items-center gap-2 p-3 rounded-md bg-gray-100">
                                            <div className="flex flex-col">
                                                <div className="font-medium">{item.nativeWord}</div>
                                                <div className="text-muted-foreground text-sm">{item.targetWord}</div>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <Button variant="ghost" size="icon"
                                                    onClick={() => {
                                                        setFormAction("edit");
                                                        setNewWord({
                                                            nativeWord: item.nativeWord,
                                                            targetWord: item.targetWord,
                                                            id: item._id
                                                        });
                                                        scrollToTop();
                                                    }}
                                                >
                                                    <FilePenIcon className="w-4 h-4 text-green-500" />
                                                    <span className="sr-only">{t('common.edit')}</span>
                                                </Button>
                                                <Button variant="ghost" size="icon" className="text-red-600"
                                                    onClick={() => {
                                                        handleDeleteWord(item._id)
                                                    }}
                                                >
                                                    <TrashIcon className="w-4 h-4" />
                                                    <span className="sr-only">{t('common.delete')}</span>
                                                </Button>
                                            </div>
                                        </div>
                                    )))
                                    : (
                                        <div className="col-span-full w-full max-w-md mx-auto border-0">
                                            <CardContent className="pt-6 pb-4 text-center">
                                                <div className="flex justify-center mb-4">
                                                    <FileX2 className="h-12 w-12 text-muted-foreground" />
                                                </div>
                                                <h3 className="text-lg font-semibold mb-2">{t('collectionPage.noWordTitle')}</h3>
                                                <p className="text-sm text-muted-foreground">
                                                    {t('collectionPage.noWordDescription')}
                                                </p>
                                            </CardContent>
                                        </div>
                                    )
                                }
                            </div>
                        )}
                </div>
            </div>
        </div>
    )
}

export default Collection

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


function PlusIcon(props) {
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
            <path d="M5 12h14" />
            <path d="M12 5v14" />
        </svg>
    )
}


function TrashIcon(props) {
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
            <path d="M3 6h18" />
            <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6" />
            <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2" />
        </svg>
    )
}