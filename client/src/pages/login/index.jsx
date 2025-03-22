import { useEffect, useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { apiRequest } from "@/api/config";
import { useAuth } from "@/context/AuthContext";
import toast from "react-hot-toast";
import { useTranslation } from "react-i18next";
import logo from "../../../public/image.png";
import i18n from "@/i18n";

const Login = () => {
  const { t } = useTranslation();
  const [loading, setLoading] = useState(false);
  const { setToken } = useAuth();
  const navigate = useNavigate();
  const [credentials, setCredentials] = useState({
    email: "",
    password: "",
  });

  useEffect(() => {
    const state = window.history.state;
    if (state && state.toastMessage) {
      toast(state.toastMessage);
      window.history.replaceState(null, "", window.location.pathname);
    }
  }, []);

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      if ((credentials.email === null, credentials.password === null)) {
        toast.error(t("loginPage.credentialsRequired"));
      }
      const response = await apiRequest.post("/login", { ...credentials });
      if (response.status === 200) {
        i18n.changeLanguage(response.data.user.language);
        localStorage.setItem("user", JSON.stringify(response.data.user));
        localStorage.setItem("token", response.data.token);
        setToken(response.data.token);
        navigate("/");
        toast.success(t("loginPage.loggedIn"));
      }
    } catch (error) {
      console.error(error);
      toast.error(error.response.data.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center bg-background px-4 pt-6 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-md space-y-4">
        <div className="flex items-center justify-center mb-8">
          <img src={logo} className="w-40 h-36" />
        </div>
        <div className="text-center pb-4">
          <h1 className="text-3xl font-bold tracking-tight text-foreground">
            {t("loginPage.title")}
          </h1>
          <p className="mt-2 text-muted-foreground">
            {t("loginPage.subtitle")}
            <NavLink
              to="/signup"
              className="font-medium text-primary hover:underline"
            >
              {t("signupPage.signup")}
            </NavLink>
          </p>
        </div>
        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <Label htmlFor="email">{t("common.email")}</Label>
            <Input
              id="email"
              type="email"
              placeholder={t("common.emailExample")}
              required
              disabled={loading}
              value={credentials.email}
              onChange={(e) =>
                setCredentials({
                  ...credentials,
                  email: e.target.value,
                })
              }
            />
          </div>
          <div>
            <Label htmlFor="password">{t("common.password")}</Label>
            <Input
              id="password"
              type="password"
              placeholder={t("common.password")}
              required
              disabled={loading}
              value={credentials.password}
              onChange={(e) =>
                setCredentials({
                  ...credentials,
                  password: e.target.value,
                })
              }
            />
          </div>
          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? t("loginPage.loggingIn") : t("loginPage.login")}
          </Button>
        </form>
      </div>
    </div>
  );
};

export default Login;
