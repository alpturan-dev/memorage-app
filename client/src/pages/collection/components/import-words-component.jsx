import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { apiRequest } from "@/api/config";
import { useTranslation } from "react-i18next";
import { ImageUp } from "lucide-react";

const ImportWordsComponent = ({
  wordCollectionId,
  getAllWordsByCollection,
  selectedCollection,
}) => {
  const { t } = useTranslation();
  const [loading, setLoading] = useState(false);
  const [loadingText, setLoadingText] = useState("");
  const [open, setOpen] = useState(false);
  const [images, setImages] = useState([]);

  const handleImageChange = (e) => {
    if (e.target.files) {
      setImages(Array.from(e.target.files));
    }
  };

  const handleSubmit = async () => {
    setLoading(true);
    if (images.length === 0) return;

    const formData = new FormData();
    images.forEach((image, index) => {
      formData.append(`image${index}`, image);
    });

    formData.append("sourceLanguage", selectedCollection.targetLanguage.name);
    formData.append("targetLanguage", selectedCollection.nativeLanguage.name);

    try {
      setLoadingText(t("collectionPage.processingImages"));
      const aiRes = await apiRequest.post(
        `/api/ai/importWordsFromImages`,
        formData
      );
      if (aiRes.status === 200) {
        setLoadingText(t("collectionPage.findingWords"));
        const words = aiRes.data;
        words.map(async (word) => {
          const res = await apiRequest.post("/api/words", {
            ...word,
            wordCollectionId,
          });
          if (res.status === 201) {
            console.log("yeni kelime eklendi.");
          }
        });
        await getAllWordsByCollection();
        setOpen(false);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
      setImages([]);
    }
  };

  return (
    <Dialog
      open={open}
      onOpenChange={(val) => {
        setOpen(val);
        setImages([]);
        setLoadingText("");
      }}
    >
      <DialogTrigger asChild>
        <Button
          variant="ghost"
          size="sm"
          className="text-xs w-full md:w-auto flex justify-start"
          onClick={(e) => e.stopPropagation()}
        >
          <ImageUp size="1rem" />
          {t("collectionPage.importWords")}
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]" aria-describedby={undefined}>
        <DialogHeader>
          <DialogTitle>{t("collectionPage.uploadImages")}</DialogTitle>
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
              {images.length} {t("collectionPage.imagesSelected")}
            </div>
          )}
          <Button
            className="col-span-3 float-right"
            onClick={handleSubmit}
            disabled={images.length === 0 || loading}
          >
            {loading ? loadingText : t("collectionPage.extractWords")}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ImportWordsComponent;
