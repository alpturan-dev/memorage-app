import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { apiRequest } from "@/api/config"
import toast from "react-hot-toast"

const SignUp = () => {
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
                toast.success("Signed up successfully!")
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
                    <h1 className="text-3xl font-bold tracking-tight text-foreground">Sign up</h1>
                    <p className="mt-2 text-muted-foreground">
                        You already have an account?{" "}
                        <a href="login" className="font-medium text-primary hover:underline">
                            Login
                        </a>
                    </p>
                </div>
                <form onSubmit={handleSignUp} className="space-y-4">
                    <div>
                        <Label htmlFor="username">Username</Label>
                        <Input id="username" type="name" placeholder="Name" required
                            disabled={loading}
                            value={credentials.username}
                            onChange={(e) => setCredentials({
                                ...credentials,
                                username: e.target.value
                            })}
                        />
                    </div>
                    <div>
                        <Label htmlFor="email">Email</Label>
                        <Input id="email" type="email" placeholder="name@example.com" required
                            disabled={loading}
                            value={credentials.email}
                            onChange={(e) => setCredentials({
                                ...credentials,
                                email: e.target.value
                            })}
                        />
                    </div>
                    <div>
                        <Label htmlFor="password">Password</Label>
                        <Input id="password" type="password" placeholder="Password" required
                            disabled={loading}
                            value={credentials.password}
                            onChange={(e) => setCredentials({
                                ...credentials,
                                password: e.target.value
                            })}
                        />
                    </div>
                    <Button type="submit" className="w-full" disabled={loading}>
                        {loading ? 'Signing up...' : 'Sign up'}
                    </Button>
                </form>
            </div>
        </div>
    )
}

export default SignUp