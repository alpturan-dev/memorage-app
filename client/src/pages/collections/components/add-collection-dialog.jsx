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

const initialState = {
    name: "",
    nativeLanguage: {},
    targetLanguage: {}
}

export const AddCollectionDialog = ({ getAllWordCollections }) => {
    const [open, setOpen] = useState(false)
    const [newCollection, setNewCollection] = useState(initialState)

    const handleAddCollection = async (e) => {
        e.preventDefault();
        try {
            const response = await apiRequest.post('/api/wordCollections', newCollection);
            if (response.status === 201) {
                await getAllWordCollections();
                console.log("yeni koleksiyon eklendi.");
            }
        } catch (error) {
            console.error(error);
        } finally {
            setOpen(false);
            setNewCollection(initialState);
        }
    }

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button size="sm">
                    <PlusIcon className="w-4 h-4 mr-2" />
                    New Collection
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[545px]">
                <form onSubmit={handleAddCollection}>
                    <DialogHeader>
                        <DialogTitle>New Word Collection</DialogTitle>
                        <DialogDescription>
                            Create a new word collection. Click save when you&apos;re done.
                        </DialogDescription>
                    </DialogHeader>
                    <div className="grid gap-4 py-4">
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="name" className="text-right">
                                Name
                            </Label>
                            <Input
                                id="name"
                                className="col-span-3"
                                value={newCollection.name}
                                onChange={(e) => setNewCollection({
                                    ...newCollection,
                                    name: e.target.value
                                })}
                            />
                        </div>
                        <div className="flex items-center gap-4">
                            <Label htmlFor="nativeLanguage" className="text-right">
                                Native Language
                            </Label>
                            <Select
                                id="nativeLanguage"
                                value={newCollection.nativeLanguage.code}
                                onValueChange={(value) => {
                                    const lang = languages.find((item) => item.code === value);
                                    setNewCollection({
                                        ...newCollection,
                                        nativeLanguage: lang
                                    })
                                }}
                                className="col-span-3"
                            >
                                <SelectTrigger className="w-full">
                                    <SelectValue placeholder="Select a language" />
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
                        <div className="flex items-center gap-4">
                            <Label htmlFor="targetLanguage" className="text-right">
                                Native Language
                            </Label>
                            <Select
                                id="targetLanguage"
                                value={newCollection.targetLanguage.code}
                                onValueChange={(value) => {
                                    const lang = languages.find((item) => item.code === value);
                                    setNewCollection({
                                        ...newCollection,
                                        targetLanguage: lang
                                    })
                                }}
                                className="col-span-3"
                            >
                                <SelectTrigger className="w-full">
                                    <SelectValue placeholder="Select a language" />
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
                        <Button type="submit">Create</Button>
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