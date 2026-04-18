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
import { AlertCircle, Check, ImageUp } from "lucide-react";
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
  const [result, setResult] = useState(null);

  const handleImageChange = (e) => {
    if (e.target.files) {
      setImages(Array.from(e.target.files));
      setResult(null);
    }
  };

  const resetDialogState = () => {
    setImages([]);
    setLoadingText("");
    setResult(null);
  };

  const handleSubmit = async (e) => {
    e.stopPropagation();
    if (images.length === 0) return;
    setLoading(true);
    setResult(null);

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

        // Dedupe within the extracted batch itself (case-insensitive on nativeWord)
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

        setResult({ added, duplicates, failed, total: words.length });

        if (added > 0) {
          toast.success(t("collectionPage.importAddedToast", { count: added }));
          await getAllWordsByCollection();
        } else if (duplicates > 0 && failed === 0) {
          toast.error(t("collectionPage.importAllDuplicatesToast"));
        } else if (failed > 0) {
          toast.error(t("collectionPage.importFailedToast"));
        }
      }
    } catch (error) {
      console.error(error);
      toast.error(t("collectionPage.importFailedToast"));
      setResult({ added: 0, duplicates: 0, failed: images.length, total: 0 });
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
        resetDialogState();
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
          {result && (
            <div className="grid gap-1 rounded-md border p-3 text-sm">
              <div className="flex items-center gap-2 text-green-600 dark:text-green-400">
                <Check className="h-4 w-4" />
                {t("collectionPage.importAdded", { count: result.added })}
              </div>
              {result.duplicates > 0 && (
                <div className="flex items-center gap-2 text-amber-600 dark:text-amber-400">
                  <AlertCircle className="h-4 w-4" />
                  {t("collectionPage.importDuplicates", {
                    count: result.duplicates,
                  })}
                </div>
              )}
              {result.failed > 0 && (
                <div className="flex items-center gap-2 text-red-600 dark:text-red-400">
                  <AlertCircle className="h-4 w-4" />
                  {t("collectionPage.importFailed", { count: result.failed })}
                </div>
              )}
            </div>
          )}
          <Button
            className="col-span-3 float-right"
            onClick={handleSubmit}
            disabled={images.length === 0 || loading}
          >
            {loading ? loadingText : t("collectionPage.extractWords")}
          </Button>
          {result && !loading && (
            <Button
              variant="outline"
              className="col-span-3"
              onClick={() => setOpen(false)}
            >
              {t("common.cancel")}
            </Button>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ImportWordsComponent;
