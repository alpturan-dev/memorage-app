import { useTranslation } from 'react-i18next'
import { NavLink } from 'react-router-dom'
import LanguageSelect from './languageSelect';

function Navbar() {
    const { t } = useTranslation();
    return (
        <div className='bg-gray-100 mx-auto flex-col sm:flex-row items-center justify-center gap-4 sm:gap-0 py-4 px-4 '>
            <nav className='flex justify-center gap-3 underline underline-offset-2'>
                <NavLink to="/">{t('navbar.dashboard')}</NavLink>
                <NavLink to="/collections">{t('navbar.collections')}</NavLink>
                <NavLink to="/exercises">{t('navbar.exercises')}</NavLink>
            </nav>
            <div className='mx-auto flex justify-center items-center pt-4 right-0 sm:absolute sm:rigth-4 sm:pt-0'>
                <LanguageSelect />
            </div>
        </div>
    )
}

export default Navbar