import { Button } from "@/components/ui/button"
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card"
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { Link, useNavigate } from "react-router-dom"
import { AddCollectionDialog } from "./components/add-collection-dialog"
import { useEffect, useState } from "react"
import { apiRequest } from "@/api/config"
import { Skeleton } from "@/components/ui/skeleton"
import toast from "react-hot-toast"
import { useTranslation } from "react-i18next"
import { FileX2, Grip, ListX } from "lucide-react"
import { Separator } from "@/components/ui/separator"
import PresetCollections from "./components/preset-collections"
import { Tabs } from "@radix-ui/react-tabs"
import { TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { scrollToTop } from "@/lib/utils"
import ExerciseDialog from "../collection/components/exercise-dialog"

const Collections = () => {
    const { t } = useTranslation();
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();
    const [wordCollections, setWordCollections] = useState([]);

    const getAllWordCollections = async () => {
        try {
            setLoading(true);
            const response = await apiRequest.get('/api/wordCollections');
            if (response.status === 200) {
                setWordCollections(response.data);
            }
        } catch (error) {
            console.error(error)
        } finally {
            setLoading(false);
        }
    };

    const handleDeleteWordCollection = async (id) => {
        try {
            setLoading(true);
            const response = await apiRequest.delete(`/api/wordCollections/${id}`);
            if (response.status === 200) {
                setWordCollections(wordCollections.filter((item) => item._id !== id));
                toast.success(t('collectionsPage.deleted'))
            }
        } catch (error) {
            console.error(error)
            toast.error(error.response.data.message)
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        getAllWordCollections();
    }, []);

    return (
        <div className="flex flex-col bg-muted/40">
            {/* Mobile view */}
            <div className="block lg:hidden">
                <Tabs defaultValue="preset" className="pt-3">
                    <TabsList className="grid w-full grid-cols-2">
                        <TabsTrigger value="preset">{t('collectionsPage.preset')}</TabsTrigger>
                        <TabsTrigger value="your">{t('collectionsPage.your')}</TabsTrigger>
                    </TabsList>
                    <TabsContent value="preset">
                        <div className="w-full">
                            <PresetCollections view="mobile" />
                        </div>
                    </TabsContent>
                    <TabsContent value="your">
                        <div>
                            <div className="flex flex-col pb-4">
                                <Link to="/collections" className="pt-3 flex items-center gap-2 text-xl font-semibold">
                                    <span>{t('collectionsPage.yourCollectionsTitle')}</span>
                                </Link>
                                <CardDescription className="text-xs py-0 pt-[6px]">
                                    {t('collectionsPage.yourCollectionsDescription')}
                                </CardDescription>
                            </div>
                            <div className="grid gap-6">
                                <div className="flex items-center justify-between">
                                    <AddCollectionDialog getAllWordCollections={getAllWordCollections} />
                                </div>
                                <div className="grid gap-4 grid-cols-1">
                                    {loading ? (
                                        Array.from({ length: 7 }, (_, index) => (
                                            <Skeleton key={index} className="h-[208px] w-full rounded-xl" />
                                        ))
                                    ) : (
                                        wordCollections.length > 0 ?
                                            wordCollections.map((item) => (
                                                <Card key={item._id} >
                                                    <CardHeader>
                                                        <CardTitle className="text-xl">{item.name}</CardTitle>
                                                        <CardDescription className="text-xs">{t('collectionsPage.cardSubtitle')} {item.targetLanguage.name}</CardDescription>
                                                    </CardHeader>
                                                    <CardContent>
                                                        <div className="flex items-center justify-between">
                                                            <div className="flex items-center gap-2 text-sm">
                                                                <FlagIcon className="w-5 h-5" />
                                                                <span>{item.nativeLanguage.name}</span>
                                                                <ArrowRightIcon className="w-5 h-5" />
                                                                <FlagIcon className="w-5 h-5" />
                                                                <span>{item.targetLanguage.name}</span>
                                                            </div>
                                                        </div>
                                                    </CardContent>
                                                    <CardFooter className="justify-between gap-1">
                                                        <Button size="sm" variant="outline" onClick={() => {
                                                            navigate(`/collection/${item._id}`);
                                                            scrollToTop();
                                                        }}>
                                                            <Grip className="w-5 h-5 mr-2" />
                                                            <span className="text-xs">
                                                                {t('collectionsPage.cardButton')}
                                                            </span>
                                                        </Button>
                                                        <div>
                                                            <ExerciseDialog selectedCollectionId={item._id} languageCode={item?.targetLanguage?.code} preset={false} />
                                                        </div>
                                                        <AlertDialog>
                                                            <AlertDialogTrigger asChild>
                                                                <Button size="sm" variant="icon"
                                                                    onClick={(e) => {
                                                                        e.stopPropagation()
                                                                    }}>
                                                                    <ListX className="text-red-600 w-5 h-5" />
                                                                </Button>
                                                            </AlertDialogTrigger>
                                                            <AlertDialogContent
                                                                onClick={(e) => {
                                                                    e.stopPropagation();
                                                                }}
                                                            >
                                                                <AlertDialogHeader>
                                                                    <AlertDialogTitle>
                                                                        {t('collectionsPage.alertTitle')}
                                                                    </AlertDialogTitle>
                                                                    <AlertDialogDescription>
                                                                        {t('collectionsPage.alertDescription')}
                                                                    </AlertDialogDescription>
                                                                </AlertDialogHeader>
                                                                <AlertDialogFooter>
                                                                    <AlertDialogCancel>
                                                                        {t('collectionsPage.alertCancel')}
                                                                    </AlertDialogCancel>
                                                                    <AlertDialogAction asChild>
                                                                        <Button variant="destructive" size="sm"
                                                                            onClick={async (e) => {
                                                                                e.stopPropagation();
                                                                                await handleDeleteWordCollection(item._id)
                                                                            }}
                                                                        >
                                                                            {t('collectionsPage.alertDelete')}
                                                                        </Button>
                                                                    </AlertDialogAction>
                                                                </AlertDialogFooter>
                                                            </AlertDialogContent>
                                                        </AlertDialog>
                                                    </CardFooter>
                                                </Card>
                                            ))
                                            :
                                            (
                                                <div className="w-full max-w-md mx-auto border-0">
                                                    <CardContent className="pt-6 pb-4 text-center">
                                                        <div className="flex justify-center mb-4">
                                                            <FileX2 className="h-12 w-12 text-muted-foreground" />
                                                        </div>
                                                        <h3 className="text-lg font-semibold mb-2">{t('collectionsPage.noCollectionTitle')}</h3>
                                                        <p className="text-sm text-muted-foreground">
                                                            {t('collectionsPage.noCollectionDescription')}
                                                        </p>
                                                    </CardContent>
                                                </div>
                                            )
                                    )}
                                </div>
                            </div>
                        </div>
                    </TabsContent>
                </Tabs>
            </div>
            {/* Desktop view */}
            <div className="hidden lg:block">
                <main className="grid grid-cols-1 lg:grid-cols-7 py-2">
                    <div className="flex lg:col-span-5">
                        <div className="w-full">
                            <PresetCollections />
                        </div>
                        <Separator orientation="vertical" className="mx-8" />
                    </div>
                    <div className="lg:col-span-2">
                        <div className="flex flex-col pb-4">
                            <Link to="/collections" className="pt-6 flex items-center gap-2 text-xl font-semibold">
                                <span>{t('collectionsPage.yourCollectionsTitle')}</span>
                            </Link>
                            <CardDescription className="text-xs py-0 pt-[6px]">
                                {t('collectionsPage.yourCollectionsDescription')}
                            </CardDescription>
                        </div>
                        <div className="grid gap-6">
                            <div className="flex items-center justify-between">
                                <AddCollectionDialog getAllWordCollections={getAllWordCollections} />
                            </div>
                            <div className="overflow-scroll max-h-[600px] grid gap-4 md:grid-cols-2 lg:grid-cols-1">
                                {loading ? (
                                    Array.from({ length: 7 }, (_, index) => (
                                        <Skeleton key={index} className="h-[208px] w-full rounded-xl" />
                                    ))
                                ) : (
                                    wordCollections.length > 0 ?
                                        wordCollections.map((item) => (
                                            <Card key={item._id}>
                                                <CardHeader>
                                                    <CardTitle className="text-xl">{item.name}</CardTitle>
                                                    <CardDescription className="text-xs">{t('collectionsPage.cardSubtitle')} {item.targetLanguage.name}</CardDescription>
                                                </CardHeader>
                                                <CardContent>
                                                    <div className="flex items-center justify-between">
                                                        <div className="flex items-center gap-2 text-sm">
                                                            <FlagIcon className="w-5 h-5" />
                                                            <span>{item.nativeLanguage.name}</span>
                                                            <ArrowRightIcon className="w-5 h-5" />
                                                            <FlagIcon className="w-5 h-5" />
                                                            <span>{item.targetLanguage.name}</span>
                                                        </div>
                                                    </div>
                                                    <div className="pt-6 flex flex-col xl:flex-row gap-2">
                                                        <Button className="w-full lg:w-auto" size="sm" variant="outline" onClick={() => {
                                                            navigate(`/collection/${item._id}`);
                                                            scrollToTop();
                                                        }}>
                                                            <Grip className="w-5 h-5 mr-2" />
                                                            <span className="text-xs">
                                                                {t('collectionsPage.cardButton')}
                                                            </span>
                                                        </Button>
                                                        <ExerciseDialog selectedCollectionId={item._id} languageCode={item?.targetLanguage?.code} preset={false} />
                                                        <AlertDialog>
                                                            <AlertDialogTrigger asChild>
                                                                <Button size="sm" variant="icon"
                                                                    onClick={(e) => {
                                                                        e.stopPropagation()
                                                                    }}>
                                                                    <ListX className="text-red-600 w-5 h-5" />
                                                                </Button>
                                                            </AlertDialogTrigger>
                                                            <AlertDialogContent
                                                                onClick={(e) => {
                                                                    e.stopPropagation();
                                                                }}
                                                            >
                                                                <AlertDialogHeader>
                                                                    <AlertDialogTitle>
                                                                        {t('collectionsPage.alertTitle')}
                                                                    </AlertDialogTitle>
                                                                    <AlertDialogDescription>
                                                                        {t('collectionsPage.alertDescription')}
                                                                    </AlertDialogDescription>
                                                                </AlertDialogHeader>
                                                                <AlertDialogFooter>
                                                                    <AlertDialogCancel>
                                                                        {t('collectionsPage.alertCancel')}
                                                                    </AlertDialogCancel>
                                                                    <AlertDialogAction asChild>
                                                                        <Button variant="destructive" size="sm"
                                                                            onClick={async (e) => {
                                                                                e.stopPropagation();
                                                                                await handleDeleteWordCollection(item._id)
                                                                            }}
                                                                        >
                                                                            {t('collectionsPage.alertDelete')}
                                                                        </Button>
                                                                    </AlertDialogAction>
                                                                </AlertDialogFooter>
                                                            </AlertDialogContent>
                                                        </AlertDialog>
                                                    </div>
                                                </CardContent>
                                            </Card>
                                        ))
                                        :
                                        (
                                            <div className="w-full max-w-md mx-auto border-0">
                                                <CardContent className="pt-6 pb-4 text-center">
                                                    <div className="flex justify-center mb-4">
                                                        <FileX2 className="h-12 w-12 text-muted-foreground" />
                                                    </div>
                                                    <h3 className="text-lg font-semibold mb-2">{t('collectionsPage.noCollectionTitle')}</h3>
                                                    <p className="text-sm text-muted-foreground">
                                                        {t('collectionsPage.noCollectionDescription')}
                                                    </p>
                                                </CardContent>
                                            </div>
                                        )
                                )}
                            </div>
                        </div>
                    </div>
                </main>
            </div>
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

