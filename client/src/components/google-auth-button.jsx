import { GoogleLogin } from "@react-oauth/google";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import toast from "react-hot-toast";
import { apiRequest } from "@/api/config";
import { cn } from "@/lib/utils";
import { useAuth } from "@/context/AuthContext";
import { useTheme } from "@/context/ThemeContext";
import i18n from "@/i18n";

const GoogleAuthButton = ({ disabled }) => {
  const { t } = useTranslation();
  const { setToken } = useAuth();
  const { resolvedTheme } = useTheme();
  const navigate = useNavigate();

  // Nothing to render when the Google client id is not configured.
  if (!import.meta.env.VITE_GOOGLE_CLIENT_ID) return null;

  const handleSuccess = async (credentialResponse) => {
    try {
      const response = await apiRequest.post("/google-login", {
        credential: credentialResponse.credential,
      });
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
      toast.error(error.response?.data?.message || t("loginPage.googleFailed"));
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-3">
        <span className="h-px flex-1 bg-border" />
        <span className="text-xs uppercase tracking-wide text-muted-foreground">
          {t("common.or")}
        </span>
        <span className="h-px flex-1 bg-border" />
      </div>

      <div
        className={cn(
          "flex justify-center",
          disabled && "pointer-events-none opacity-60",
        )}
      >
        <GoogleLogin
          onSuccess={handleSuccess}
          onError={() => toast.error(t("loginPage.googleFailed"))}
          theme={resolvedTheme === "dark" ? "filled_black" : "outline"}
          shape="pill"
          size="large"
          width="320"
          text="continue_with"
          locale={i18n.language}
        />
      </div>
    </div>
  );
};

export default GoogleAuthButton;
