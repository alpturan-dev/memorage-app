import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { apiRequest } from "@/api/config"
import toast from "react-hot-toast"
import { useTranslation } from "react-i18next"

const SignUp = () => {
    const { t } = useTranslation();
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();
    const [credentials, setCredentials] = useState({
        username: "",
        email: "",
        password: ""
    });

    const handleSignUp = async (e) => {
        e.preventDefault();
        try {
            setLoading(true);
            const response = await apiRequest.post('/signup', { ...credentials });
            if (response.status === 201) {
                navigate("/login")
                toast.success(t("signupPage.signedUp"))
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
                    <h1 className="text-3xl font-bold tracking-tight text-foreground">{t('signupPage.title')}</h1>
                    <p className="mt-2 text-muted-foreground">
                        {t('signupPage.subtitle')}
                        <a href="login" className="font-medium text-primary hover:underline">
                            {t('loginPage.login')}
                        </a>
                    </p>
                </div>
                <form onSubmit={handleSignUp} className="space-y-4">
                    <div>
                        <Label htmlFor="username">
                            {t('signupPage.username')}
                        </Label>
                        <Input
                            id="username"
                            type="name"
                            placeholder={t('signupPage.username')}
                            required
                            disabled={loading}
                            value={credentials.username}
                            onChange={(e) => setCredentials({
                                ...credentials,
                                username: e.target.value
                            })}
                        />
                    </div>
                    <div>
                        <Label htmlFor="email">{t('common.email')}</Label>
                        <Input id="email" type="email" placeholder={t('common.emailExample')} required
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
                        {loading ?
                            t('signupPage.signingUp') :
                            t('signupPage.signup')}
                    </Button>
                </form>
            </div>
        </div>
    )
}

export default SignUp