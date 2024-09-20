import { Twitter, Github } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"

const Footer = () => {
    return (
        <footer className="bg-background text-foreground py-0 md:py-6">
            <Separator className="my-6" />
            <div className="container mx-auto px-4">
                <div className="flex flex-col items-center ">
                    <p className="text-center text-sm text-muted-foreground">
                        Made by <a href="https://www.linkedin.com/in/abdurrahman-alpturan-798b94202/" className='underline underline-offset-1'>alpturan-dev</a> and enesturan
                    </p>
                    <div className="flex space-x-2 py-4 md:py-0">
                        <a href="https://x.com/alpturandev">
                            <Button variant="ghost" size="icon">
                                <Twitter className="h-4 w-4" />
                                <span className="sr-only">Twitter</span>
                            </Button>
                        </a>
                        <a href="https://github.com/alpturan-dev">
                            <Button variant="ghost" size="icon">
                                <Github className="h-4 w-4" />
                                <span className="sr-only">GitHub</span>
                            </Button>
                        </a>
                    </div>
                </div>
            </div>
        </footer>
    )
}

export default Footer