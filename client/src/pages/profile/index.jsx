import { useState } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import toast from 'react-hot-toast'
import { Edit2, Save, X } from 'lucide-react'
import { apiRequest } from '@/api/config'

const Profile = () => {
    const localUser = JSON.parse(localStorage.getItem('user'));
    const [user, setUser] = useState({
        username: JSON.parse(localStorage.getItem('user')).username,
        email: JSON.parse(localStorage.getItem('user')).email
    })

    const [newPassword, setNewPassword] = useState({
        current: '',
        new: '',
        confirm: ''
    })

    const [editingInfo, setEditingInfo] = useState(false)
    const [editingPassword, setEditingPassword] = useState(false)

    const handleUpdateProfile = async (e) => {
        e.preventDefault()
        try {
            const res = await apiRequest.put('/update-user/' + localUser._id, user);
            console.log("res", res)
            if (res?.status === 200) {
                setUser(res.data.user);
                localStorage.setItem('user', JSON.stringify(res.data.user));
                toast.success('Bilgilerin guncellendi')
            }
        } catch (error) {
            toast.success(error.message)
            console.error(error)
        } finally {
            setEditingInfo(false)
        }
    }

    const handleChangePassword = (e) => {
        e.preventDefault()
        if (newPassword.new !== newPassword.confirm) {
            toast({
                title: "Error",
                description: "New passwords do not match.",
                variant: "destructive"
            })
            return
        }
        // Here you would typically send this data to your backend
        toast({
            title: "Password Changed",
            description: "Your password has been changed successfully."
        })
        setNewPassword({ current: '', new: '', confirm: '' })
        setEditingPassword(false)
    }

    return (
        <div className="flex flex-col min-h-screen bg-muted/40">
            <main className="flex-1 py-2">
                <h1 className="py-4 flex items-center gap-2 text-2xl font-semibold">Profile Settings</h1>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                    <section className=' py-2 px-4 border border-slate-200 rounded-md'>
                        <div className="flex justify-between items-center mb-4">
                            <h2 className="text-lg font-semibold">Personal Information</h2>
                            {!editingInfo ? (
                                <Button variant="outline" size="sm" onClick={() => setEditingInfo(true)}>
                                    <Edit2 className="w-4 h-4 mr-2" /> Edit
                                </Button>
                            ) : (
                                <Button variant="outline" size="sm" onClick={() => setEditingInfo(false)}>
                                    <X className="w-4 h-4 mr-2" /> Cancel
                                </Button>
                            )}
                        </div>
                        <form onSubmit={handleUpdateProfile} className="space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="username">Username</Label>
                                <Input
                                    id="username"
                                    value={user.username}
                                    onChange={(e) => setUser({ ...user, username: e.target.value })}
                                    disabled={!editingInfo}
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="email">Email</Label>
                                <Input
                                    id="email"
                                    type="email"
                                    value={user.email}
                                    onChange={(e) => setUser({ ...user, email: e.target.value })}
                                    disabled={!editingInfo}
                                />
                            </div>
                            {editingInfo && (
                                <Button type="submit">
                                    <Save className="w-4 h-4 mr-2" /> Save Changes
                                </Button>
                            )}
                        </form>
                    </section>
                    <section className='py-2 px-4 border border-slate-200 rounded-md'>
                        <div className="flex justify-between items-center mb-4">
                            <h2 className="text-lg font-semibold">Change Password</h2>
                            {!editingPassword ? (
                                <Button variant="outline" size="sm" onClick={() => setEditingPassword(true)}>
                                    <Edit2 className="w-4 h-4 mr-2" /> Change
                                </Button>
                            ) : (
                                <Button variant="outline" size="sm" onClick={() => setEditingPassword(false)}>
                                    <X className="w-4 h-4 mr-2" /> Cancel
                                </Button>
                            )}
                        </div>
                        <form onSubmit={handleChangePassword} className="space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="current-password">Current Password</Label>
                                <Input
                                    id="current-password"
                                    type="password"
                                    value={newPassword.current}
                                    onChange={(e) => setNewPassword({ ...newPassword, current: e.target.value })}
                                    disabled={!editingPassword}
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="new-password">New Password</Label>
                                <Input
                                    id="new-password"
                                    type="password"
                                    value={newPassword.new}
                                    onChange={(e) => setNewPassword({ ...newPassword, new: e.target.value })}
                                    disabled={!editingPassword}
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="confirm-password">Confirm New Password</Label>
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
                                    <Save className="w-4 h-4 mr-2" /> Update Password
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