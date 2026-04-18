import { useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import toast from "react-hot-toast";
import {
  Edit2,
  Save,
  X,
  User as UserIcon,
  Mail,
  Languages,
  Lock,
  Eye,
  EyeOff,
  ShieldCheck,
  Loader2,
} from "lucide-react";
import { apiRequest } from "@/api/config";
import LanguageSelect from "@/components/languageSelect";
import { useTranslation } from "react-i18next";
import { twJoin } from "tailwind-merge";

const getUserFromStorage = () => {
  const stored = JSON.parse(localStorage.getItem("user")) || {};
  return {
    username: stored.username || "",
    email: stored.email || "",
    language: stored.language || "tr",
  };
};

const newPasswordInitialState = { current: "", new: "", confirm: "" };

const Profile = () => {
  const { i18n, t } = useTranslation();

  const localUser = JSON.parse(localStorage.getItem("user"));
  const initialUser = useMemo(getUserFromStorage, []);
  const [user, setUser] = useState(initialUser);

  const [newPassword, setNewPassword] = useState(newPasswordInitialState);
  const [showPwd, setShowPwd] = useState({
    current: false,
    new: false,
    confirm: false,
  });

  const [editingInfo, setEditingInfo] = useState(false);
  const [editingPassword, setEditingPassword] = useState(false);
  const [savingInfo, setSavingInfo] = useState(false);
  const [savingPassword, setSavingPassword] = useState(false);

  const initial = (user.username || "?").charAt(0).toUpperCase();

  const passwordStrength = useMemo(() => {
    const p = newPassword.new;
    if (!p) return { score: 0, label: "", color: "" };
    let score = 0;
    if (p.length >= 8) score++;
    if (/[A-Z]/.test(p)) score++;
    if (/[0-9]/.test(p)) score++;
    if (/[^A-Za-z0-9]/.test(p)) score++;
    const labels = ["", "Weak", "Fair", "Good", "Strong"];
    const colors = [
      "",
      "bg-red-500",
      "bg-orange-500",
      "bg-yellow-500",
      "bg-green-500",
    ];
    return { score, label: labels[score], color: colors[score] };
  }, [newPassword.new]);

  const confirmMismatch =
    newPassword.confirm.length > 0 && newPassword.new !== newPassword.confirm;

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    try {
      setSavingInfo(true);
      const res = await apiRequest.put("/update-user/" + localUser._id, user);
      if (res?.status === 200) {
        i18n.changeLanguage(res.data.user.language);
        setUser(res.data.user);
        localStorage.setItem("user", JSON.stringify(res.data.user));
        toast.success(t("profilePage.userUpdated"));
      }
    } catch (error) {
      console.error(error);
      toast.error(t("profilePage.userError"));
    } finally {
      setEditingInfo(false);
      setSavingInfo(false);
      setTimeout(() => {
        window.location.reload(false);
      }, 2000);
    }
  };

  const handleChangePassword = async (e) => {
    e.preventDefault();
    if (newPassword.new !== newPassword.confirm) {
      toast.error(t("profilePage.passwordsDoNotMatch"));
      return;
    }
    try {
      setSavingPassword(true);
      const res = await apiRequest.put("/update-password/" + localUser._id, {
        currentPassword: newPassword.current,
        newPassword: newPassword.new,
      });
      if (res?.status === 200) {
        toast.success(t("profilePage.passwordChanged"));
        setNewPassword(newPasswordInitialState);
      }
    } catch (error) {
      console.error(error);
      toast.error(t("profilePage.passwordError"));
    } finally {
      setEditingPassword(false);
      setSavingPassword(false);
      setTimeout(() => {
        window.location.reload(false);
      }, 2000);
    }
  };

  const PasswordInput = ({ id, value, onChange, field, disabled }) => (
    <div className="relative">
      <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
      <Input
        id={id}
        type={showPwd[field] ? "text" : "password"}
        value={value}
        onChange={onChange}
        disabled={disabled}
        className="pl-9 pr-10"
      />
      {!disabled && (
        <button
          type="button"
          onClick={() =>
            setShowPwd((prev) => ({ ...prev, [field]: !prev[field] }))
          }
          className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
          aria-label={showPwd[field] ? "Hide password" : "Show password"}
        >
          {showPwd[field] ? (
            <EyeOff className="h-4 w-4" />
          ) : (
            <Eye className="h-4 w-4" />
          )}
        </button>
      )}
    </div>
  );

  return (
    <main className="flex-1 py-6 animate-fade-in-up">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Profile hero */}
        <Card className="overflow-hidden border-border/60">
          <div className="relative h-24 bg-gradient-to-r from-primary/20 via-accent/40 to-primary/10" />
          <div className="px-6 pb-6 -mt-12 flex flex-col sm:flex-row sm:items-end gap-4">
            <div className="flex h-24 w-24 items-center justify-center rounded-full bg-gradient-to-br from-primary to-primary/70 text-primary-foreground text-3xl font-bold shadow-md ring-4 ring-background shrink-0">
              {initial}
            </div>
            <div className="flex-1 min-w-0 sm:pb-2">
              <h1 className="text-2xl font-bold font-serif truncate">
                {user.username}
              </h1>
              <p className="text-sm text-muted-foreground flex items-center gap-1.5 mt-1">
                <Mail className="h-3.5 w-3.5 shrink-0" />
                <span className="truncate">{user.email}</span>
              </p>
            </div>
          </div>
        </Card>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Personal info */}
          <Card className="border-border/60">
            <CardHeader className="flex flex-row items-start justify-between space-y-0 gap-3">
              <div>
                <CardTitle className="text-lg flex items-center gap-2">
                  <UserIcon className="h-4 w-4 text-primary" />
                  {t("profilePage.title")}
                </CardTitle>
              </div>
              {!editingInfo ? (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setEditingInfo(true)}
                >
                  <Edit2 className="w-3.5 h-3.5 mr-1.5" /> {t("common.edit")}
                </Button>
              ) : (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    setEditingInfo(false);
                    setUser(initialUser);
                  }}
                >
                  <X className="w-3.5 h-3.5 mr-1.5" /> {t("common.cancel")}
                </Button>
              )}
            </CardHeader>
            <CardContent>
              <form onSubmit={handleUpdateProfile} className="space-y-4">
                <div className="space-y-1.5">
                  <Label
                    htmlFor="username"
                    className="text-xs font-medium text-muted-foreground uppercase tracking-wide"
                  >
                    {t("profilePage.username")}
                  </Label>
                  <div className="relative">
                    <UserIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="username"
                      value={user.username}
                      onChange={(e) =>
                        setUser({ ...user, username: e.target.value })
                      }
                      disabled={!editingInfo}
                      className="pl-9"
                    />
                  </div>
                </div>
                <div className="space-y-1.5">
                  <Label
                    htmlFor="email"
                    className="text-xs font-medium text-muted-foreground uppercase tracking-wide"
                  >
                    {t("profilePage.email")}
                  </Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="email"
                      type="email"
                      value={user.email}
                      onChange={(e) =>
                        setUser({ ...user, email: e.target.value })
                      }
                      disabled={!editingInfo}
                      className="pl-9"
                    />
                  </div>
                </div>
                <div className="space-y-1.5">
                  <Label
                    htmlFor="language"
                    className="text-xs font-medium text-muted-foreground uppercase tracking-wide flex items-center gap-1.5"
                  >
                    <Languages className="h-3.5 w-3.5" />
                    {t("profilePage.appLanguage")}
                  </Label>
                  <LanguageSelect
                    language={user.language}
                    handleLanguageChange={(value) =>
                      setUser({ ...user, language: value })
                    }
                    disabled={!editingInfo}
                  />
                </div>
                {editingInfo && (
                  <Button
                    type="submit"
                    disabled={savingInfo}
                    className="w-full sm:w-auto"
                  >
                    {savingInfo ? (
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    ) : (
                      <Save className="w-4 h-4 mr-2" />
                    )}
                    {t("profilePage.saveChanges")}
                  </Button>
                )}
              </form>
            </CardContent>
          </Card>

          {/* Password */}
          <Card className="border-border/60">
            <CardHeader className="flex flex-row items-start justify-between space-y-0 gap-3">
              <div>
                <CardTitle className="text-lg flex items-center gap-2">
                  <ShieldCheck className="h-4 w-4 text-primary" />
                  {t("profilePage.changePassword")}
                </CardTitle>
              </div>
              {!editingPassword ? (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setEditingPassword(true)}
                >
                  <Edit2 className="w-3.5 h-3.5 mr-1.5" /> {t("common.change")}
                </Button>
              ) : (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    setEditingPassword(false);
                    setNewPassword(newPasswordInitialState);
                  }}
                >
                  <X className="w-3.5 h-3.5 mr-1.5" /> {t("common.cancel")}
                </Button>
              )}
            </CardHeader>
            <CardContent>
              <form onSubmit={handleChangePassword} className="space-y-4">
                <div className="space-y-1.5">
                  <Label
                    htmlFor="current-password"
                    className="text-xs font-medium text-muted-foreground uppercase tracking-wide"
                  >
                    {t("profilePage.currentPassword")}
                  </Label>
                  <PasswordInput
                    id="current-password"
                    value={newPassword.current}
                    onChange={(e) =>
                      setNewPassword({
                        ...newPassword,
                        current: e.target.value,
                      })
                    }
                    field="current"
                    disabled={!editingPassword}
                  />
                </div>
                <div className="space-y-1.5">
                  <Label
                    htmlFor="new-password"
                    className="text-xs font-medium text-muted-foreground uppercase tracking-wide"
                  >
                    {t("profilePage.newPassword")}
                  </Label>
                  <PasswordInput
                    id="new-password"
                    value={newPassword.new}
                    onChange={(e) =>
                      setNewPassword({ ...newPassword, new: e.target.value })
                    }
                    field="new"
                    disabled={!editingPassword}
                  />
                  {editingPassword && newPassword.new && (
                    <div className="flex items-center gap-2 pt-1">
                      <div className="flex-1 flex gap-1">
                        {[1, 2, 3, 4].map((i) => (
                          <div
                            key={i}
                            className={twJoin(
                              "h-1 flex-1 rounded-full transition-colors",
                              i <= passwordStrength.score
                                ? passwordStrength.color
                                : "bg-muted",
                            )}
                          />
                        ))}
                      </div>
                      <span className="text-xs text-muted-foreground min-w-[45px] text-right">
                        {passwordStrength.label}
                      </span>
                    </div>
                  )}
                </div>
                <div className="space-y-1.5">
                  <Label
                    htmlFor="confirm-password"
                    className="text-xs font-medium text-muted-foreground uppercase tracking-wide"
                  >
                    {t("profilePage.confirmNewPassword")}
                  </Label>
                  <PasswordInput
                    id="confirm-password"
                    value={newPassword.confirm}
                    onChange={(e) =>
                      setNewPassword({
                        ...newPassword,
                        confirm: e.target.value,
                      })
                    }
                    field="confirm"
                    disabled={!editingPassword}
                  />
                  {confirmMismatch && (
                    <p className="text-xs text-destructive pt-1">
                      {t("profilePage.passwordsDoNotMatch")}
                    </p>
                  )}
                </div>
                {editingPassword && (
                  <Button
                    type="submit"
                    disabled={
                      savingPassword ||
                      confirmMismatch ||
                      !newPassword.current ||
                      !newPassword.new
                    }
                    className="w-full sm:w-auto"
                  >
                    {savingPassword ? (
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    ) : (
                      <Save className="w-4 h-4 mr-2" />
                    )}
                    {t("profilePage.updatePassword")}
                  </Button>
                )}
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </main>
  );
};

export default Profile;
