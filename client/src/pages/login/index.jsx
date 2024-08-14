import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { apiRequest } from "@/api/config"
import { useAuth } from "@/context/AuthContext"
import toast from "react-hot-toast"
import { useTranslation } from "react-i18next"

const Login = () => {
    const { t } = useTranslation();
    const [loading, setLoading] = useState(false);
    const { setToken } = useAuth();
    const navigate = useNavigate();
    const [credentials, setCredentials] = useState({
        email: "",
        password: ""
    });

    const handleLogin = async (e) => {
        e.preventDefault();
        try {
            setLoading(true);
            if (credentials.email === null, credentials.password === null) {
                toast.error(t('loginPage.credentialsRequired'))
            }
            const response = await apiRequest.post('/login', { ...credentials });
            if (response.status === 201) {
                localStorage.setItem('user', JSON.stringify(response.data.user));
                localStorage.setItem('token', response.data.token);
                setToken(response.data.token);
                navigate("/")
                toast.success(t('loginPage.loggedIn'));
            }
        } catch (error) {
            console.error(error)
            toast.error(error.response.data.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex min-h-[100dvh] flex-col items-center justify-center bg-background px-4 py-12 sm:px-6 lg:px-8">
            <div className="mx-auto max-w-md space-y-4">
                <div className="text-center">
                    <h1 className="text-3xl font-bold tracking-tight text-foreground">
                        {t('loginPage.title')}
                    </h1>
                    <p className="mt-2 text-muted-foreground">
                        {t('loginPage.subtitle')}
                        <a href="signup" className="font-medium text-primary hover:underline">
                            {t('signupPage.signup')}
                        </a>
                    </p>
                </div>
                <form onSubmit={handleLogin} className="space-y-4">
                    <div>
                        <Label htmlFor="email">{t('common.email')}</Label>
                        <Input id="email" type="email"
                            placeholder={t('common.emailExample')} required
                            disabled={loading}
                            value={credentials.email}
                            onChange={(e) => setCredentials({
                                ...credentials,
                                email: e.target.value
                            })}
                        />
                    </div>
                    <div>
                        <Label htmlFor="password">{t('common.password')}</Label>
                        <Input id="password" type="password" placeholder={t('common.password')} required
                            disabled={loading}
                            value={credentials.password}
                            onChange={(e) => setCredentials({
                                ...credentials,
                                password: e.target.value
                            })}
                        />
                    </div>
                    <Button type="submit" className="w-full" disabled={loading}>
                        {loading ? t('loginPage.loggingIn') : t('loginPage.login')}
                    </Button>
                </form>
            </div>
        </div>
    )
}

export default Login