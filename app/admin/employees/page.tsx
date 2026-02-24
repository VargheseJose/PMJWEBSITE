"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { collection, getDocs, query, orderBy } from "firebase/firestore"
import { db } from "@/lib/firebase"
import { UserProfile } from "@/lib/auth-context"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { UserPlus, Search, Users, Mail, Phone } from "lucide-react"

export default function EmployeesPage() {
    const [employees, setEmployees] = useState<UserProfile[]>([])
    const [loading, setLoading] = useState(true)
    const [search, setSearch] = useState("")
    const [roleFilter, setRoleFilter] = useState("all")

    useEffect(() => {
        getDocs(query(collection(db, "users"), orderBy("name")))
            .then(snap => {
                setEmployees(snap.docs.map(d => ({ uid: d.id, ...d.data() } as UserProfile)))
            })
            .finally(() => setLoading(false))
    }, [])

    const filtered = employees.filter(e => {
        const matchSearch = e.name?.toLowerCase().includes(search.toLowerCase()) ||
            e.email?.toLowerCase().includes(search.toLowerCase()) ||
            e.department?.toLowerCase().includes(search.toLowerCase())
        const matchRole = roleFilter === "all" || e.role === roleFilter
        return matchSearch && matchRole
    })

    const stats = {
        total: employees.length,
        active: employees.filter(e => e.status === "active").length,
        admins: employees.filter(e => e.role === "admin").length,
    }

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-white">Employees</h1>
                    <p className="text-slate-400 text-sm mt-1">Manage your team members and their roles</p>
                </div>
                <Link href="/admin/employees/new">
                    <Button className="gap-2 shadow-lg">
                        <UserPlus className="h-4 w-4" /> Add Employee
                    </Button>
                </Link>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-4">
                {[
                    { label: "Total Employees", value: stats.total, icon: Users },
                    { label: "Active", value: stats.active, icon: Users },
                    { label: "Admins / Managers", value: stats.admins, icon: Users },
                ].map(s => (
                    <Card key={s.label} className="bg-slate-800/50 border-white/10">
                        <CardContent className="p-4">
                            <p className="text-xs text-slate-400 uppercase tracking-wide">{s.label}</p>
                            <p className="text-2xl font-bold text-white mt-1">{s.value}</p>
                        </CardContent>
                    </Card>
                ))}
            </div>

            {/* Filters */}
            <div className="flex flex-col sm:flex-row gap-3">
                <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                    <Input
                        placeholder="Search by name, email or department..."
                        value={search}
                        onChange={e => setSearch(e.target.value)}
                        className="pl-9 bg-slate-800/50 border-white/10 text-white placeholder:text-slate-500"
                    />
                </div>
                <div className="flex gap-2">
                    {["all", "admin", "manager", "employee"].map(r => (
                        <Button
                            key={r}
                            size="sm"
                            variant={roleFilter === r ? "default" : "outline"}
                            onClick={() => setRoleFilter(r)}
                            className={roleFilter !== r ? "border-white/10 text-slate-400 hover:text-white" : ""}
                        >
                            {r === "all" ? "All" : r.charAt(0).toUpperCase() + r.slice(1)}
                        </Button>
                    ))}
                </div>
            </div>

            {/* Table */}
            <Card className="bg-slate-800/30 border-white/10">
                <div className="overflow-x-auto">
                    {loading ? (
                        <div className="p-8 text-center text-slate-400">Loading employees…</div>
                    ) : filtered.length === 0 ? (
                        <div className="p-8 text-center text-slate-400">No employees found.</div>
                    ) : (
                        <table className="w-full text-sm">
                            <thead>
                                <tr className="border-b border-white/5 text-slate-400 text-xs uppercase tracking-wide">
                                    <th className="text-left p-4">Employee</th>
                                    <th className="text-left p-4">Role</th>
                                    <th className="text-left p-4">Department</th>
                                    <th className="text-left p-4">Contact</th>
                                    <th className="text-left p-4">Status</th>
                                    <th className="text-left p-4">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filtered.map(emp => (
                                    <tr key={emp.uid} className="border-b border-white/5 hover:bg-white/5 transition-colors">
                                        <td className="p-4">
                                            <div className="flex items-center gap-3">
                                                <div className="h-9 w-9 rounded-full bg-primary/20 flex items-center justify-center text-primary font-bold text-sm shrink-0">
                                                    {emp.name?.[0]?.toUpperCase() ?? "?"}
                                                </div>
                                                <div>
                                                    <p className="font-medium text-white">{emp.name}</p>
                                                    <p className="text-xs text-slate-400">Joined {emp.joinDate ?? "—"}</p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="p-4">
                                            <Badge className={
                                                emp.role === "admin" ? "bg-purple-500/20 text-purple-300 border-purple-500/30" :
                                                    emp.role === "manager" ? "bg-blue-500/20 text-blue-300 border-blue-500/30" :
                                                        "bg-slate-500/20 text-slate-300 border-slate-500/30"
                                            }>
                                                {emp.role}
                                            </Badge>
                                        </td>
                                        <td className="p-4 text-slate-300">{emp.department ?? "—"}</td>
                                        <td className="p-4">
                                            <div className="flex flex-col gap-1">
                                                <span className="flex items-center gap-1 text-slate-300 text-xs"><Mail className="h-3 w-3" />{emp.email}</span>
                                                {emp.phone && <span className="flex items-center gap-1 text-slate-300 text-xs"><Phone className="h-3 w-3" />{emp.phone}</span>}
                                            </div>
                                        </td>
                                        <td className="p-4">
                                            <Badge className={emp.status === "active" ? "bg-green-500/20 text-green-300 border-green-500/30" : "bg-red-500/20 text-red-300 border-red-500/30"}>
                                                {emp.status}
                                            </Badge>
                                        </td>
                                        <td className="p-4">
                                            <Link href={`/admin/employees/${emp.uid}`}>
                                                <Button size="sm" variant="outline" className="border-white/10 text-slate-300 hover:text-white hover:bg-white/10">
                                                    View
                                                </Button>
                                            </Link>
                                        </td>
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
