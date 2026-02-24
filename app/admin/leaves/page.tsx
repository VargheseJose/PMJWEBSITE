"use client"

import { useEffect, useState } from "react"
import { collection, getDocs, addDoc, query, where, orderBy, doc, updateDoc } from "firebase/firestore"
import { db } from "@/lib/firebase"
import { useAuth } from "@/lib/auth-context"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Plus, Loader2 } from "lucide-react"

interface Leave {
    id: string
    employeeId: string
    employeeName: string
    type: string
    fromDate: string
    toDate: string
    reason: string
    status: "pending" | "approved" | "rejected"
    appliedAt: string
    days: number
}

export default function LeavesPage() {
    const { user, profile } = useAuth()
    const [leaves, setLeaves] = useState<Leave[]>([])
    const [loading, setLoading] = useState(true)
    const [applying, setApplying] = useState(false)
    const [showForm, setShowForm] = useState(false)
    const [form, setForm] = useState({ type: "casual", fromDate: "", toDate: "", reason: "" })
    const isAdmin = profile?.role === "admin" || profile?.role === "manager"

    useEffect(() => {
        if (!user) return
        const q = isAdmin
            ? query(collection(db, "leaves"), orderBy("appliedAt", "desc"))
            : query(collection(db, "leaves"), where("employeeId", "==", user.uid), orderBy("appliedAt", "desc"))
        getDocs(q).then(snap => setLeaves(snap.docs.map(d => ({ id: d.id, ...d.data() } as Leave)))).finally(() => setLoading(false))
    }, [user, isAdmin])

    const handleApply = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!user || !profile) return
        setApplying(true)
        const from = new Date(form.fromDate)
        const to = new Date(form.toDate)
        const days = Math.ceil((to.getTime() - from.getTime()) / (1000 * 60 * 60 * 24)) + 1
        const data: Omit<Leave, "id"> = {
            employeeId: user.uid, employeeName: profile.name,
            type: form.type, fromDate: form.fromDate, toDate: form.toDate,
            reason: form.reason, status: "pending", appliedAt: new Date().toISOString(), days,
        }
        const ref = await addDoc(collection(db, "leaves"), data)
        setLeaves(prev => [{ id: ref.id, ...data }, ...prev])
        setShowForm(false)
        setForm({ type: "casual", fromDate: "", toDate: "", reason: "" })
        setApplying(false)
    }

    const handleAction = async (id: string, status: "approved" | "rejected") => {
        await updateDoc(doc(db, "leaves", id), { status })
        setLeaves(prev => prev.map(l => l.id === id ? { ...l, status } : l))
    }

    const statusColors: Record<string, string> = {
        pending: "bg-yellow-500/20 text-yellow-300",
        approved: "bg-green-500/20 text-green-300",
        rejected: "bg-red-500/20 text-red-300",
    }

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-white">Leave Management</h1>
                    <p className="text-slate-400 text-sm">{isAdmin ? "Review and manage leave requests" : "Apply and track your leaves"}</p>
                </div>
                <Button onClick={() => setShowForm(!showForm)} className="gap-2">
                    <Plus className="h-4 w-4" /> Apply for Leave
                </Button>
            </div>

            {/* Apply Form */}
            {showForm && (
                <Card className="bg-slate-800/30 border-white/10">
                    <CardHeader><CardTitle className="text-white text-base">New Leave Request</CardTitle></CardHeader>
                    <CardContent>
                        <form onSubmit={handleApply} className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div className="space-y-1.5">
                                <Label className="text-slate-300">Leave Type</Label>
                                <select value={form.type} onChange={e => setForm(p => ({ ...p, type: e.target.value }))} className="flex h-10 w-full rounded-md border border-white/10 bg-slate-800 px-3 py-2 text-sm text-white">
                                    {["casual", "sick", "annual", "unpaid", "other"].map(t => <option key={t} value={t}>{t.charAt(0).toUpperCase() + t.slice(1)}</option>)}
                                </select>
                            </div>
                            <div className="space-y-1.5 sm:col-span-1">
                                <Label className="text-slate-300">From Date *</Label>
                                <Input type="date" required value={form.fromDate} onChange={e => setForm(p => ({ ...p, fromDate: e.target.value }))} className="bg-slate-800 border-white/10 text-white" />
                            </div>
                            <div className="space-y-1.5">
                                <Label className="text-slate-300">To Date *</Label>
                                <Input type="date" required value={form.toDate} min={form.fromDate} onChange={e => setForm(p => ({ ...p, toDate: e.target.value }))} className="bg-slate-800 border-white/10 text-white" />
                            </div>
                            <div className="space-y-1.5 sm:col-span-2">
                                <Label className="text-slate-300">Reason *</Label>
                                <Input required value={form.reason} onChange={e => setForm(p => ({ ...p, reason: e.target.value }))} placeholder="Brief reason for leave" className="bg-slate-800 border-white/10 text-white placeholder:text-slate-500" />
                            </div>
                            <div className="sm:col-span-2 flex gap-3">
                                <Button type="submit" disabled={applying} className="flex-1">
                                    {applying ? <><Loader2 className="h-4 w-4 mr-2 animate-spin" />Submitting…</> : "Submit Request"}
                                </Button>
                                <Button type="button" variant="outline" onClick={() => setShowForm(false)} className="border-white/10 text-slate-300">Cancel</Button>
                            </div>
                        </form>
                    </CardContent>
                </Card>
            )}

            {/* Leave List */}
            <Card className="bg-slate-800/30 border-white/10">
                <div className="overflow-x-auto">
                    {loading ? <p className="p-6 text-center text-slate-400">Loading…</p> : leaves.length === 0 ? (
                        <p className="p-6 text-center text-slate-400">No leave records found.</p>
                    ) : (
                        <table className="w-full text-sm">
                            <thead>
                                <tr className="border-b border-white/5 text-slate-400 text-xs uppercase">
                                    {isAdmin && <th className="text-left p-4">Employee</th>}
                                    <th className="text-left p-4">Type</th>
                                    <th className="text-left p-4">From</th>
                                    <th className="text-left p-4">To</th>
                                    <th className="text-left p-4">Days</th>
                                    <th className="text-left p-4">Reason</th>
                                    <th className="text-left p-4">Status</th>
                                    {isAdmin && <th className="text-left p-4">Actions</th>}
                                </tr>
                            </thead>
                            <tbody>
                                {leaves.map(l => (
                                    <tr key={l.id} className="border-b border-white/5 hover:bg-white/5">
                                        {isAdmin && <td className="p-4 text-white font-medium">{l.employeeName}</td>}
                                        <td className="p-4 text-slate-300 capitalize">{l.type}</td>
                                        <td className="p-4 text-slate-300">{l.fromDate}</td>
                                        <td className="p-4 text-slate-300">{l.toDate}</td>
                                        <td className="p-4 text-slate-300">{l.days}</td>
                                        <td className="p-4 text-slate-300 max-w-[200px] truncate">{l.reason}</td>
                                        <td className="p-4"><Badge className={statusColors[l.status]}>{l.status}</Badge></td>
                                        {isAdmin && (
                                            <td className="p-4">
                                                {l.status === "pending" && (
                                                    <div className="flex gap-2">
                                                        <Button size="sm" onClick={() => handleAction(l.id, "approved")} className="bg-green-600 hover:bg-green-500 text-xs">Approve</Button>
                                                        <Button size="sm" variant="outline" onClick={() => handleAction(l.id, "rejected")} className="border-red-500/30 text-red-400 hover:bg-red-500/10 text-xs">Reject</Button>
                                                    </div>
                                                )}
                                            </td>
                                        )}
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
