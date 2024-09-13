import { Link } from 'react-router-dom'
import { Book, Brain, Folder, Plus } from 'lucide-react'
import { useRef } from 'react';
import { useTranslation } from 'react-i18next';

const Dashboard = () => {
    const { t } = useTranslation();
    const targetRef = useRef(null);

    const handleScroll = () => {
        if (targetRef.current) {
            targetRef.current.scrollIntoView({ behavior: 'smooth' });
        }
    };

    const scrollToTop = () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    };

    return (
        <div className="min-h-screen py-12 px-4 sm:px-6 lg:px-8">
            <main className="max-w-7xl mx-auto">
                <section className="text-center mb-16">
                    <div className="flex items-center justify-center mb-6">
                        <Brain className="h-12 w-12 text-[#016DCC]" />
                        <h1 className="ml-3 text-4xl font-bold text-gray-900">{t('dashboardPage.title')}</h1>
                    </div>
                    <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
                        {t('dashboardPage.description')}
                    </p>
                    <div className="space-x-4 space-y-2">
                        <Link
                            to="/collections"
                            onClick={scrollToTop}
                            className="inline-block px-6 py-3 text-lg font-semibold text-white bg-gray-800 rounded-lg hover:bg-gray-700 transition duration-300"
                        >
                            {t('dashboardPage.getStarted')}
                        </Link>
                        <Link
                            onClick={handleScroll}
                            className="inline-block px-6 py-3 text-lg font-semibold text-gray-800 bg-white border-2 border-gray-800 rounded-lg hover:bg-gray-100 transition duration-300"
                        >
                            {t('dashboardPage.learnMore')}
                        </Link>
                    </div>
                </section>

                <section className="mb-16" ref={targetRef}>
                    <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
                        {[
                            { icon: Folder, title: t('dashboardPage.feature1.title'), description: t('dashboardPage.feature1.description') },
                            { icon: Plus, title: t('dashboardPage.feature2.title'), description: t('dashboardPage.feature2.description') },
                            { icon: Book, title: t('dashboardPage.feature3.title'), description: t('dashboardPage.feature3.description') },
                        ].map((feature, index) => (
                            <div key={index} className="bg-white rounded-xl shadow-md hover:shadow-xl transition-shadow duration-300 overflow-hidden">
                                <div className="p-8">
                                    <div className='flex items-center justify-start gap-4'>
                                        <feature.icon className="h-12 w-12 text-gray-800 mb-4" />
                                        <h3 className="text-xl font-semibold text-gray-900 mb-4">{feature.title}</h3>
                                    </div>
                                    <p className="text-gray-600">{feature.description}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </section>

                <section className="text-center">
                    <h2 className="text-3xl font-bold text-gray-900 mb-4">{t('dashboardPage.callToActionTitle')}</h2>
                    <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
                        {t('dashboardPage.callToActionDescription')}
                    </p>
                    <div className="space-x-4 space-y-2">
                        <Link
                            to="/collections"
                            onClick={scrollToTop}
                            className="inline-block px-6 py-3 text-lg font-semibold text-white bg-gray-800 rounded-lg hover:bg-gray-700 transition duration-300"
                        >
                            {t('dashboardPage.createCollection')}
                        </Link>
                        <Link
                            to="/exercises"
                            onClick={scrollToTop}
                            className="inline-block px-6 py-3 text-lg font-semibold text-gray-800 bg-gray-200 rounded-lg hover:bg-gray-300 transition duration-300"
                        >
                            {t('dashboardPage.practiceNow')}
                        </Link>
                    </div>
                </section>
            </main>
        </div>
    )
}

export default Dashboard