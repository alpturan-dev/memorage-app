import { Link } from "react-router-dom";
import { ArrowRight, Sparkles, Layers, Zap, Globe2, BookOpen, Brain } from "lucide-react";
import { useTranslation } from "react-i18next";
import { scrollToTop } from "@/lib/utils";
import { Button } from "@/components/ui/button";

const VisitorDashboard = () => {
  const { t } = useTranslation();

  return (
    <div className="min-h-screen bg-background overflow-hidden">
      {/* Hero Section */}
      <section className="relative pt-12 sm:pt-20 pb-16 px-4 sm:px-6 lg:px-8">
        {/* Background decorations */}
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-primary/5 rounded-full blur-3xl -translate-y-1/2" />
        <div className="absolute top-1/2 right-0 w-80 h-80 bg-accent/10 rounded-full blur-3xl translate-x-1/2" />

        <div className="relative max-w-6xl mx-auto">
          <div className="max-w-3xl">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/10 border border-primary/20 mb-6">
              <Sparkles className="h-3.5 w-3.5 text-primary" />
              <span className="text-xs font-medium text-primary">
                {t("dashboardPage.aiPowered")}
              </span>
            </div>

            {/* Main heading */}
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-foreground tracking-tight mb-6 leading-[1.1]">
              {t("dashboardPage.heroTitle")}
              <span className="text-primary"> {t("dashboardPage.heroTitleAccent")}</span>
            </h1>

            {/* Taglines */}
            <div className="space-y-1 mb-8">
              <p className="text-xl sm:text-2xl text-muted-foreground">
                {t("dashboardPage.tagline1")}{" "}
                <span className="text-foreground font-medium">{t("dashboardPage.tagline2")}</span>{" "}
                <span className="text-primary font-medium">{t("dashboardPage.tagline3")}</span>
              </p>
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-3 mb-12">
              <Button asChild size="lg" className="text-base px-6 h-12 rounded-xl">
                <Link to="/signup" onClick={scrollToTop}>
                  {t("dashboardPage.getStarted")}
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
              <Button asChild variant="outline" size="lg" className="text-base px-6 h-12 rounded-xl">
                <Link to="/login" onClick={scrollToTop}>
                  {t("dashboardPage.alreadyHaveAccount")}
                </Link>
              </Button>
            </div>

            {/* Social proof */}
            <div className="flex items-center gap-4 text-sm text-muted-foreground">
              <div className="flex -space-x-2">
                {["🇪🇸", "🇫🇷", "🇩🇪", "🇯🇵", "🇰🇷"].map((flag, i) => (
                  <div
                    key={i}
                    className="w-8 h-8 rounded-full bg-secondary/50 border-2 border-background flex items-center justify-center text-sm"
                  >
                    {flag}
                  </div>
                ))}
              </div>
              <span>{t("dashboardPage.supportedLanguages")}</span>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section - Bento Grid */}
      <section className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-2xl sm:text-3xl font-bold text-foreground mb-3">
              {t("dashboardPage.featuresTitle")}
            </h2>
            <p className="text-muted-foreground max-w-xl mx-auto">
              {t("dashboardPage.featuresSubtitle")}
            </p>
          </div>

          {/* Bento Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {/* Feature 1 - Large */}
            <div className="md:col-span-2 lg:col-span-2 bg-gradient-to-br from-primary/10 via-primary/5 to-transparent rounded-3xl p-8 border border-primary/10 relative overflow-hidden group">
              <div className="absolute top-0 right-0 w-48 h-48 bg-primary/5 rounded-full -translate-y-1/2 translate-x-1/2 group-hover:scale-110 transition-transform duration-500" />

              <div className="relative">
                <div className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-primary/10 mb-5">
                  <Layers className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-xl font-semibold text-foreground mb-2">
                  {t("dashboardPage.feature1.title")}
                </h3>
                <p className="text-muted-foreground max-w-md">
                  {t("dashboardPage.feature1.description")}
                </p>
              </div>
            </div>

            {/* Feature 2 */}
            <div className="bg-gradient-to-br from-accent/30 to-accent/10 rounded-3xl p-8 border border-accent/20 relative overflow-hidden group">
              <div className="absolute bottom-0 left-0 w-32 h-32 bg-accent/10 rounded-full translate-y-1/2 -translate-x-1/2 group-hover:scale-110 transition-transform duration-500" />

              <div className="relative">
                <div className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-accent/30 mb-5">
                  <Sparkles className="h-6 w-6 text-foreground" />
                </div>
                <h3 className="text-xl font-semibold text-foreground mb-2">
                  {t("dashboardPage.feature2.title")}
                </h3>
                <p className="text-muted-foreground">
                  {t("dashboardPage.feature2.description")}
                </p>
              </div>
            </div>

            {/* Feature 3 */}
            <div className="bg-gradient-to-br from-secondary/40 to-secondary/20 rounded-3xl p-8 border border-secondary/30 relative overflow-hidden group">
              <div className="relative">
                <div className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-secondary/50 mb-5">
                  <Zap className="h-6 w-6 text-foreground" />
                </div>
                <h3 className="text-xl font-semibold text-foreground mb-2">
                  {t("dashboardPage.feature3.title")}
                </h3>
                <p className="text-muted-foreground">
                  {t("dashboardPage.feature3.description")}
                </p>
              </div>
            </div>

            {/* Feature 4 - Audio */}
            <div className="md:col-span-2 lg:col-span-2 bg-card rounded-3xl p-8 border border-border relative overflow-hidden">
              <div className="flex flex-col sm:flex-row gap-6 items-start">
                <div className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-primary/10 shrink-0">
                  <Brain className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-foreground mb-2">
                    {t("dashboardPage.feature4.title")}
                  </h3>
                  <p className="text-muted-foreground">
                    {t("dashboardPage.feature4.description")}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Bottom CTA */}
      <section className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-primary/15 via-primary/10 to-accent/10 border border-primary/10 p-8 sm:p-12 text-center">
            <div className="absolute top-0 left-1/4 w-64 h-64 bg-primary/10 rounded-full blur-3xl" />
            <div className="absolute bottom-0 right-1/4 w-48 h-48 bg-accent/20 rounded-full blur-3xl" />

            <div className="relative">
              <h2 className="text-2xl sm:text-3xl font-bold text-foreground mb-4">
                {t("dashboardPage.ctaTitle")}
              </h2>
              <p className="text-muted-foreground mb-8 max-w-lg mx-auto">
                {t("dashboardPage.callToActionDescription")}
              </p>
              <Button asChild size="lg" className="text-base px-8 h-12 rounded-xl">
                <Link to="/signup" onClick={scrollToTop}>
                  {t("dashboardPage.startLearning")}
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default VisitorDashboard;
