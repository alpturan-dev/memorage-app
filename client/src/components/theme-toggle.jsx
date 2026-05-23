import { Moon, Sun, Monitor, Check } from "lucide-react";
import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useTheme } from "@/context/ThemeContext";
import { twJoin } from "tailwind-merge";

const ThemeToggle = ({ variant = "icon" }) => {
  const { t } = useTranslation();
  const { theme, resolvedTheme, setTheme } = useTheme();

  const options = [
    { value: "light", label: t("navbar.themeLight"), icon: Sun },
    { value: "dark", label: t("navbar.themeDark"), icon: Moon },
    { value: "system", label: t("navbar.themeSystem"), icon: Monitor },
  ];

  if (variant === "row") {
    return (
      <div className="flex items-center justify-between px-3 py-2.5 rounded-lg">
        <span className="text-base font-medium text-foreground/80">
          {t("navbar.theme")}
        </span>
        <div className="flex items-center gap-1 rounded-full border border-border/60 bg-muted/40 p-1">
          {options.map((opt) => {
            const Icon = opt.icon;
            const active = theme === opt.value;
            return (
              <button
                key={opt.value}
                type="button"
                onClick={() => setTheme(opt.value)}
                className={twJoin(
                  "flex items-center justify-center h-7 w-7 rounded-full transition-colors",
                  active
                    ? "bg-background text-primary shadow-sm"
                    : "text-muted-foreground hover:text-foreground",
                )}
                aria-label={opt.label}
                title={opt.label}
              >
                <Icon className="h-3.5 w-3.5" />
              </button>
            );
          })}
        </div>
      </div>
    );
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="rounded-full hover:bg-muted"
          aria-label={t("navbar.toggleTheme")}
        >
          <Sun className="h-5 w-5 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
          <Moon className="absolute h-5 w-5 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
          <span className="sr-only">{t("navbar.toggleTheme")}</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-44">
        <DropdownMenuLabel className="font-normal text-xs text-muted-foreground">
          {t("navbar.theme")}
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        {options.map((opt) => {
          const Icon = opt.icon;
          const active = theme === opt.value;
          return (
            <DropdownMenuItem
              key={opt.value}
              className="cursor-pointer"
              onClick={() => setTheme(opt.value)}
            >
              <Icon className="mr-2 h-4 w-4" />
              <span className="flex-1">{opt.label}</span>
              {active && <Check className="h-3.5 w-3.5 text-primary" />}
            </DropdownMenuItem>
          );
        })}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default ThemeToggle;
