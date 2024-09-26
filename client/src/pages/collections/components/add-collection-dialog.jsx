import { apiRequest } from "@/api/config"
import { Button } from "@/components/ui/button"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useState } from "react"
import { languages } from "@/constants/constants"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import toast from "react-hot-toast"
import { useTranslation } from "react-i18next"

const initialState = {
    name: "",
    nativeLanguage: {
        code: "",
        name: ""
    },
    targetLanguage: {
        code: "",
        name: ""
    }
}

export const AddCollectionDialog = ({ getAllWordCollections }) => {
    const { t } = useTranslation();
    const [loading, setLoading] = useState(false);
    const [open, setOpen] = useState(false)
    const [newCollection, setNewCollection] = useState(initialState)

    const handleAddCollection = async (e) => {
        e.preventDefault();
        try {
            setLoading(true);
            const response = await apiRequest.post('/api/wordCollections', newCollection);
            if (response.status === 201) {
                await getAllWordCollections();
                toast.success(t('collectionsPage.added'))
            }
        } catch (error) {
            console.error(error);
            toast.error(error.response.data.message);
        } finally {
            setOpen(false);
            setNewCollection(initialState);
            setLoading(false);
        }
    }

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button size="sm" className='w-full'>
                    <PlusIcon className="w-4 h-4 mr-2" />
                    {t('collectionsPage.addButton')}
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[500px]">
                <form onSubmit={handleAddCollection}>
                    <DialogHeader>
                        <DialogTitle>{t('collectionsPage.dialogTitle')}</DialogTitle>
                        <DialogDescription>
                            {t('collectionsPage.dialogSubtitle')}
                        </DialogDescription>
                    </DialogHeader>
                    <div className="grid gap-4 py-4">
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="name" className="col-span-1 text-left">
                                {t('collectionsPage.collectionName')}
                            </Label>
                            <Input
                                id="name"
                                className="col-span-3"
                                disabled={loading}
                                required
                                value={newCollection.name}
                                onChange={(e) => setNewCollection({
                                    ...newCollection,
                                    name: e.target.value
                                })}
                            />
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="nativeLanguage" className="col-span-1 text-left">
                                {t('collectionsPage.sourceLanguage')}
                            </Label>
                            <Select
                                id="nativeLanguage"
                                value={newCollection.nativeLanguage.code}
                                disabled={loading}
                                required
                                onValueChange={(value) => {
                                    const lang = languages.find((item) => item.code === value);
                                    setNewCollection({
                                        ...newCollection,
                                        nativeLanguage: lang
                                    })
                                }}
                            >
                                <SelectTrigger className="col-span-3">
                                    <SelectValue placeholder={t('collectionsPage.selectLanguage')} />
                                </SelectTrigger>
                                <SelectContent className="h-56">
                                    {languages.map((language) => {
                                        if (newCollection.targetLanguage.code !== language.code) return (
                                            <SelectItem key={language.code} value={language.code}>{language.name}</SelectItem>
                                        )
                                    })}
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="targetLanguage" className="col-span-1 text-left">
                                {t('collectionsPage.targetLanguage')}
                            </Label>
                            <Select
                                id="targetLanguage"
                                disabled={loading}
                                required
                                value={newCollection.targetLanguage.code}
                                onValueChange={(value) => {
                                    const lang = languages.find((item) => item.code === value);
                                    setNewCollection({
                                        ...newCollection,
                                        targetLanguage: lang
                                    })
                                }}
                            >
                                <SelectTrigger className="col-span-3">
                                    <SelectValue placeholder={t('collectionsPage.selectLanguage')} />
                                </SelectTrigger>
                                <SelectContent className="h-56">
                                    {languages.map((language) => {
                                        if (newCollection.nativeLanguage.code !== language.code) return (
                                            <SelectItem key={language.code} value={language.code}>{language.name}</SelectItem>
                                        )
                                    })}
                                </SelectContent>
                            </Select>
                        </div>
                    </div>
                    <DialogFooter>
                        <Button type="submit" disabled={loading}>
                            {loading ?
                                t('common.creating') :
                                t('common.create')}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
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