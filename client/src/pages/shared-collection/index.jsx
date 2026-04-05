import { apiRequest } from "@/api/config";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Skeleton } from "@/components/ui/skeleton";
import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Copy, LogIn } from "lucide-react";
import toast from "react-hot-toast";

const SharedCollection = () => {
    const { t } = useTranslation();
    const navigate = useNavigate();
    const { token } = useParams();
    const [loading, setLoading] = useState(true);
    const [copyLoading, setCopyLoading] = useState(false);
    const [collection, setCollection] = useState(null);
    const [words, setWords] = useState([]);
    const [notFound, setNotFound] = useState(false);

    const isLoggedIn = !!localStorage.getItem('token');

    const getSharedCollection = async () => {
        try {
            setLoading(true);
            const response = await apiRequest.get(`/api/shared/${token}`);
            if (response.status === 200) {
                setCollection(response.data.collection);
                setWords(response.data.words);
            }
        } catch (error) {
            setNotFound(true);
        } finally {
            setLoading(false);
        }
    };

    const copyCollection = async () => {
        try {
            setCopyLoading(true);
            const response = await apiRequest.post(`/api/shared/${token}/copy`);
            if (response.status === 201) {
                toast.success(t("sharedPage.copiedSuccess"));
                navigate(`/collection/${response.data.collection._id}`);
            }
        } catch (error) {
            toast.error(error.response?.data?.message || "Error copying collection");
        } finally {
            setCopyLoading(false);
        }
    };

    useEffect(() => {
        getSharedCollection();
    }, []);

    if (!loading && notFound) {
        return (
            <div className="bg-background text-foreground py-4">
                <div className="flex flex-col items-center justify-center gap-4 py-12">
                    <p className="text-muted-foreground">{t("sharedPage.collectionNotFound")}</p>
                    <Button variant="outline" size="sm" onClick={() => navigate('/')}>
                        <ArrowLeft className="w-4 h-4 mr-2" />
                        {t("navbar.home")}
                    </Button>
                </div>
            </div>
        );
    }

    return (
        <div className="bg-background text-foreground py-4">
            <div className="grid gap-4">
                <div className="flex items-center justify-between">
                    {loading ? (
                        <Skeleton className="h-[30px] w-[200px]" />
                    ) : (
                        <div className="flex gap-2 items-center">
                            <Button size="sm" variant="outline" onClick={() => navigate('/')}>
                                <ArrowLeft className="w-5 h-5" />
                            </Button>
                            <div>
                                <h1 className="text-xl font-bold">{collection.name}</h1>
                                <p className="text-sm text-muted-foreground">
                                    {collection.nativeLanguage?.name} - {collection.targetLanguage?.name}
                                </p>
                            </div>
                        </div>
                    )}
                    {loading ? (
                        <Skeleton className="h-[30px] w-[150px]" />
                    ) : (
                        <div className="flex gap-2 items-center">
                            <div className="text-sm text-muted-foreground">
                                {t("sharedPage.wordCount", { count: words.length })}
                            </div>
                            {isLoggedIn ? (
                                <Button size="sm" onClick={copyCollection} disabled={copyLoading}>
                                    <Copy className="w-4 h-4 mr-1" />
                                    {copyLoading ? t("sharedPage.copying") : t("sharedPage.copyToMyCollections")}
                                </Button>
                            ) : (
                                <Button size="sm" variant="outline" onClick={() => navigate('/login')}>
                                    <LogIn className="w-4 h-4 mr-1" />
                                    {t("sharedPage.loginToCopy")}
                                </Button>
                            )}
                        </div>
                    )}
                </div>
                <div className="grid gap-3">
                    {loading ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                            {Array.from({ length: 9 }, (_, index) => (
                                <Skeleton key={index} className="h-[68px] w-full rounded-xl" />
                            ))}
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                            {words.map((item, index) => (
                                <div key={index} className="flex flex-col gap-2 p-3 rounded-md bg-gray-100">
                                    <div className="font-medium">{item.nativeWord}</div>
                                    <div className="opacity-70 text-sm">{item.targetWord}</div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default SharedCollection;
