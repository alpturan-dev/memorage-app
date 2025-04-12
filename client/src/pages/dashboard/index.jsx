import { Link } from "react-router-dom";
import { Book, Folder, Plus, ArrowRight } from "lucide-react";
import { useRef } from "react";
import { useTranslation } from "react-i18next";
import logo from "../../../public/logo1.png";
import { scrollToTop } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";

const FeatureCard = ({ icon: Icon, title, description }) => {
  return (
    <Card className="hover:shadow-lg transition-all duration-300 transform hover:-translate-y-2">
      <CardContent className="p-8">
        <div className="flex items-center justify-start gap-4 mb-4">
          <Icon className="h-12 w-12 text-primary" />
          <h3 className="text-xl font-semibold text-foreground">{title}</h3>
        </div>
        <p className="text-muted-foreground leading-relaxed">{description}</p>
      </CardContent>
    </Card>
  );
};

const Dashboard = () => {
  const { t } = useTranslation();
  const targetRef = useRef(null);

  const handleScroll = () => {
    if (targetRef.current) {
      targetRef.current.scrollIntoView({ behavior: "smooth" });
    }
  };

  const features = [
    {
      icon: Folder,
      title: t("dashboardPage.feature1.title"),
      description: t("dashboardPage.feature1.description"),
    },
    {
      icon: Plus,
      title: t("dashboardPage.feature2.title"),
      description: t("dashboardPage.feature2.description"),
    },
    {
      icon: Book,
      title: t("dashboardPage.feature3.title"),
      description: t("dashboardPage.feature3.description"),
    },
  ];

  return (
    <div className="min-h-screen py-12 px-1 sm:px-4 lg:px-8 bg-background">
      <main className="max-w-7xl mx-auto">
        {/* Hero Section */}
        <div className="text-center mb-20 animate-fade-in-up">
          <div className="flex items-center justify-center mb-6">
            <img
              src={logo}
              className="w-36 h-32 sm:w-40 sm:h-36 transform transition-transform hover:scale-105"
              alt="Logo"
            />
          </div>
          <p className="text-base md:text-xl mb-8 max-w-2xl mx-auto text-muted-foreground">
            {t("dashboardPage.description")}
          </p>
          <div className="flex flex-col gap-2 md:gap-4 md:flex-row justify-center">
            <Button asChild size="lg" className="group">
              <Link to="/collections" onClick={scrollToTop}>
                {t("dashboardPage.getStarted")}
                <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
              </Link>
            </Button>
            <Button asChild variant="outline" size="lg">
              <Link onClick={handleScroll}>{t("dashboardPage.learnMore")}</Link>
            </Button>
          </div>
        </div>

        {/* Features Section */}
        <div className="mb-20" ref={targetRef}>
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {features.map((feature, index) => (
              <FeatureCard
                key={index}
                icon={feature.icon}
                title={feature.title}
                description={feature.description}
              />
            ))}
          </div>
        </div>

        {/* Call to Action Section */}
        <Card className="text-center bg-secondary/10 px-1 py-10">
          <CardHeader className="px-1">
            <h2 className="text-xl md:text-3xl font-bold text-foreground">
              {t("dashboardPage.callToActionTitle")}
            </h2>
            <p className="text-base md:text-xl mx-auto text-muted-foreground">
              {t("dashboardPage.callToActionDescription")}
            </p>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col gap-4 md:flex-row justify-center">
              <Button asChild size="lg" className="group">
                <Link to="/collections" onClick={scrollToTop}>
                  {t("dashboardPage.createCollection")}
                  <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                </Link>
              </Button>
              <Button asChild variant="secondary" size="lg">
                <Link to="/exercises" onClick={scrollToTop} className="ml-0">
                  {t("dashboardPage.practiceNow")}
                </Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  );
};

export default Dashboard;
