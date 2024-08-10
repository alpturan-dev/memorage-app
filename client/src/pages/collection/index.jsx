import { apiRequest } from "@/api/config";
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

const Collection = () => {
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
            const response = await apiRequest.get(`/api/words/wordCollection/${params.id}`);
            if (response.status === 200) {
                setWords(response.data);
                await getCollectionById(params.id);
            }
        } catch (error) {
            console.error(error)
        }
    };

    const getCollectionById = async (id) => {
        try {
            const collectionRes = await apiRequest.get(`/api/wordCollections/${id}`);
            if (collectionRes.status === 200) {
                setSelectedCollection(collectionRes.data);
            }
        } catch (error) {
            console.error(error)
        }
    };

    const handleAddOrEditWord = async (e) => {
        e.preventDefault();
        try {
            if (formAction === "add") {
                const response = await apiRequest.post('/api/words', newWord);
                if (response.status === 201) {
                    await getAllWordsByCollection();
                    console.log("yeni kelime eklendi.");
                }
            } else if (formAction === "edit") {
                const response = await apiRequest.put(`/api/words/${newWord.id}`, newWord);
                if (response.status === 200) {
                    await getAllWordsByCollection();
                    console.log("kelime guncellendi.");
                }
            }
        } catch (error) {
            console.error(error);
        } finally {
            setNewWord(wordInitialState);
            setFormAction("add");
        }
    }

    const handleDeleteWord = async (id) => {
        try {
            const response = await apiRequest.delete(`/api/words/${id}`);
            if (response.status === 200) {
                setWords(words.filter((item) => item._id !== id));
            }
        } catch (error) {
            console.error(error)
        }
    };

    useEffect(() => {
        getAllWordsByCollection();
    }, []);

    return (
        <div className="bg-background text-foreground p-4 sm:p-6">
            <div className="grid gap-4">
                <div className="flex items-center justify-between">
                    <h1 className="text-xl font-bold">{selectedCollection.name}</h1>
                </div>
                <div className="grid gap-3">
                    <div className="flex items-center gap-2">
                        <Input type="text" placeholder="Word" className="w-32"
                            value={newWord.nativeWord}
                            onChange={(e) => setNewWord({
                                ...newWord,
                                nativeWord: e.target.value
                            })}
                        />
                        <Input type="text" placeholder="Translation" className="w-32"
                            value={newWord.targetWord}
                            onChange={(e) => setNewWord({
                                ...newWord,
                                targetWord: e.target.value
                            })}
                        />
                        <Button variant="outline" size="sm" onClick={handleAddOrEditWord}>
                            <PlusIcon className="w-4 h-4" />
                        </Button>
                    </div>
                    {words.map((item) => (
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
                                    }}
                                >
                                    <FilePenIcon className="w-4 h-4" />
                                    <span className="sr-only">Edit</span>
                                </Button>
                                <Button variant="ghost" size="icon"
                                    onClick={() => {
                                        handleDeleteWord(item._id)
                                    }}
                                >
                                    <TrashIcon className="w-4 h-4" />
                                    <span className="sr-only">Delete</span>
                                </Button>
                            </div>
                        </div>
                    ))}
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