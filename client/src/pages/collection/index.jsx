import { apiRequest } from "@/api/config";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useCallback, useEffect, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import ImportWordsComponent from "./components/import-words-component";
import { Skeleton } from "@/components/ui/skeleton";
import { useTranslation } from "react-i18next";
import {
  ArrowLeft,
  DownloadIcon,
  FileX2,
  Loader2,
  MoreVertical,
  Save,
  Volume2,
  X,
} from "lucide-react";
import ExerciseDialog from "./components/exercise-dialog";
import { Card, CardContent } from "@/components/ui/card";
import toast from "react-hot-toast";
import * as XLSX from "xlsx";
import { twJoin } from "tailwind-merge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const Collection = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const params = useParams();
  const [words, setWords] = useState([]);
  const wordInitialState = {
    nativeWord: "",
    targetWord: "",
    wordCollectionId: params.id,
  };
  const [newWord, setNewWord] = useState(wordInitialState);
  const [editWord, setEditWord] = useState({});
  const [formAction, setFormAction] = useState("add");
  const [selectedCollection, setSelectedCollection] = useState({});
  const [suggestedTranslations, setSuggestedTranslations] = useState([]); // To store API suggestions
  const [showDropdown, setShowDropdown] = useState(false);
  const [isTranslating, setIsTranslating] = useState(false);
  const translationTimer = useRef(null);
  const [loadingMore, setLoadingMore] = useState(false);
  const [pagination, setPagination] = useState({
    totalCount: 0,
    offset: 0,
    hasMore: false,
  });
  const PAGE_SIZE = 20;

  const getAllWordsByCollection = async (offset = 0, append = false) => {
    try {
      if (append) {
        setLoadingMore(true);
      } else {
        setLoading(true);
        setWords([]);
      }

      const response = await apiRequest.get(
        `/api/words/wordCollection/${params.id}`,
        { params: { limit: PAGE_SIZE, offset } }
      );

      if (response.status === 200) {
        const { words: newWords, pagination: paginationData } = response.data;

        if (append) {
          setWords((prev) => [...prev, ...newWords]);
        } else {
          setWords(newWords);
          await getCollectionById(params.id);
        }

        setPagination(paginationData);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
      setLoadingMore(false);
    }
  };

  const getCollectionById = async (id) => {
    try {
      setLoading(true);
      const collectionRes = await apiRequest.get(`/api/wordCollections/${id}`);
      if (collectionRes.status === 200) {
        setSelectedCollection(collectionRes.data);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddOrEditWord = async (e, formActionParam = undefined) => {
    e.preventDefault();
    try {
      setLoading(true);
      if (formAction === "add" || formActionParam === "add") {
        const response = await apiRequest.post("/api/words", newWord);
        if (response.status === 201) {
          await getAllWordsByCollection();
        }
      } else if (formAction === "edit") {
        const response = await apiRequest.put(
          `/api/words/${editWord.id}`,
          editWord
        );
        if (response.status === 200) {
          await getAllWordsByCollection();
        }
      }
    } catch (error) {
      console.error(error);
      if (error.response.status === 400) {
        toast.error(t("collectionPage.wordAlreadyExists"));
      }
    } finally {
      setNewWord(wordInitialState);
      setFormAction("add");
      setLoading(false);
      setShowDropdown(false);
    }
  };

  const handleDeleteWord = async (id) => {
    try {
      setLoading(true);
      const response = await apiRequest.delete(`/api/words/${id}`);
      if (response.status === 200) {
        setWords(words.filter((item) => item._id !== id));
        setPagination((prev) => ({ ...prev, totalCount: prev.totalCount - 1 }));
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
      setShowDropdown(false);
    }
  };

  const handleLoadMore = () => {
    const newOffset = pagination.offset + PAGE_SIZE;
    getAllWordsByCollection(newOffset, true);
  };

  const exportToExcel = (words) => {
    const worksheet = XLSX.utils.json_to_sheet(
      words.map((item) => ({
        Kelime: item.nativeWord,
        Çeviri: item.targetWord,
      }))
    );

    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Kelimeler");
    XLSX.writeFile(workbook, "kelime-listesi.xlsx");
  };

  function debounce(func, delay) {
    let timeoutId;
    return (...args) => {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(() => {
        func.apply(null, args);
      }, delay);
    };
  }

  // Debounced function to call the translation API
  const fetchTranslations = useCallback(
    debounce(async (nativeWord) => {
      if (nativeWord.trim()) {
        try {
          const response = await apiRequest.post("/api/translate/suggestions", {
            text: nativeWord,
            sourceLang: selectedCollection?.targetLanguage?.name || "English",
            targetLang: selectedCollection?.nativeLanguage?.name || "Turkish",
          });
          setSuggestedTranslations(response.data?.suggestions || []);
          setShowDropdown(true); // Show dropdown when we have suggestions
        } catch (error) {
          console.error(error);
        }
      }
    }, 200),
    [selectedCollection] // 0.2 seconds delay
  );

  const handleSuggestionClick = (suggestion) => {
    setNewWord((prev) => ({
      ...prev,
      targetWord: prev.targetWord
        ? `${prev.targetWord}, ${suggestion}`
        : suggestion,
    }));
    // Keep dropdown open for multiple selections
    setIsTranslating(false);
  };

  const handleNativeWordChangeWithFeedback = (e) => {
    const { value } = e.target;
    setNewWord((prev) => ({ ...prev, nativeWord: value }));

    // Skip translation for Arabic
    if (selectedCollection?.targetLanguage?.code === "ar") {
      return;
    }

    if (translationTimer.current) {
      clearTimeout(translationTimer.current);
    }

    if (value.trim()) {
      setIsTranslating(true);
      translationTimer.current = setTimeout(() => {
        fetchTranslations(value);
      }, 500); // This should match the debounce delay in fetchTranslations
    } else {
      setIsTranslating(false);
    }
  };

  const playAudio = async (text, lang) => {
    try {
      const response = await apiRequest.post(
        "/api/tts/synthesize",
        { text, languageCode: lang },
        { responseType: "blob" }
      );
      const audioBlob = new Blob([response.data], { type: "audio/mpeg" });
      const audioUrl = URL.createObjectURL(audioBlob);
      const audio = new Audio(audioUrl);
      audio.play();
    } catch (error) {
      console.error("Error playing audio:", error);
    }
  };

  useEffect(() => {
    if (suggestedTranslations.length > 0) {
      setIsTranslating(false);
    }
  }, [suggestedTranslations]);

  useEffect(() => {
    if (newWord.nativeWord === "" && newWord.targetWord === "") {
      setFormAction("add");
      setShowDropdown(false);
    }
    if (newWord.nativeWord === "") {
      setShowDropdown(false);
    }
  }, [newWord]);

  useEffect(() => {
    getAllWordsByCollection();
  }, []);

  return (
    <div className="bg-background text-foreground py-4">
      <div className="grid gap-4">
        <div className="flex items-center justify-between">
          {loading ? (
            <Skeleton className="h-[30px] w-[100px]" />
          ) : (
            <div className="flex gap-2 items-center">
              <Button
                size="sm"
                variant="outline"
                onClick={() => navigate("/collections")}
              >
                <ArrowLeft className="w-5 h-5" />
              </Button>
              <h1 className="text-xl font-bold">{selectedCollection.name}</h1>
            </div>
          )}
          {loading ? (
            <Skeleton className="h-[30px] w-[100px]" />
          ) : (
            <div className="flex gap-2 items-center justify-center">
              <span className="text-xs sm:text-base">
                {t("collectionPage.totalWords")} {words.length} /{" "}
                {pagination.totalCount}
              </span>
            </div>
          )}
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
          <div className="relative">
            <div className="flex items-center gap-2 md:gap-1">
              {/* Native Word Input */}
              <div className="relative flex-1">
                <Input
                  type="text"
                  placeholder={t("collectionPage.word")}
                  value={newWord.nativeWord}
                  disabled={loading}
                  onChange={handleNativeWordChangeWithFeedback}
                  className={`w-full`}
                />
                {isTranslating && (
                  <div className="absolute right-2 top-1/2 transform -translate-y-1/2">
                    <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
                  </div>
                )}
              </div>

              {/* Translation Input */}
              <Input
                type="text"
                placeholder={t("collectionPage.translation")}
                value={newWord.targetWord}
                disabled={loading}
                onChange={(e) =>
                  setNewWord({ ...newWord, targetWord: e.target.value })
                }
                className="flex-1"
              />

              {/* Add/Edit Button */}
              <Button
                variant="outline"
                size="sm"
                onClick={(e) => {
                  setFormAction("add");
                  handleAddOrEditWord(e, "add");
                }}
                className="min-w-[40px]"
                disabled={loading || isTranslating}
              >
                {loading ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <PlusIcon className="w-4 h-4" />
                )}
              </Button>
            </div>

            {/* Dropdown for translation suggestions */}
            {showDropdown && suggestedTranslations.length > 0 && (
              <div className="absolute top-full left-0 w-full bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 mt-1 rounded-md shadow-lg z-50 overflow-hidden">
                <div className="px-3 py-2 bg-green-50 dark:bg-green-900/30 border-b border-green-100 dark:border-green-800 flex justify-between items-center">
                  <span className="text-xs text-green-700 dark:text-green-300 font-semibold">
                    {t("collectionPage.translationSuggestions")}
                  </span>
                  <button
                    onClick={() => setShowDropdown(false)}
                    className="text-gray-500 hover:text-gray-700 dark:text-gray-400"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </div>
                <div className="max-h-40 overflow-y-auto">
                  {suggestedTranslations.map((suggestion, index) => (
                    <div
                      key={index}
                      className="px-3 py-2 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-150 border-b border-gray-100 dark:border-gray-700 last:border-b-0"
                      onClick={() => handleSuggestionClick(suggestion)}
                    >
                      {suggestion}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
          <div className="w-full col-span-1 md:col-span-2 flex justify-center items-center md:justify-end md:items-end order-first md:order-none md:gap-4">
            {/* Replaced grid with dropdown menu */}
            <div className="w-full md:w-auto p-2 md:p-0">
              <ExerciseDialog
                selectedCollectionId={selectedCollection._id}
                languageCode={selectedCollection?.targetLanguage?.code}
              />
            </div>
            <DropdownMenu className="p-0">
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm" className="min-w-[40px]">
                  <MoreVertical className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="p-0">
                <DropdownMenuLabel className="pl-3 bg-primary text-white font-normal text-xs">
                  {t("collectionPage.options")}
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem className="p-0">
                  <div className="w-full">
                    <ImportWordsComponent
                      wordCollectionId={params.id}
                      getAllWordsByCollection={getAllWordsByCollection}
                      selectedCollection={selectedCollection}
                    />
                  </div>
                </DropdownMenuItem>
                <DropdownMenuItem className="p-0">
                  <div className="w-full">
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-xs w-full md:w-auto flex justify-start"
                      onClick={() => exportToExcel(words)}
                    >
                      <DownloadIcon size="1rem" />
                      {t("collectionPage.exportToExcel")}
                    </Button>
                  </div>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
        <div className="grid gap-3">
          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {Array.from({ length: 24 }, (_, index) => (
                <Skeleton key={index} className="h-[68px] w-full rounded-xl" />
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {words.length > 0 ? (
                <>
                  {words.map((item) => (
                    <Card key={item._id} className="p-3 rounded-2xl">
                      <div className="flex justify-between items-start mb-2">
                        <div className="flex items-center gap-2">
                          <div className="font-medium">
                            {formAction === "edit" &&
                            editWord.id === item._id ? (
                              <input
                                value={editWord.nativeWord}
                                onChange={(e) =>
                                  setEditWord({
                                    ...editWord,
                                    nativeWord: e.target.value,
                                  })
                                }
                                className="outline rounded-sm animate-pulse"
                              />
                            ) : (
                              <span>{item.nativeWord}</span>
                            )}
                          </div>
                          <Button
                            variant="ghost"
                            size="sm"
                            className={twJoin(
                              "h-6 w-6 p-0",
                              formAction === "edit" &&
                                editWord.id === item._id &&
                                "hidden"
                            )}
                            onClick={() =>
                              playAudio(
                                item.nativeWord,
                                selectedCollection.targetLanguage.code
                              )
                            }
                          >
                            <Volume2 className="h-4 w-4" />
                            <span className="sr-only">
                              {t("common.playAudio")}
                            </span>
                          </Button>
                        </div>
                        <div className="flex items-center gap-1">
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-6 w-6 p-0 hover:animate-pulse"
                            onClick={(e) => {
                              if (
                                formAction === "edit" &&
                                editWord.id === item._id
                              ) {
                                handleAddOrEditWord(e);
                              }
                              setEditWord({
                                nativeWord: item.nativeWord,
                                targetWord: item.targetWord,
                                id: item._id,
                              });
                              setFormAction("edit");
                            }}
                          >
                            {formAction === "edit" &&
                            editWord.id === item._id ? (
                              <div>
                                <Save className="h-3 w-3" />
                                <span className="sr-only">
                                  {t("common.edit")}
                                </span>
                              </div>
                            ) : (
                              <div>
                                <FilePenIcon className="h-3 w-3" />
                                <span className="sr-only">
                                  {t("common.edit")}
                                </span>
                              </div>
                            )}
                          </Button>
                          <Button
                            variant="link"
                            size="sm"
                            className="h-6 w-6 p-0 text-red-600 hover:animate-shake"
                            onClick={() => {
                              handleDeleteWord(item._id);
                            }}
                          >
                            <TrashIcon className="h-3 w-3" />
                            <span className="sr-only">
                              {t("common.delete")}
                            </span>
                          </Button>
                        </div>
                      </div>
                      <div className="opacity-70 text-sm font-light">
                        {formAction === "edit" && editWord.id === item._id ? (
                          <input
                            value={editWord.targetWord}
                            onChange={(e) =>
                              setEditWord({
                                ...editWord,
                                targetWord: e.target.value,
                              })
                            }
                            className="outline rounded-sm animate-pulse"
                          />
                        ) : (
                          <span>{item.targetWord}</span>
                        )}
                      </div>
                    </Card>
                  ))}
                  {pagination.hasMore && (
                    <div className="col-span-full flex flex-col items-center gap-2 py-4">
                      <span className="text-sm text-muted-foreground">
                        {t("collectionPage.showingWords", {
                          current: words.length,
                          total: pagination.totalCount,
                        })}
                      </span>
                      <Button
                        variant="outline"
                        onClick={handleLoadMore}
                        disabled={loadingMore}
                        className="min-w-[150px]"
                      >
                        {loadingMore ? (
                          <>
                            <Loader2 className="h-4 w-4 animate-spin mr-2" />
                            {t("common.loading")}
                          </>
                        ) : (
                          t("collectionPage.loadMore")
                        )}
                      </Button>
                    </div>
                  )}
                </>
              ) : (
                <div className="col-span-full w-full max-w-md mx-auto border-0">
                  <CardContent className="pt-6 pb-4 text-center">
                    <div className="flex justify-center mb-4">
                      <FileX2 className="h-12 w-12 text-muted-foreground" />
                    </div>
                    <h3 className="text-lg font-semibold mb-2">
                      {t("collectionPage.noWordTitle")}
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      {t("collectionPage.noWordDescription")}
                    </p>
                  </CardContent>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Collection;

function FilePenIcon(props) {
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
      <path d="M12 22h6a2 2 0 0 0 2-2V7l-5-5H6a2 2 0 0 0-2 2v10" />
      <path d="M14 2v4a2 2 0 0 0 2 2h4" />
      <path d="M10.4 12.6a2 2 0 1 1 3 3L8 21l-4 1 1-4Z" />
    </svg>
  );
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
  );
}

function TrashIcon(props) {
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
      <path d="M3 6h18" />
      <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6" />
      <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2" />
    </svg>
  );
}
