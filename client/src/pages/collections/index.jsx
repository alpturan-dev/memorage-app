import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuCheckboxItem } from "@/components/ui/dropdown-menu"
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card"
import { Link, useNavigate } from "react-router-dom"
import { AddCollectionDialog } from "./components/add-collection-dialog"
import { useEffect, useState } from "react"
import { apiRequest } from "@/api/config"

const Collections = () => {
    const navigate = useNavigate();
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

    const handleDeleteWordCollection = async (id) => {
        try {
            const response = await apiRequest.delete(`/api/wordCollections/${id}`);
            if (response.status === 200) {
                setWordCollections(wordCollections.filter((item) => item._id !== id));
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
            <main className="flex-1 container px-4 md:px-6 py-2">
                <Link to="/collections" className="py-4 flex items-center gap-2 text-2xl font-semibold">
                    <span>Word Collections</span>
                </Link>
                <div className="grid gap-6">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                            <Input type="search" placeholder="Search collections..." className="bg-background" />
                            <AddCollectionDialog getAllWordCollections={getAllWordCollections} />
                        </div>
                    </div>
                    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                        {wordCollections.length > 0 && wordCollections.map((item) => (
                            <Card key={item._id} onClick={() => {
                                navigate(`/collection/${item._id}`)
                            }}>
                                <CardHeader>
                                    <CardTitle>{item.name}</CardTitle>
                                    <CardDescription>Collection for learning {item.targetLanguage.name}</CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-2">
                                            <FlagIcon className="w-5 h-5" />
                                            <span>{item.nativeLanguage.name}</span>
                                            <ArrowRightIcon className="w-5 h-5" />
                                            <FlagIcon className="w-5 h-5" />
                                            <span>{item.targetLanguage.name}</span>
                                        </div>
                                    </div>
                                </CardContent>
                                <CardFooter className="justify-between">
                                    <Button variant="outline" size="sm">
                                        View Words
                                    </Button>
                                    <Button variant="destructive" size="sm"
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            handleDeleteWordCollection(item._id)
                                        }}>
                                        Delete
                                    </Button>
                                </CardFooter>
                            </Card>
                        ))}
                    </div>
                </div>
            </main>
        </div>
    )
}

export default Collections;

function ArrowRightIcon(props) {
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
            <path d="m12 5 7 7-7 7" />
        </svg>
    )
}


function BookOpenIcon(props) {
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
            <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z" />
            <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z" />
        </svg>
    )
}


function FilterIcon(props) {
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
            <polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3" />
        </svg>
    )
}


function FlagIcon(props) {
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
            <path d="M4 15s1-1 4-1 5 2 8 2 4-1 4-1V3s-1 1-4 1-5-2-8-2-4 1-4 1z" />
            <line x1="4" x2="4" y1="22" y2="15" />
        </svg>
    )
}

