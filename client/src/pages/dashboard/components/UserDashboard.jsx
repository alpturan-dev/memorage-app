import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import {
  ArrowRight,
  Plus,
  Play,
  ChevronRight,
  Flame,
  Volume2,
  BookOpen,
  Target,
  TrendingUp,
  Sparkles,
} from "lucide-react";
import { useTranslation } from "react-i18next";
import { scrollToTop } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Progress } from "@/components/ui/progress";
import { apiRequest } from "@/api/config";

const UserDashboard = () => {
  const { t } = useTranslation();
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showTranslation, setShowTranslation] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const user = JSON.parse(localStorage.getItem("user"));

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await apiRequest.get("/api/dashboard/stats");
        setStats(response.data);
      } catch (error) {
        console.error("Error fetching dashboard stats:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  const playAudio = async (text, languageCode) => {
    if (isPlaying) return;
    setIsPlaying(true);
    try {
      const response = await apiRequest.post(
        "/api/tts/synthesize",
        { text, languageCode },
        { responseType: "blob" }
      );
      const audioUrl = URL.createObjectURL(response.data);
      const audio = new Audio(audioUrl);
      audio.onended = () => setIsPlaying(false);
      audio.play();
    } catch (error) {
      console.error("Error playing audio:", error);
      setIsPlaying(false);
    }
  };

  const getTimeOfDayGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return t("dashboardPage.goodMorning");
    if (hour < 18) return t("dashboardPage.goodAfternoon");
    return t("dashboardPage.goodEvening");
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <Skeleton className="h-8 w-48 mb-2" />
          <Skeleton className="h-12 w-72 mb-8" />
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            {[...Array(4)].map((_, i) => (
              <Skeleton key={i} className="h-28 rounded-2xl" />
            ))}
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <Skeleton className="h-64 rounded-2xl lg:col-span-2" />
            <Skeleton className="h-64 rounded-2xl" />
          </div>
        </div>
      </div>
    );
  }

  const hasCollections = stats?.totalCollections > 0;
  const streakActive = stats?.streak?.current > 0;

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header with greeting */}
        <div className="mb-8">
          <p className="text-muted-foreground text-sm font-medium mb-1">
            {getTimeOfDayGreeting()}
          </p>
          <h1 className="text-3xl sm:text-4xl font-bold text-foreground">
            {user?.username || "User"}
          </h1>
        </div>

        {/* Stats Grid - Bento style */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mb-8">
          {/* Words stat */}
          <div className="bg-gradient-to-br from-primary/10 to-primary/5 rounded-2xl p-4 sm:p-5 border border-primary/10">
            <div className="flex items-center gap-2 mb-3">
              <div className="p-2 bg-primary/10 rounded-lg">
                <BookOpen className="h-4 w-4 text-primary" />
              </div>
            </div>
            <p className="text-3xl sm:text-4xl font-bold text-foreground">
              {stats?.totalWords || 0}
            </p>
            <p className="text-xs sm:text-sm text-muted-foreground mt-1">
              {t("dashboardPage.totalWords")}
            </p>
          </div>

          {/* Collections stat */}
          <div className="bg-gradient-to-br from-secondary/40 to-secondary/20 rounded-2xl p-4 sm:p-5 border border-secondary/30">
            <div className="flex items-center gap-2 mb-3">
              <div className="p-2 bg-secondary/50 rounded-lg">
                <Target className="h-4 w-4 text-foreground" />
              </div>
            </div>
            <p className="text-3xl sm:text-4xl font-bold text-foreground">
              {stats?.totalCollections || 0}
            </p>
            <p className="text-xs sm:text-sm text-muted-foreground mt-1">
              {t("dashboardPage.totalCollections")}
            </p>
          </div>

          {/* Languages stat */}
          <div className="bg-gradient-to-br from-accent/30 to-accent/10 rounded-2xl p-4 sm:p-5 border border-accent/20">
            <div className="flex items-center gap-2 mb-3">
              <div className="p-2 bg-accent/30 rounded-lg">
                <TrendingUp className="h-4 w-4 text-foreground" />
              </div>
            </div>
            <p className="text-3xl sm:text-4xl font-bold text-foreground">
              {stats?.languagesLearning?.length || 0}
            </p>
            <p className="text-xs sm:text-sm text-muted-foreground mt-1">
              {t("dashboardPage.languagesLearning")}
            </p>
          </div>

          {/* Streak stat */}
          <div
            className={`rounded-2xl p-4 sm:p-5 border ${
              streakActive
                ? "bg-gradient-to-br from-orange-500/20 to-orange-500/5 border-orange-500/20"
                : "bg-gradient-to-br from-muted/50 to-muted/30 border-muted/30"
            }`}
          >
            <div className="flex items-center gap-2 mb-3">
              <div
                className={`p-2 rounded-lg ${
                  streakActive ? "bg-orange-500/20" : "bg-muted"
                }`}
              >
                <Flame
                  className={`h-4 w-4 ${
                    streakActive ? "text-orange-500" : "text-muted-foreground"
                  }`}
                />
              </div>
            </div>
            <p
              className={`text-3xl sm:text-4xl font-bold ${
                streakActive ? "text-orange-500" : "text-muted-foreground"
              }`}
            >
              {stats?.streak?.current || 0}
            </p>
            <p className="text-xs sm:text-sm text-muted-foreground mt-1">
              {t("dashboardPage.streak")}
            </p>
          </div>
        </div>

        {hasCollections ? (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Left column - Main content */}
            <div className="lg:col-span-2 space-y-6">
              {/* Word of the Day - Featured card */}
              {stats?.wordOfTheDay && (
                <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-primary/15 via-primary/10 to-transparent border border-primary/10">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full -translate-y-1/2 translate-x-1/2" />
                  <div className="absolute bottom-0 left-0 w-24 h-24 bg-primary/5 rounded-full translate-y-1/2 -translate-x-1/2" />

                  <div className="relative p-6">
                    <div className="flex items-center gap-2 mb-4">
                      <Sparkles className="h-4 w-4 text-primary" />
                      <p className="text-sm font-medium text-primary">
                        {t("dashboardPage.wordOfTheDay")}
                      </p>
                    </div>

                    <div className="flex items-start justify-between gap-4">
                      <div
                        className="flex-1 cursor-pointer select-none"
                        onClick={() => setShowTranslation(!showTranslation)}
                      >
                        <p className="text-2xl sm:text-3xl font-bold text-foreground mb-2">
                          {stats.wordOfTheDay.nativeWord}
                        </p>

                        <div className="h-8 flex items-center">
                          {showTranslation ? (
                            <p className="text-lg text-muted-foreground animate-in fade-in duration-200">
                              {stats.wordOfTheDay.targetWord}
                            </p>
                          ) : (
                            <p className="text-sm text-muted-foreground/70 italic">
                              {t("dashboardPage.tapToReveal")}
                            </p>
                          )}
                        </div>

                        <div className="flex items-center gap-2 mt-4">
                          <span className="text-lg">
                            {stats.wordOfTheDay.targetLanguage?.flag || "🌐"}
                          </span>
                          <span className="text-xs text-muted-foreground">
                            {stats.wordOfTheDay.collectionName}
                          </span>
                        </div>
                      </div>

                      <Button
                        variant="secondary"
                        size="icon"
                        onClick={() =>
                          playAudio(
                            stats.wordOfTheDay.nativeWord,
                            stats.wordOfTheDay.nativeWord?.code
                          )
                        }
                        disabled={isPlaying}
                        className="h-12 w-12 rounded-xl shrink-0"
                      >
                        <Volume2
                          className={`h-5 w-5 ${
                            isPlaying ? "animate-pulse" : ""
                          }`}
                        />
                      </Button>
                    </div>
                  </div>
                </div>
              )}

              {/* Recent Collections */}
              <div>
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-lg font-semibold text-foreground">
                    {t("dashboardPage.recentCollections")}
                  </h2>
                  <Link
                    to="/collections"
                    onClick={scrollToTop}
                    className="text-sm text-primary hover:text-primary/80 transition-colors font-medium"
                  >
                    {t("dashboardPage.viewAll")}
                  </Link>
                </div>

                <div className="space-y-2">
                  {stats?.recentCollections?.map((collection) => (
                    <Link
                      key={collection._id}
                      to={`/collection/${collection._id}`}
                      onClick={scrollToTop}
                      className="flex items-center justify-between p-4 rounded-xl bg-card border border-border hover:border-primary/30 hover:shadow-sm transition-all group"
                    >
                      <div className="flex items-center gap-3">
                        <span className="text-2xl">
                          {collection.targetLanguage?.flag || "🌐"}
                        </span>
                        <div>
                          <span className="font-medium text-foreground block">
                            {collection.name}
                          </span>
                          <span className="text-xs text-muted-foreground">
                            {t("dashboardPage.wordsCount", {
                              count: collection.wordCount,
                            })}
                          </span>
                        </div>
                      </div>
                      <ChevronRight className="h-5 w-5 text-muted-foreground group-hover:text-primary group-hover:translate-x-1 transition-all" />
                    </Link>
                  ))}
                </div>
              </div>
            </div>

            {/* Right column - Quick actions & Activity */}
            <div className="space-y-6">
              {/* Quick Actions */}
              <div className="rounded-2xl border border-border bg-card p-5">
                <h3 className="text-sm font-semibold text-foreground mb-4">
                  {t("dashboardPage.quickActions")}
                </h3>
                <div className="space-y-3">
                  <Button
                    asChild
                    className="w-full justify-start h-12 rounded-xl"
                  >
                    <Link to="/collections" onClick={scrollToTop}>
                      <Plus className="h-4 w-4 mr-3" />
                      {t("dashboardPage.newCollection")}
                    </Link>
                  </Button>
                  <Button
                    asChild
                    variant="secondary"
                    className="w-full justify-start h-12 rounded-xl"
                  >
                    <Link to="/exercises" onClick={scrollToTop}>
                      <Play className="h-4 w-4 mr-3" />
                      {t("dashboardPage.startPractice")}
                    </Link>
                  </Button>
                </div>
              </div>

              {/* Weekly Activity */}
              {stats?.activityChart && (
                <div className="rounded-2xl border border-border bg-card p-5">
                  <h3 className="text-sm font-semibold text-foreground mb-4">
                    {t("dashboardPage.thisWeek")}
                  </h3>
                  <div className="flex items-end justify-between gap-1" style={{ height: "80px" }}>
                    {stats.activityChart.map((day, index) => {
                      const isToday = index === stats.activityChart.length - 1;
                      const hasActivity = day.count > 0;
                      // Calculate height in pixels (min 6px, max 60px for bars)
                      const barHeight = hasActivity
                        ? Math.max(12, Math.round((day.percentage / 100) * 60))
                        : 6;
                      return (
                        <div
                          key={index}
                          className="flex-1 flex flex-col items-center justify-end gap-1"
                          style={{ height: "100%" }}
                          title={`${day.wordsAdded || 0} words, ${day.exercisesCompleted || 0} exercises`}
                        >
                          <div
                            className={`w-full rounded-md transition-all ${
                              isToday
                                ? "bg-primary"
                                : hasActivity
                                ? "bg-secondary"
                                : "bg-secondary/30"
                            }`}
                            style={{ height: `${barHeight}px` }}
                          />
                          <span
                            className={`text-[10px] ${
                              isToday
                                ? "text-primary font-semibold"
                                : "text-muted-foreground"
                            }`}
                          >
                            {day.dayLabel}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Motivation card */}
              {streakActive && stats.streak.current >= 3 && (
                <div className="rounded-2xl bg-gradient-to-br from-orange-500/10 to-orange-500/5 border border-orange-500/20 p-5">
                  <div className="flex items-center gap-3 mb-2">
                    <Flame className="h-5 w-5 text-orange-500" />
                    <span className="text-sm font-semibold text-foreground">
                      {t("dashboardPage.onFire")}
                    </span>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    {t("dashboardPage.streakMessage", {
                      count: stats.streak.current,
                    })}
                  </p>
                </div>
              )}
            </div>
          </div>
        ) : (
          /* Empty State - More engaging */
          <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-primary/10 via-transparent to-accent/10 border border-primary/10">
            <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full -translate-y-1/2 translate-x-1/2" />
            <div className="absolute bottom-0 left-0 w-48 h-48 bg-accent/10 rounded-full translate-y-1/2 -translate-x-1/2" />

            <div className="relative text-center py-16 px-6">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-primary/10 mb-6">
                <BookOpen className="h-8 w-8 text-primary" />
              </div>
              <h2 className="text-2xl font-bold text-foreground mb-3">
                {t("dashboardPage.noCollectionsYet")}
              </h2>
              <p className="text-muted-foreground mb-8 max-w-md mx-auto">
                {t("dashboardPage.createFirstCollection")}
              </p>
              <Button asChild size="lg" className="rounded-xl px-8">
                <Link to="/collections" onClick={scrollToTop}>
                  {t("dashboardPage.newCollection")}
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default UserDashboard;
