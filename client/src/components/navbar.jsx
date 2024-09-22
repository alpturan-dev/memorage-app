import { useTranslation } from 'react-i18next'
import { NavLink, useNavigate } from 'react-router-dom'
import { Menu, User, LogOut, Swords, LogIn } from 'lucide-react'
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
import logo from '../../public/logo.png'
import toast from 'react-hot-toast'
import { twJoin } from 'tailwind-merge'

function Navbar() {
    const { t } = useTranslation();
    const navigate = useNavigate();
    const [isOpen, setIsOpen] = useState(false);
    const navItems = [
        { to: "/", name: t('navbar.home') },
        { to: "/collections", name: t('navbar.collections') },
        { to: "/exercises", name: t('navbar.exercises') },
    ];
    const username = JSON.parse(localStorage.getItem('user'))?.username;
    const lang = JSON.parse(localStorage.getItem('user'))?.language || "tr";

    const AccountDropdown = () => {
        return (
            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <Button variant="outline" className="text-base">
                        <User className="mr-2 h-4 w-4" />
                        <span className='w-full'>
                            {username}
                        </span>
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
                    <DropdownMenuItem
                        onClick={() => {
                            localStorage.clear();
                            navigate("/login")
                            toast.success(t('loginPage.loggedOut'));
                            setIsOpen(false);
                        }}
                    >
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
                <div className="w-full flex flex-row justify-between items-center py-2">
                    {/* Logo */}
                    <div className="flex justify-start items-center">
                        <NavLink to="/" className="text-xl font-bold text-primary flex gap-2">
                            <img src={logo} className='w-20 h-20' />
                        </NavLink>
                    </div>
                    {/* Mobile menu button */}
                    <div className="lg:hidden">
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
                                    <NavLink className="flex items-center text-base font-medium text-primary hover:text-primary/80 opacity-70 cursor-not-allowed">
                                        <div className="inline-block mr-1">
                                            <Swords />
                                        </div>
                                        <span className='text-center select-auto'>
                                            {t('comingSoon.wordBattle')}
                                        </span>
                                        <div className='ml-1 mb-3 text-xs font-bold bg-gradient-to-r from-[#016DCC] to-purple-600 bg-clip-text text-transparent rounded-sm px-0.5'>
                                            {t('comingSoon.comingSoon')}
                                        </div>
                                    </NavLink>
                                    {username ? (
                                        <div className="pt-4 mt-4 border-t border-border">
                                            <p className="mb-2 text-sm font-semibold text-primary">
                                                {username}
                                            </p>
                                            <NavLink
                                                to="/profile"
                                                className="flex items-center py-2 text-base font-medium text-primary hover:text-primary/80"
                                                onClick={() => setIsOpen(false)}
                                            >
                                                <User className="mr-2 h-4 w-4" />
                                                {t('navbar.profile')}
                                            </NavLink>
                                            <NavLink
                                                className="flex items-center py-2 text-base font-medium text-primary hover:text-primary/80"
                                                onClick={() => {
                                                    localStorage.clear();
                                                    navigate("/login")
                                                    toast.success(t('loginPage.loggedOut'));
                                                    setIsOpen(false);
                                                }}
                                            >
                                                <LogOut className="mr-2 h-4 w-4" />
                                                {t('navbar.logout')}
                                            </NavLink>
                                        </div>
                                    )
                                        : (
                                            <div className="pt-4 mt-4 border-t border-border">
                                                <NavLink
                                                    to="/login"
                                                    className="flex items-center py-2 text-base font-medium text-primary hover:text-primary/80"
                                                    onClick={() => {
                                                        localStorage.clear();
                                                        setIsOpen(false);
                                                    }}
                                                >
                                                    <LogIn className="mr-2 h-4 w-4" />
                                                    {t('loginPage.login')}
                                                </NavLink>
                                            </div>
                                        )
                                    }
                                </nav>
                            </SheetContent>
                        </Sheet>
                    </div>
                    {/* Desktop menu */}
                    <div className="hidden lg:flex lg:items-center lg:ml-[90px] lg:justify-between">
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
                                <NavigationMenuItem className="relative flex opacity-70 cursor-not-allowed">
                                    <NavigationMenuLink
                                        className={navigationMenuTriggerStyle()}
                                    >
                                        <div className="inline-block mr-1">
                                            <Swords />
                                        </div>
                                        <span className='text-center select-auto'>
                                            {t('comingSoon.wordBattle')}
                                        </span>
                                        <div className={twJoin(
                                            lang === 'en' ? '-right-12 -top-1' : '-right-6 -top-1',
                                            'absolute -top-2 text-[0.6rem] font-bold bg-gradient-to-r from-[#016DCC] to-purple-600 bg-clip-text text-transparent rounded-sm px-0.5')}>
                                            {t('comingSoon.comingSoon')}
                                        </div>
                                    </NavigationMenuLink>
                                </NavigationMenuItem>
                            </NavigationMenuList>
                        </NavigationMenu>
                    </div>
                    {username ? (
                        <div className='hidden lg:block'>
                            <AccountDropdown />
                        </div>
                    ) : (
                        <div className='hidden lg:block lg:self-start'>
                            <Button variant="outline" className="text-base" onClick={() => navigate('/login')}>
                                <LogIn className="mr-2 h-4 w-4" />
                                <span>
                                    {t('loginPage.login')}
                                </span>
                            </Button>
                        </div>
                    )}
                </div>
            </div>
        </header>
    )
}

export default Navbar