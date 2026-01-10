import { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { apiRequest } from "@/api/config";
import toast from "react-hot-toast";
import { useTranslation } from "react-i18next";
import { User, Mail, Lock, ArrowRight } from "lucide-react";
import logo from "../../../public/logo1.png";

const SignUp = () => {
  const { t } = useTranslation();
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const [credentials, setCredentials] = useState({
    username: "",
    email: "",
    password: "",
  });

  const handleSignUp = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      const response = await apiRequest.post("/signup", { ...credentials });
      if (response.status === 201) {
        navigate("/login");
        toast.success(t("signupPage.signedUp"));
      }
    } catch (error) {
      console.error(error);
      toast.error(error.response.data.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center bg-background px-4 sm:px-6 lg:px-8 py-10 overflow-hidden relative">
      {/* Background decorations */}
      <div className="absolute top-1/4 right-0 w-80 h-80 bg-accent/10 rounded-full blur-3xl translate-x-1/2" />
      <div className="absolute bottom-0 left-1/4 w-64 h-64 bg-primary/5 rounded-full blur-3xl translate-y-1/2" />

      <div className="w-full max-w-md relative">
        {/* Card */}
        <div className="bg-card rounded-2xl border border-border p-6 sm:p-8 shadow-sm">
          <div className="flex justify-center mb-4">
            <img src={logo} className="w-20 h-auto" alt="Memorage" />
          </div>
          <div className="text-center mb-6">
            <h1 className="text-xl sm:text-2xl font-medium tracking-tight text-foreground">
              {t("signupPage.title")}
            </h1>
            <p className="mt-2 text-muted-foreground text-sm">
              {t("signupPage.subtitle")}
              <NavLink
                to="/login"
                className="font-medium text-primary hover:text-primary/80 transition-colors"
              >
                {t("loginPage.login")}
              </NavLink>
            </p>
          </div>

          <form onSubmit={handleSignUp} className="space-y-4">
            <div className="space-y-1.5">
              <Label htmlFor="username" className="text-sm font-medium">
                {t("signupPage.username")}
              </Label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  id="username"
                  type="text"
                  placeholder={t("signupPage.username")}
                  required
                  disabled={loading}
                  className="pl-10 h-11"
                  value={credentials.username}
                  onChange={(e) =>
                    setCredentials({
                      ...credentials,
                      username: e.target.value,
                    })
                  }
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="email" className="text-sm font-medium">
                {t("common.email")}
              </Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  id="email"
                  type="email"
                  placeholder={t("common.emailExample")}
                  required
                  disabled={loading}
                  className="pl-10 h-11"
                  value={credentials.email}
                  onChange={(e) =>
                    setCredentials({
                      ...credentials,
                      email: e.target.value,
                    })
                  }
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="password" className="text-sm font-medium">
                {t("common.password")}
              </Label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  id="password"
                  type="password"
                  placeholder="••••••••"
                  required
                  disabled={loading}
                  className="pl-10 h-11"
                  value={credentials.password}
                  onChange={(e) =>
                    setCredentials({
                      ...credentials,
                      password: e.target.value,
                    })
                  }
                />
              </div>
            </div>

            <Button
              type="submit"
              className="w-full h-11 text-base rounded-xl mt-2"
              disabled={loading}
            >
              {loading ? (
                t("signupPage.signingUp")
              ) : (
                <>
                  {t("signupPage.signup")}
                  <ArrowRight className="ml-2 h-4 w-4" />
                </>
              )}
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default SignUp;
