import { Link } from "react-router-dom";
import { Book, Folder, Plus } from "lucide-react";
import { useRef } from "react";
import { useTranslation } from "react-i18next";
import logo from "../../../public/image.png";
import { scrollToTop } from "@/lib/utils";

const Dashboard = () => {
  const { t } = useTranslation();
  const targetRef = useRef(null);

  const handleScroll = () => {
    if (targetRef.current) {
      targetRef.current.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <div className="min-h-screen py-12 px-4 sm:px-6 lg:px-8 bg-background">
      <main className="max-w-7xl mx-auto">
        <section className="text-center mb-16">
          <div className="flex items-center justify-center mb-3 sm:mb-6">
            <img src={logo} className="w-36 h-32 sm:w-40 sm:h-36" alt="Logo" />
          </div>
          <p className="text-xl mb-8 max-w-2xl mx-auto text-muted-foreground">
            {t("dashboardPage.description")}
          </p>
          <div className="space-x-4 space-y-2">
            <Link
              to="/collections"
              onClick={scrollToTop}
              className="inline-block px-6 py-3 text-lg font-semibold text-primary-foreground bg-primary hover:bg-primary/90 rounded-lg transition duration-300"
            >
              {t("dashboardPage.getStarted")}
            </Link>
            <Link
              onClick={handleScroll}
              className="inline-block px-6 py-3 text-lg font-semibold rounded-lg transition duration-300 bg-background border-2 border-border hover:bg-secondary"
            >
              {t("dashboardPage.learnMore")}
            </Link>
          </div>
        </section>

        <section className="mb-16" ref={targetRef}>
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {[
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
            ].map((feature, index) => (
              <div
                key={index}
                className="rounded-xl shadow-md hover:shadow-xl transition-shadow duration-300 overflow-hidden bg-card"
              >
                <div className="p-8">
                  <div className="flex items-center justify-start gap-4">
                    <feature.icon className="h-12 w-12 mb-4 text-primary" />
                    <h3 className="text-xl font-semibold mb-4 text-foreground">
                      {feature.title}
                    </h3>
                  </div>
                  <p className="text-muted-foreground">{feature.description}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        <section className="text-center">
          <h2 className="text-3xl font-bold mb-4 text-foreground">
            {t("dashboardPage.callToActionTitle")}
          </h2>
          <p className="text-xl mb-8 max-w-2xl mx-auto text-muted-foreground">
            {t("dashboardPage.callToActionDescription")}
          </p>
          <div className="space-x-4 space-y-2">
            <Link
              to="/collections"
              onClick={scrollToTop}
              className="inline-block px-6 py-3 text-lg font-semibold text-primary-foreground bg-primary hover:bg-primary/90 rounded-lg transition duration-300"
            >
              {t("dashboardPage.createCollection")}
            </Link>
            <Link
              to="/exercises"
              onClick={scrollToTop}
              className="inline-block px-6 py-3 text-lg font-semibold rounded-lg transition duration-300 text-foreground bg-secondary hover:bg-secondary/80"
            >
              {t("dashboardPage.practiceNow")}
            </Link>
          </div>
        </section>
      </main>
    </div>
  );
};

export default Dashboard;
