import { useTranslation } from 'react-i18next'
import { NavLink } from 'react-router-dom'
import { Menu, User, LogOut } from 'lucide-react'
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import {
    NavigationMenu,
    NavigationMenuItem,
    NavigationMenuLink,
    NavigationMenuList,
    navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { useState } from 'react'

function Navbar() {
    const { t } = useTranslation();
    const [isOpen, setIsOpen] = useState(false);
    const navItems = [
        { to: "/", name: t('navbar.home') },
        { to: "/collections", name: t('navbar.collections') },
        { to: "/exercises", name: t('navbar.exercises') },
    ];

    const AccountDropdown = () => {
        return (
            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <Button variant="outline" className="ml-4 text-base">
                        <User className="mr-2 h-4 w-4" />
                        {t('navbar.account')}
                    </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                    <DropdownMenuLabel>
                        {t('navbar.myAccount')}
                    </DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <NavLink to='/profile'>
                        <DropdownMenuItem>
                            <User className="mr-2 h-4 w-4" />
                            <span>{t('navbar.profile')}</span>
                        </DropdownMenuItem>
                    </NavLink>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem>
                        <LogOut className="mr-2 h-4 w-4" />
                        <span>{t('navbar.logout')}</span>
                    </DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>
        )
    }

    return (
        <header className="bg-background shadow-sm">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="w-full flex flex-row justify-between items-center py-4">
                    {/* Logo */}
                    <div className="flex justify-start">
                        <a href="/" className="text-xl font-bold text-primary">
                            Logo
                        </a>
                    </div>
                    {/* Mobile menu button */}
                    <div className="md:hidden">
                        <Sheet open={isOpen} onOpenChange={setIsOpen}>
                            <SheetTrigger asChild>
                                <Button variant="ghost" size="icon" className="text-primary">
                                    <Menu className="h-6 w-6" />
                                    <span className="sr-only">Open menu</span>
                                </Button>
                            </SheetTrigger>
                            <SheetContent side="right" className="w-[300px] sm:w-[400px]">
                                <nav className="flex flex-col gap-4 pt-10">
                                    {navItems.map((item) => (
                                        <NavLink className="text-base font-medium text-primary hover:text-primary/80 cursor-pointer" to={item.to} key={item.name} onClick={() => setIsOpen(false)}
                                        >{item.name}</NavLink>
                                    ))}
                                    <div className="pt-4 mt-4 border-t border-border">
                                        <p className="mb-2 text-sm font-semibold text-primary">{t('navbar.account')}</p>
                                        <NavLink
                                            to="/profile"
                                            className="flex items-center py-2 text-base font-medium text-primary hover:text-primary/80"
                                            onClick={() => setIsOpen(false)}
                                        >
                                            <User className="mr-2 h-4 w-4" />
                                            {t('navbar.profile')}
                                        </NavLink>
                                        <NavLink
                                            to="/logout"
                                            className="flex items-center py-2 text-base font-medium text-primary hover:text-primary/80"
                                            onClick={() => setIsOpen(false)}
                                        >
                                            <LogOut className="mr-2 h-4 w-4" />
                                            {t('navbar.logout')}
                                        </NavLink>
                                    </div>
                                </nav>
                            </SheetContent>
                        </Sheet>
                    </div>
                    {/* Desktop menu */}
                    <div className="hidden md:flex md:items-center md:ml-[90px] md:justify-between">
                        <NavigationMenu>
                            <NavigationMenuList>
                                {navItems.map((item) => (
                                    <NavigationMenuItem key={item.name}>
                                        <NavigationMenuLink
                                            href={item.to}
                                            className={navigationMenuTriggerStyle()}
                                        >
                                            {item.name}
                                        </NavigationMenuLink>
                                    </NavigationMenuItem>
                                ))}
                            </NavigationMenuList>
                        </NavigationMenu>
                    </div>
                    <div className='hidden md:block md:w-[120px]'>
                        <AccountDropdown />
                    </div>
                </div>
            </div>
        </header>
    )
}

export default Navbar