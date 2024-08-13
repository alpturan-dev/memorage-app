import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { apiRequest } from '@/api/config';

const ImportWordsComponent = ({ wordCollectionId, getAllWordsByCollection, selectedCollection }) => {
    const [open, setOpen] = useState(false)
    const [images, setImages] = useState([]);

    const handleImageChange = (e) => {
        if (e.target.files) {
            setImages(Array.from(e.target.files));
        }
    };

    const handleSubmit = async () => {
        if (images.length === 0) return;

        const formData = new FormData();
        images.forEach((image, index) => {
            formData.append(`image${index}`, image);
        });

        formData.append('sourceLanguage', selectedCollection.nativeLanguage.name);
        formData.append('targetLanguage', selectedCollection.targetLanguage.name);

        try {
            const aiRes = await apiRequest.post(`/api/ai/importWordsFromImages`, formData);
            if (aiRes.status === 200) {
                const words = aiRes.data;
                words.map(async (word) => {
                    const res = await apiRequest.post('/api/words', { ...word, wordCollectionId });
                    if (res.status === 201) {
                        console.log("yeni kelime eklendi.");
                    }
                })
                await getAllWordsByCollection();
                setOpen(false);
            }
        } catch (error) {
            console.error(error)
        }
    };

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button variant="outline">Import words from images</Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>Upload Images</DialogTitle>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                    <Input
                        id="images"
                        type="file"
                        accept="image/*"
                        multiple
                        onChange={handleImageChange}
                        className="col-span-3"
                    />
                    {images.length > 0 && (
                        <div className="text-sm text-gray-500">
                            {images.length} image(s) selected
                        </div>
                    )}
                    <Button className="col-span-3 float-right" onClick={handleSubmit} disabled={images.length === 0}>
                        Apply
                    </Button>
                </div>
            </DialogContent>
        </Dialog>
    );
}

export default ImportWordsComponent