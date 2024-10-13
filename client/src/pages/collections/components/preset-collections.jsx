import { useEffect, useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ChartNoAxesColumnIncreasing, ChevronLeft, ChevronRight, Grip } from "lucide-react"
import { Progress } from '@/components/ui/progress';
import { useTranslation } from 'react-i18next';
import { twJoin } from 'tailwind-merge';
import { languages as constLangs } from '@/constants/constants';
import { useNavigate } from 'react-router-dom';
import ExerciseDialog from '@/pages/collection/components/exercise-dialog';
import { apiRequest } from '@/api/config';
import { scrollToTop } from '@/lib/utils';

const PresetCollections = ({ view }) => {
    const { t } = useTranslation();
    const navigate = useNavigate();
    const languages = constLangs.map((lang) => lang.name);
    const levels = [
        { level: 'A1', label: t('collectionsPage.beginner'), value: 15, color: 'bg-green-400' },
        { level: 'A2', label: t('collectionsPage.elementary'), value: 30, color: 'bg-green-500' },
        { level: "B1", label: t('collectionsPage.intermediate'), value: 45, color: 'bg-yellow-400' },
        { level: "B2", label: t('collectionsPage.upperIntermediate'), value: 60, color: 'bg-yellow-500' },
        { level: "C1", label: t('collectionsPage.advanced'), value: 75, color: 'bg-red-400' },
        { level: "C2", label: t('collectionsPage.proficiency'), value: 100, color: 'bg-red-500' }];
    const [visibleLanguages, setVisibleLanguages] = useState(languages.slice(0, view === "mobile" ? 2 : 4));
    const [startIndex, setStartIndex] = useState(0);
    const [presetCollections, setPresetCollections] = useState([]);

    const handleNext = () => {
        const tabCount = view === "mobile" ? 2 : 4;
        const newStartIndex = Math.min(startIndex + 1, languages.length - tabCount);
        setStartIndex(newStartIndex);
        setVisibleLanguages(languages.slice(newStartIndex, newStartIndex + tabCount));
    };

    const handlePrev = () => {
        const tabCount = view === "mobile" ? 2 : 4;
        const newStartIndex = Math.max(startIndex - 1, 0);
        setStartIndex(newStartIndex);
        setVisibleLanguages(languages.slice(newStartIndex, newStartIndex + tabCount));
    };

    const getAllPresetCollections = async () => {
        try {
            // setLoading(true);
            const response = await apiRequest.get('/api/preset-collections');
            if (response.status === 200) {
                setPresetCollections(response.data);
            }
        } catch (error) {
            console.error(error)
        } finally {
            // setLoading(false);
        }
    };

    useEffect(() => {
        getAllPresetCollections();
    }, [])

    return (
        <>
            <CardHeader className="px-0 pt-3 lg:pt-6">
                <CardTitle className="text-xl">
                    {t('collectionsPage.presetTitle')}
                </CardTitle>
                <CardDescription className="text-xs">
                    {t('collectionsPage.presetDescription')}
                </CardDescription>
            </CardHeader>
            <CardContent className="px-0">
                <Tabs defaultValue={visibleLanguages[0]} className="w-full">
                    <div className="flex items-center">
                        <Button
                            variant="ghost"
                            onClick={handlePrev}
                            disabled={startIndex === 0}
                            className="p-2"
                        >
                            <ChevronLeft className="h-4 w-4" />
                        </Button>
                        <TabsList className={twJoin(
                            "flex-grow grid",
                            view === "mobile" ? 'grid-cols-2' : 'grid-cols-4'
                        )}>
                            {visibleLanguages.map(lang => (
                                <TabsTrigger key={lang} value={lang} disabled={lang !== "English"}>
                                    {lang}
                                    {lang !== "English" && (
                                        <div className='relative -top-2 -right-2 text-xs font-bold bg-gradient-to-r from-[#016DCC] to-purple-600 bg-clip-text text-transparent rounded-sm px-0.5'>
                                            {t('comingSoon.comingSoon')}
                                        </div>
                                    )}
                                </TabsTrigger>
                            ))}
                        </TabsList>
                        <Button
                            variant="ghost"
                            onClick={handleNext}
                            disabled={startIndex >= languages.length - (view === "mobile" ? 2 : 4)}
                            className="p-2"
                        >
                            <ChevronRight className="h-4 w-4" />
                        </Button>
                    </div>
                    {languages.map(lang => (
                        <TabsContent key={lang} value={lang}>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                                {levels.map(level => (
                                    <Card key={level.level}>
                                        <CardHeader>
                                            <CardTitle className="text-xl">{lang} - <span >{level.level}</span></CardTitle>
                                            <CardDescription className="text-xs">{level.level} {t('collectionsPage.level')} {lang} {t('collectionsPage.vocabulary')}</CardDescription>
                                            <div className='pt-2 flex gap-2 items-center'>
                                                <ChartNoAxesColumnIncreasing />
                                                <Progress value={level.value} indicatorColor={level.color} />
                                            </div>
                                        </CardHeader>
                                        <CardContent className="flex flex-col xl:flex-row gap-2">
                                            <Button size="sm" variant="outline" onClick={() => {
                                                let tempLang = constLangs.find((item) => item.name === lang);
                                                navigate(`/preset-collection/${tempLang.code}/${level.level}`);
                                                scrollToTop();
                                            }}>
                                                <Grip className="w-5 h-5 mr-2" />
                                                <span className="text-xs">
                                                    {t('collectionsPage.viewCollection')}
                                                </span>
                                            </Button>
                                            <ExerciseDialog
                                                selectedCollectionId={
                                                    presetCollections.find((col) => {
                                                        let tempLang = constLangs.find((item) => item.name === lang);
                                                        return col.languageCode === tempLang.code && col.level === level.level
                                                    })?._id
                                                }
                                                preset={true}
                                                languageCode={
                                                    presetCollections.find((col) => {
                                                        let tempLang = constLangs.find((item) => item.name === lang);
                                                        return col.languageCode === tempLang.code && col.level === level.level
                                                    })?.languageCode
                                                }
                                            />
                                        </CardContent>
                                    </Card>
                                ))}
                            </div>
                        </TabsContent>
                    ))}
                </Tabs>
            </CardContent>
        </>
    );
};

export default PresetCollections;