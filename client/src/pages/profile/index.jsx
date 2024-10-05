import { useState } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import toast from 'react-hot-toast'
import { Edit2, Save, X } from 'lucide-react'
import { apiRequest } from '@/api/config'
import LanguageSelect from '@/components/languageSelect'
import { useTranslation } from 'react-i18next'

const userInitialState = {
    username: JSON.parse(localStorage.getItem('user'))?.username,
    email: JSON.parse(localStorage.getItem('user'))?.email,
    language: JSON.parse(localStorage.getItem('user'))?.language || 'tr'
}

const newPasswordInitialState = { current: '', new: '', confirm: '' }

const Profile = () => {
    const { i18n, t } = useTranslation();

    const localUser = JSON.parse(localStorage.getItem('user'));
    const [user, setUser] = useState(userInitialState)

    const [newPassword, setNewPassword] = useState(newPasswordInitialState)

    const [editingInfo, setEditingInfo] = useState(false)
    const [editingPassword, setEditingPassword] = useState(false)

    const handleUpdateProfile = async (e) => {
        e.preventDefault()
        try {
            const res = await apiRequest.put('/update-user/' + localUser._id, user);
            if (res?.status === 200) {
                i18n.changeLanguage(res.data.user.language);
                setUser(res.data.user);
                localStorage.setItem('user', JSON.stringify(res.data.user));
                toast.success(t('profilePage.userUpdated'))
            }
        } catch (error) {
            console.error(error)
            toast.error(t('profilePage.userError'));
        } finally {
            setEditingInfo(false);
            setTimeout(() => {
                window.location.reload(false);
            }, 2000)
        }
    }

    const handleChangePassword = async (e) => {
        e.preventDefault()
        if (newPassword.new !== newPassword.confirm) {
            toast.error(t('profilePage.passwordsDoNotMatch'))
            return
        }
        try {
            const res = await apiRequest.put('/update-password/' + localUser._id, {
                currentPassword: newPassword.current,
                newPassword: newPassword.new,
            });
            if (res?.status === 200) {
                toast.success(t('profilePage.passwordChanged'));
                setNewPassword(newPasswordInitialState)
            }
        } catch (error) {
            console.error(error)
            toast.error(t('profilePage.passwordError'));
        } finally {
            setEditingPassword(false)
            setTimeout(() => {
                window.location.reload(false);
            }, 2000)
        }
    }

    return (
        <div className="flex flex-col min-h-screen bg-muted/40">
            <main className="flex-1 py-2">
                <h1 className="py-4 flex items-center gap-2 text-2xl font-semibold"></h1>
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                    <section className='lg:col-span-5 py-2 px-4'>
                        <div className="flex justify-between items-center mb-4">
                            <h2 className="text-lg font-semibold">{t('profilePage.title')}</h2>
                            {!editingInfo ? (
                                <Button variant="outline" size="sm" onClick={() => setEditingInfo(true)}>
                                    <Edit2 className="w-4 h-4 mr-2" /> {t('common.edit')}
                                </Button>
                            ) : (
                                <Button variant="outline" size="sm" onClick={() => {
                                    setEditingInfo(false);
                                    setUser(userInitialState);
                                }}>
                                    <X className="w-4 h-4 mr-2" /> {t('common.cancel')}
                                </Button>
                            )}
                        </div>
                        <form onSubmit={handleUpdateProfile} className="space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="username">{t('profilePage.username')}</Label>
                                <Input
                                    id="username"
                                    value={user.username}
                                    onChange={(e) => setUser({ ...user, username: e.target.value })}
                                    disabled={!editingInfo}
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="email">{t('profilePage.email')}</Label>
                                <Input
                                    id="email"
                                    type="email"
                                    value={user.email}
                                    onChange={(e) => setUser({ ...user, email: e.target.value })}
                                    disabled={!editingInfo}
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="language">{t('profilePage.appLanguage')}</Label>
                                <LanguageSelect
                                    language={user.language}
                                    handleLanguageChange={(value) => setUser({ ...user, language: value })}
                                    disabled={!editingInfo}
                                />
                            </div>
                            {editingInfo && (
                                <Button type="submit">
                                    <Save className="w-4 h-4 mr-2" /> {t('profilePage.saveChanges')}
                                </Button>
                            )}
                        </form>
                    </section>
                    <div className={`lg:col-span-2 mx-auto bg-gray-300 lg:h-full lg:w-px h-px w-full lg:inline-block`}></div>
                    <section className='lg:col-span-5 py-2 px-4'>
                        <div className="flex justify-between items-center mb-4">
                            <h2 className="text-lg font-semibold">{t('profilePage.changePassword')}</h2>
                            {!editingPassword ? (
                                <Button variant="outline" size="sm" onClick={() => setEditingPassword(true)}>
                                    <Edit2 className="w-4 h-4 mr-2" /> {t('common.change')}
                                </Button>
                            ) : (
                                <Button variant="outline" size="sm" onClick={() => {
                                    setEditingPassword(false);
                                    setNewPassword(newPasswordInitialState);
                                }}>
                                    <X className="w-4 h-4 mr-2" /> {t('common.cancel')}
                                </Button>
                            )}
                        </div>
                        <form onSubmit={handleChangePassword} className="space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="current-password">{t('profilePage.currentPassword')}</Label>
                                <Input
                                    id="current-password"
                                    type="password"
                                    value={newPassword.current}
                                    onChange={(e) => setNewPassword({ ...newPassword, current: e.target.value })}
                                    disabled={!editingPassword}
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="new-password">{t('profilePage.newPassword')}</Label>
                                <Input
                                    id="new-password"
                                    type="password"
                                    value={newPassword.new}
                                    onChange={(e) => setNewPassword({ ...newPassword, new: e.target.value })}
                                    disabled={!editingPassword}
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="confirm-password">{t('profilePage.confirmNewPassword')}</Label>
                                <Input
                                    id="confirm-password"
                                    type="password"
                                    value={newPassword.confirm}
                                    onChange={(e) => setNewPassword({ ...newPassword, confirm: e.target.value })}
                                    disabled={!editingPassword}
                                />
                            </div>
                            {editingPassword && (
                                <Button type="submit">
                                    <Save className="w-4 h-4 mr-2" /> {t('profilePage.updatePassword')}
                                </Button>
                            )}
                        </form>
                    </section>
                </div>
            </main>
        </div>
    )
}

export default Profile