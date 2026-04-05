import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { apiRequest } from "@/api/config";
import { useTranslation } from "react-i18next";
import { Share2, Check, ClipboardCopy } from "lucide-react";
import toast from "react-hot-toast";

const ShareDialog = ({ collectionId }) => {
  const { t } = useTranslation();
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [shareToken, setShareToken] = useState(null);
  const [copied, setCopied] = useState(false);

  const generateLink = async () => {
    try {
      setLoading(true);
      const response = await apiRequest.post(`/api/shared/generate/${collectionId}`);
      if (response.status === 200) {
        setShareToken(response.data.shareToken);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Error generating share link");
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = async () => {
    const url = `${window.location.origin}/shared/${shareToken}`;
    await navigator.clipboard.writeText(url);
    setCopied(true);
    toast.success(t("collectionPage.linkCopied"));
    setTimeout(() => setCopied(false), 2000);
  };

  const handleOpenChange = (val) => {
    setOpen(val);
    if (val) {
      generateLink();
    } else {
      setCopied(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        <Button
          variant="ghost"
          size="sm"
          className="text-xs w-full md:w-auto flex justify-start"
          onClick={(e) => e.stopPropagation()}
        >
          <Share2 size="1rem" />
          {t("collectionPage.share")}
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]" aria-describedby="share-dialog-description">
        <DialogHeader>
          <DialogTitle>{t("collectionPage.shareDialogTitle")}</DialogTitle>
          <DialogDescription id="share-dialog-description">
            {t("collectionPage.shareDialogDescription")}
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          {loading ? (
            <div className="text-sm text-muted-foreground">{t("common.loading")}</div>
          ) : shareToken ? (
            <div className="flex gap-2">
              <Input
                readOnly
                value={`${window.location.origin}/shared/${shareToken}`}
                className="flex-1"
              />
              <Button size="sm" onClick={copyToClipboard}>
                {copied ? <Check className="w-4 h-4" /> : <ClipboardCopy className="w-4 h-4" />}
                {copied ? "" : t("collectionPage.copyLink")}
              </Button>
            </div>
          ) : null}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ShareDialog;
