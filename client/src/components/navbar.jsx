import { useTranslation } from "react-i18next";
import { NavLink, useNavigate } from "react-router-dom";
import { Menu, User, LogOut, Swords, LogIn, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useState } from "react";
import logo from "../../public/logo1.png";
import toast from "react-hot-toast";
import { twJoin } from "tailwind-merge";

function Navbar() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);
  const navItems = [
    { to: "/", name: t("navbar.home") },
    { to: "/collections", name: t("navbar.collections") },
    { to: "/exercises", name: t("navbar.exercises") },
  ];
  const username = JSON.parse(localStorage.getItem("user"))?.username;
  const initial = username ? username.charAt(0).toUpperCase() : "";

  const desktopLinkClass = ({ isActive }) =>
    twJoin(
      "relative px-3 py-2 text-sm font-medium rounded-md transition-colors",
      "after:absolute after:left-3 after:right-3 after:-bottom-0.5 after:h-[2px] after:rounded-full",
      "after:bg-primary after:origin-left after:transition-transform after:duration-300",
      isActive
        ? "text-primary after:scale-x-100"
        : "text-foreground/70 hover:text-foreground after:scale-x-0 hover:after:scale-x-100",
    );

  const mobileLinkClass = ({ isActive }) =>
    twJoin(
      "flex items-center px-3 py-2.5 rounded-lg text-base font-medium transition-colors",
      isActive
        ? "bg-primary/10 text-primary"
        : "text-foreground/80 hover:bg-muted",
    );

  const AccountDropdown = () => {
    return (
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <button
            className="group flex items-center gap-2 rounded-full pl-1 pr-3 py-1 border border-border/80 bg-card/60 hover:bg-card hover:border-primary/40 transition-all"
            aria-label={t("navbar.myAccount")}
          >
            <span className="flex h-7 w-7 items-center justify-center rounded-full bg-gradient-to-br from-primary to-primary/70 text-primary-foreground text-xs font-bold shadow-sm">
              {initial}
            </span>
            <span className="text-sm font-medium max-w-[120px] truncate">
              {username}
            </span>
          </button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-52">
          <DropdownMenuLabel className="font-normal">
            <div className="flex flex-col">
              <span className="text-xs text-muted-foreground">
                {t("navbar.myAccount")}
              </span>
              <span className="text-sm font-semibold truncate">{username}</span>
            </div>
          </DropdownMenuLabel>
          <DropdownMenuSeparator />
          <NavLink to="/profile">
            <DropdownMenuItem className="cursor-pointer">
              <User className="mr-2 h-4 w-4" />
              <span>{t("navbar.profile")}</span>
            </DropdownMenuItem>
          </NavLink>
          <DropdownMenuItem
            className="cursor-pointer text-destructive focus:text-destructive"
            onClick={() => {
              localStorage.clear();
              navigate("/login");
              toast.success(t("loginPage.loggedOut"));
              setIsOpen(false);
            }}
          >
            <LogOut className="mr-2 h-4 w-4" />
            <span>{t("navbar.logout")}</span>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    );
  };

  return (
    <header className="sticky top-0 z-40 bg-background/75 backdrop-blur-md border-b border-border/60">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between gap-4">
          {/* Logo */}
          <NavLink to="/" className="flex items-center gap-2 shrink-0 group">
            <div className="relative">
              <img
                src={logo}
                className="w-11 h-11 transition-transform group-hover:scale-105"
                alt="logo"
              />
            </div>
            <span className="hidden sm:inline-flex items-center gap-1 px-1.5 py-0.5 rounded-md text-[10px] font-semibold tracking-wide uppercase bg-gradient-to-r from-primary/15 to-accent/40 text-primary border border-primary/20">
              <Sparkles className="h-2.5 w-2.5" />
              Beta
            </span>
          </NavLink>

          {/* Desktop nav */}
          <nav className="hidden lg:flex items-center gap-1">
            {navItems.map((item) => (
              <NavLink
                key={item.name}
                to={item.to}
                end={item.to === "/"}
                className={desktopLinkClass}
              >
                {item.name}
              </NavLink>
            ))}
            <div
              className="relative flex items-center gap-1 px-3 py-2 text-sm font-medium text-foreground/50 cursor-not-allowed select-none"
              aria-disabled="true"
            >
              <Swords className="h-4 w-4" />
              <span>{t("comingSoon.wordBattle")}</span>
              <span className="ml-1 text-[0.6rem] font-bold bg-gradient-to-r from-[#016DCC] to-purple-600 bg-clip-text text-transparent uppercase tracking-wider">
                {t("comingSoon.comingSoon")}
              </span>
            </div>
          </nav>

          {/* Right side */}
          <div className="flex items-center gap-2">
            {username ? (
              <div className="hidden lg:block">
                <AccountDropdown />
              </div>
            ) : (
              <div className="hidden lg:block">
                <Button
                  size="sm"
                  className="rounded-full px-4 shadow-sm"
                  onClick={() => navigate("/login")}
                >
                  <LogIn className="mr-2 h-4 w-4" />
                  <span>{t("loginPage.login")}</span>
                </Button>
              </div>
            )}

            {/* Mobile menu button */}
            <div className="lg:hidden">
              <Sheet open={isOpen} onOpenChange={setIsOpen}>
                <SheetTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="rounded-full hover:bg-muted"
                  >
                    <Menu className="h-5 w-5" />
                    <span className="sr-only">Open menu</span>
                  </Button>
                </SheetTrigger>
                <SheetContent
                  side="right"
                  className="w-[300px] sm:w-[380px] p-0 flex flex-col"
                >
                  <div className="px-6 pt-6 pb-4 border-b border-border/60">
                    <div className="flex items-center gap-2">
                      <img src={logo} className="w-10 h-10" alt="logo" />
                      <span className="px-1.5 py-0.5 rounded-md text-[10px] font-semibold uppercase bg-primary/10 text-primary border border-primary/20">
                        Beta
                      </span>
                    </div>
                  </div>

                  <nav className="flex flex-col gap-1 px-4 py-4 flex-1">
                    {navItems.map((item) => (
                      <NavLink
                        key={item.name}
                        to={item.to}
                        end={item.to === "/"}
                        className={mobileLinkClass}
                        onClick={() => setIsOpen(false)}
                      >
                        {item.name}
                      </NavLink>
                    ))}
                    <div
                      className="flex items-center justify-between px-3 py-2.5 rounded-lg text-base font-medium opacity-60 cursor-not-allowed"
                      aria-disabled="true"
                    >
                      <span className="flex items-center gap-2">
                        <Swords className="h-4 w-4 text-primary" />
                        {t("comingSoon.wordBattle")}
                      </span>
                      <span className="text-[0.65rem] font-bold bg-gradient-to-r from-[#016DCC] to-purple-600 bg-clip-text text-transparent uppercase tracking-wider">
                        {t("comingSoon.comingSoon")}
                      </span>
                    </div>
                  </nav>

                  <div className="border-t border-border/60 px-4 py-4">
                    {username ? (
                      <div className="space-y-1">
                        <div className="flex items-center gap-3 px-3 py-2 mb-1">
                          <span className="flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-br from-primary to-primary/70 text-primary-foreground text-sm font-bold">
                            {initial}
                          </span>
                          <div className="flex flex-col">
                            <span className="text-xs text-muted-foreground">
                              {t("navbar.myAccount")}
                            </span>
                            <span className="text-sm font-semibold truncate">
                              {username}
                            </span>
                          </div>
                        </div>
                        <NavLink
                          to="/profile"
                          className={mobileLinkClass}
                          onClick={() => setIsOpen(false)}
                        >
                          <User className="mr-2 h-4 w-4" />
                          {t("navbar.profile")}
                        </NavLink>
                        <button
                          className="w-full flex items-center px-3 py-2.5 rounded-lg text-base font-medium text-destructive hover:bg-destructive/10 transition-colors"
                          onClick={() => {
                            localStorage.clear();
                            navigate("/login");
                            toast.success(t("loginPage.loggedOut"));
                            setIsOpen(false);
                          }}
                        >
                          <LogOut className="mr-2 h-4 w-4" />
                          {t("navbar.logout")}
                        </button>
                      </div>
                    ) : (
                      <Button
                        className="w-full rounded-full"
                        onClick={() => {
                          localStorage.clear();
                          setIsOpen(false);
                          navigate("/login");
                        }}
                      >
                        <LogIn className="mr-2 h-4 w-4" />
                        {t("loginPage.login")}
                      </Button>
                    )}
                  </div>
                </SheetContent>
              </Sheet>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}

export default Navbar;
