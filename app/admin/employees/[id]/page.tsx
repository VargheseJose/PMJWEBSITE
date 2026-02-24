"use client"

import { useEffect, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import Link from "next/link"
import { doc, getDoc, updateDoc, collection, query, where, orderBy, getDocs, limit } from "firebase/firestore"
import { db } from "@/lib/firebase"
import { UserProfile } from "@/lib/auth-context"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowLeft, Save, Loader2, Clock, Calendar } from "lucide-react"

interface AttendanceRecord {
    id: string
    date: string
    clockIn?: string
    clockOut?: string
    status: "present" | "absent" | "late" | "half-day"
    hoursWorked?: number
}

const DEPARTMENTS = ["Operations", "Logistics", "Finance", "HR", "Technical", "Sales", "Management"]
function getField(obj: Partial<UserProfile>, key: string): string { return String((obj as Record<string, unknown>)[key] ?? "") }

export default function EmployeeProfilePage() {
    const { id } = useParams() as { id: string }
    const router = useRouter()
    const [profile, setProfile] = useState<UserProfile | null>(null)
    const [attendance, setAttendance] = useState<AttendanceRecord[]>([])
    const [loading, setLoading] = useState(true)
    const [saving, setSaving] = useState(false)
    const [error, setError] = useState("")
    const [editing, setEditing] = useState(false)
    const [form, setForm] = useState<Partial<UserProfile>>({})

    useEffect(() => {
        Promise.all([
            getDoc(doc(db, "users", id)),
            getDocs(query(collection(db, "attendance"), where("employeeId", "==", id), orderBy("date", "desc"), limit(30)))
        ]).then(([snap, attSnap]) => {
            if (snap.exists()) {
                const data = { uid: id, ...snap.data() } as UserProfile
                setProfile(data)
                setForm(data)
            }
            setAttendance(attSnap.docs.map(d => ({ id: d.id, ...d.data() } as AttendanceRecord)))
        }).finally(() => setLoading(false))
    }, [id])

    const handleSave = async () => {
        setSaving(true)
        try {
            await updateDoc(doc(db, "users", id), { ...form })
            setProfile(prev => ({ ...prev!, ...form }))
            setEditing(false)
        } catch (e) {
            setError("Failed to save changes")
        } finally {
            setSaving(false)
        }
    }

    const handleToggleStatus = async () => {
        const newStatus = profile?.status === "active" ? "inactive" : "active"
        await updateDoc(doc(db, "users", id), { status: newStatus })
        setProfile(prev => prev ? { ...prev, status: newStatus } : prev)
    }

    if (loading) return <div className="text-slate-400 py-12 text-center">Loading…</div>
    if (!profile) return <div className="text-slate-400 py-12 text-center">Employee not found.</div>

    const presentDays = attendance.filter(a => a.status === "present" || a.status === "late").length

    return (
        <div className="space-y-6 max-w-5xl">
            <div className="flex items-center gap-4">
                <Link href="/admin/employees">
                    <Button variant="outline" size="sm" className="border-white/10 text-slate-300 hover:text-white gap-2">
                        <ArrowLeft className="h-4 w-4" /> Back
                    </Button>
                </Link>
                <div className="flex-1">
                    <h1 className="text-2xl font-bold text-white">{profile.name}</h1>
                    <div className="flex items-center gap-2 mt-1">
                        <Badge className={profile.role === "admin" ? "bg-purple-500/20 text-purple-300" : profile.role === "manager" ? "bg-blue-500/20 text-blue-300" : "bg-slate-500/20 text-slate-300"}>{profile.role}</Badge>
                        <Badge className={profile.status === "active" ? "bg-green-500/20 text-green-300" : "bg-red-500/20 text-red-300"}>{profile.status}</Badge>
                    </div>
                </div>
                <div className="flex gap-2">
                    <Button variant="outline" size="sm" onClick={handleToggleStatus} className="border-white/10 text-slate-300 hover:text-white">
                        {profile.status === "active" ? "Deactivate" : "Activate"}
                    </Button>
                    {editing ? (
                        <Button size="sm" onClick={handleSave} disabled={saving} className="gap-2">
                            {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />} Save
                        </Button>
                    ) : (
                        <Button size="sm" onClick={() => setEditing(true)}>Edit Profile</Button>
                    )}
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Profile Card */}
                <div className="lg:col-span-2">
                    <Card className="bg-slate-800/30 border-white/10">
                        <CardHeader><CardTitle className="text-white text-base">Personal Information</CardTitle></CardHeader>
                        <CardContent className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            {[
                                { label: "Full Name", key: "name", type: "text" },
                                { label: "Email", key: "email", type: "email" },
                                { label: "Phone", key: "phone", type: "tel" },
                                { label: "Join Date", key: "joinDate", type: "date" },
                                { label: "Monthly Salary (₹)", key: "salary", type: "number" },
                            ].map(field => (
                                <div key={field.key} className="space-y-1.5">
                                    <Label className="text-slate-400 text-xs uppercase tracking-wide">{field.label}</Label>
                                    {editing ? (
                                        <Input
                                            type={field.type}
                                            value={getField(form, field.key)}
                                            onChange={e => setForm(p => ({ ...p, [field.key]: e.target.value }))}
                                            className="bg-slate-800 border-white/10 text-white"
                                        />
                                    ) : (
                                        <p className="text-white">{getField(profile, field.key) || "—"}</p>
                                    )}
                                </div>
                            ))}
                            <div className="space-y-1.5">
                                <Label className="text-slate-400 text-xs uppercase tracking-wide">Department</Label>
                                {editing ? (
                                    <select value={form.department ?? ""} onChange={e => setForm(p => ({ ...p, department: e.target.value }))} className="flex h-10 w-full rounded-md border border-white/10 bg-slate-800 px-3 py-2 text-sm text-white">
                                        <option value="">Select…</option>
                                        {DEPARTMENTS.map(d => <option key={d} value={d}>{d}</option>)}
                                    </select>
                                ) : (
                                    <p className="text-white">{profile.department ?? "—"}</p>
                                )}
                            </div>
                            <div className="space-y-1.5">
                                <Label className="text-slate-400 text-xs uppercase tracking-wide">Role</Label>
                                {editing ? (
                                    <select value={form.role ?? "employee"} onChange={e => setForm(p => ({ ...p, role: e.target.value as UserProfile["role"] }))} className="flex h-10 w-full rounded-md border border-white/10 bg-slate-800 px-3 py-2 text-sm text-white">
                                        <option value="employee">Employee</option>
                                        <option value="manager">Manager</option>
                                        <option value="admin">Admin</option>
                                    </select>
                                ) : (
                                    <p className="text-white capitalize">{profile.role}</p>
                                )}
                            </div>
                            {error && <p className="col-span-2 text-sm text-red-400">{error}</p>}
                        </CardContent>
                    </Card>
                </div>

                {/* Stats */}
                <div className="space-y-4">
                    <Card className="bg-slate-800/30 border-white/10">
                        <CardContent className="p-4 space-y-4">
                            <div className="flex items-center gap-3">
                                <div className="p-2 rounded-lg bg-green-500/20 text-green-400"><Calendar className="h-5 w-5" /></div>
                                <div>
                                    <p className="text-xs text-slate-400">Present Days (Last 30)</p>
                                    <p className="text-2xl font-bold text-white">{presentDays}</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-3">
                                <div className="p-2 rounded-lg bg-blue-500/20 text-blue-400"><Clock className="h-5 w-5" /></div>
                                <div>
                                    <p className="text-xs text-slate-400">Attendance Rate</p>
                                    <p className="text-2xl font-bold text-white">{attendance.length ? Math.round((presentDays / attendance.length) * 100) : 0}%</p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                    <Link href={`/admin/attendance?employee=${id}`}>
                        <Button variant="outline" className="w-full border-white/10 text-slate-300 hover:text-white gap-2">
                            <Clock className="h-4 w-4" /> View Full Attendance
                        </Button>
                    </Link>
                    <Link href={`/admin/leaves?employee=${id}`}>
                        <Button variant="outline" className="w-full border-white/10 text-slate-300 hover:text-white gap-2">
                            <Calendar className="h-4 w-4" /> View Leave History
                        </Button>
                    </Link>
                </div>
            </div>

            {/* Recent Attendance */}
            <Card className="bg-slate-800/30 border-white/10">
                <CardHeader><CardTitle className="text-white text-base">Recent Attendance (Last 30 Records)</CardTitle></CardHeader>
                <div className="overflow-x-auto">
                    {attendance.length === 0 ? (
                        <p className="text-slate-400 p-4 text-center">No attendance records yet.</p>
                    ) : (
                        <table className="w-full text-sm">
                            <thead>
                                <tr className="border-b border-white/5 text-slate-400 text-xs uppercase">
                                    <th className="text-left p-4">Date</th>
                                    <th className="text-left p-4">Clock In</th>
                                    <th className="text-left p-4">Clock Out</th>
                                    <th className="text-left p-4">Status</th>
                                    <th className="text-left p-4">Hours</th>
                                </tr>
                            </thead>
                            <tbody>
                                {attendance.map(a => (
                                    <tr key={a.id} className="border-b border-white/5 hover:bg-white/5">
                                        <td className="p-4 text-white">{a.date}</td>
                                        <td className="p-4 text-slate-300">{a.clockIn ?? "—"}</td>
                                        <td className="p-4 text-slate-300">{a.clockOut ?? "—"}</td>
                                        <td className="p-4">
                                            <Badge className={
                                                a.status === "present" ? "bg-green-500/20 text-green-300" :
                                                    a.status === "late" ? "bg-yellow-500/20 text-yellow-300" :
                                                        a.status === "half-day" ? "bg-orange-500/20 text-orange-300" :
                                                            "bg-red-500/20 text-red-300"
                                            }>{a.status}</Badge>
                                        </td>
                                        <td className="p-4 text-slate-300">{a.hoursWorked != null ? `${a.hoursWorked}h` : "—"}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    )}
                </div>
            </Card>
        </div>
    )
}
