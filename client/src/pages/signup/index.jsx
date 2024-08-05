import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { apiRequest } from "@/api/config"

const SignUp = () => {
    const navigate = useNavigate();
    const [credentials, setCredentials] = useState({
        username: "",
        email: "",
        password: ""
    });

    const handleSignUp = async (e) => {
        e.preventDefault();
        try {
            const response = await apiRequest.post('/signup', { ...credentials });
            if (response.status === 201) {
                navigate("/login")
            }
        } catch (error) {
            console.error(error)
        }
    };

    return (
        <div className="flex min-h-[100dvh] flex-col items-center justify-center bg-background px-4 py-12 sm:px-6 lg:px-8">
            <div className="mx-auto max-w-md space-y-4">
                <div className="text-center">
                    <h1 className="text-3xl font-bold tracking-tight text-foreground">Sign up</h1>
                </div>
                <form onSubmit={handleSignUp} className="space-y-4">
                    <div>
                        <Label htmlFor="username">Username</Label>
                        <Input id="username" type="name" placeholder="Name" required
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
                            value={credentials.password}
                            onChange={(e) => setCredentials({
                                ...credentials,
                                password: e.target.value
                            })}
                        />
                    </div>
                    <Button type="submit" className="w-full">
                        Sign up
                    </Button>
                </form>
            </div>
        </div>
    )
}

export default SignUp