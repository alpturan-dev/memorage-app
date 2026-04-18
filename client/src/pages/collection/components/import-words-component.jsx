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
import toast from "react-hot-toast";

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

  const handleSubmit = async (e) => {
    e.stopPropagation();
    if (images.length === 0) return;
    setLoading(true);

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
        formData,
      );
      if (aiRes.status === 200) {
        setLoadingText(t("collectionPage.findingWords"));
        const words = aiRes.data || [];

        const seen = new Set();
        const uniqueWords = [];
        let batchDuplicates = 0;
        for (const word of words) {
          const key = String(word?.nativeWord || "").trim().toLowerCase();
          if (!key) continue;
          if (seen.has(key)) {
            batchDuplicates += 1;
            continue;
          }
          seen.add(key);
          uniqueWords.push(word);
        }

        const outcomes = await Promise.all(
          uniqueWords.map((word) =>
            apiRequest
              .post("/api/words", { ...word, wordCollectionId })
              .then(() => "added")
              .catch((err) => {
                if (err?.response?.status === 400) return "duplicate";
                return "failed";
              }),
          ),
        );

        const added = outcomes.filter((o) => o === "added").length;
        const duplicates =
          outcomes.filter((o) => o === "duplicate").length + batchDuplicates;
        const failed = outcomes.filter((o) => o === "failed").length;

        if (added > 0) {
          await getAllWordsByCollection();
        }

        const lines = [];
        if (added > 0) {
          lines.push(`✓ ${t("collectionPage.importAdded", { count: added })}`);
        }
        if (duplicates > 0) {
          lines.push(
            `• ${t("collectionPage.importDuplicates", { count: duplicates })}`,
          );
        }
        if (failed > 0) {
          lines.push(
            `✕ ${t("collectionPage.importFailed", { count: failed })}`,
          );
        }

        const message = lines.join("\n");
        if (added > 0) {
          toast.success(message, { duration: 5000, style: { whiteSpace: "pre-line" } });
        } else if (lines.length > 0) {
          toast.error(message, { duration: 5000, style: { whiteSpace: "pre-line" } });
        } else {
          toast.error(t("collectionPage.importFailedToast"));
        }

        setOpen(false);
      }
    } catch (error) {
      console.error(error);
      toast.error(t("collectionPage.importFailedToast"));
    } finally {
      setLoading(false);
      setLoadingText("");
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
            onClick={(e) => e.stopPropagation()}
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
