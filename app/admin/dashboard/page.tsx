"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { collection, getDocs, query, where, orderBy, limit } from "firebase/firestore"
import { db } from "@/lib/firebase"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Users, Package, Calendar, Clock, CheckCircle, AlertTriangle, TrendingUp, ClipboardList } from "lucide-react"

interface KPIs {
    totalEmployees: number
    presentToday: number
    onLeave: number
    totalEquipment: number
    availableEquipment: number
    activeRentals: number
    pendingLeaves: number
    maintenanceDue: number
}

interface RecentLeave {
    id: string
    employeeName: string
    type: string
    fromDate: string
    status: string
}

function todayStr() { return new Date().toISOString().split("T")[0] }

export default function DashboardPage() {
    const [kpis, setKpis] = useState<KPIs | null>(null)
    const [recentLeaves, setRecentLeaves] = useState<RecentLeave[]>([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const fetchAll = async () => {
            const [empSnap, eqSnap, rentalSnap, attSnap, leaveSnap, maintSnap] = await Promise.all([
                getDocs(query(collection(db, "users"), where("status", "==", "active"))),
                getDocs(collection(db, "equipment")),
                getDocs(query(collection(db, "rentals"), where("status", "==", "active"))),
                getDocs(query(collection(db, "attendance"), where("date", "==", todayStr()))),
                getDocs(query(collection(db, "leaves"), orderBy("appliedAt", "desc"), limit(5))),
                getDocs(query(collection(db, "maintenance"), where("status", "==", "pending"))),
            ])

            const presentStatuses = ["present", "late"]
            const presentToday = attSnap.docs.filter(d => presentStatuses.includes(d.data().status)).length
            const onLeave = leaveSnap.docs.filter(d => d.data().status === "approved" && d.data().fromDate <= todayStr() && d.data().toDate >= todayStr()).length

            setKpis({
                totalEmployees: empSnap.size,
                presentToday,
                onLeave,
                totalEquipment: eqSnap.size,
                availableEquipment: eqSnap.docs.filter(d => d.data().status !== "rented").length,
                activeRentals: rentalSnap.size,
                pendingLeaves: leaveSnap.docs.filter(d => d.data().status === "pending").length,
                maintenanceDue: maintSnap.size,
            })
            setRecentLeaves(leaveSnap.docs.map(d => ({ id: d.id, ...d.data() } as RecentLeave)))
            setLoading(false)
        }
        fetchAll()
    }, [])

    if (loading) return <div className="text-slate-400 py-20 text-center">Loading dashboard…</div>
    if (!kpis) return null

    const attendanceRate = kpis.totalEmployees ? Math.round((kpis.presentToday / kpis.totalEmployees) * 100) : 0

    const statCards = [
        { label: "Total Employees", value: kpis.totalEmployees, icon: Users, color: "blue", href: "/admin/employees" },
        { label: "Present Today", value: `${kpis.presentToday} (${attendanceRate}%)`, icon: CheckCircle, color: "green", href: "/admin/attendance" },
        { label: "On Leave Today", value: kpis.onLeave, icon: Calendar, color: "yellow", href: "/admin/leaves" },
        { label: "Pending Leaves", value: kpis.pendingLeaves, icon: ClipboardList, color: "orange", href: "/admin/leaves" },
        { label: "Total Equipment", value: kpis.totalEquipment, icon: Package, color: "indigo", href: "/admin/inventory" },
        { label: "Available Equipment", value: kpis.availableEquipment, icon: Package, color: "teal", href: "/admin/inventory" },
        { label: "Active Rentals", value: kpis.activeRentals, icon: TrendingUp, color: "purple", href: "/admin/rentals" },
        { label: "Maintenance Due", value: kpis.maintenanceDue, icon: AlertTriangle, color: "red", href: "/admin/maintenance" },
    ]

    return (
        <div className="space-y-8">
            <div>
                <h1 className="text-2xl font-bold text-white">Dashboard</h1>
                <p className="text-slate-400 text-sm">{new Date().toLocaleDateString("en-IN", { weekday: "long", year: "numeric", month: "long", day: "numeric" })}</p>
            </div>

            {/* KPI Grid */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                {statCards.map(card => (
                    <Link key={card.label} href={card.href}>
                        <Card className="bg-slate-800/40 border-white/10 hover:border-white/20 hover:bg-slate-800/60 transition-all cursor-pointer group">
                            <CardContent className="p-5">
                                <div className="flex items-start justify-between mb-3">
                                    <div className={`p-2 rounded-lg bg-${card.color}-500/20 text-${card.color}-400`}>
                                        <card.icon className="h-5 w-5" />
                                    </div>
                                </div>
                                <p className="text-2xl font-bold text-white">{card.value}</p>
                                <p className="text-xs text-slate-400 mt-1">{card.label}</p>
                            </CardContent>
                        </Card>
                    </Link>
                ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Quick Clock-in */}
                <Card className="bg-slate-800/30 border-white/10">
                    <CardHeader>
                        <CardTitle className="text-white text-base flex items-center gap-2">
                            <Clock className="h-5 w-5 text-blue-400" /> Quick Actions
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="grid grid-cols-2 gap-3">
                        {[
                            { label: "My Attendance", href: "/admin/attendance/my", icon: Clock, desc: "Clock in / out" },
                            { label: "Apply Leave", href: "/admin/leaves", icon: Calendar, desc: "Submit leave request" },
                            { label: "Add Employee", href: "/admin/employees/new", icon: Users, desc: "Onboard new staff" },
                            { label: "Add Equipment", href: "/admin/inventory/new", icon: Package, desc: "Add to inventory" },
                        ].map(a => (
                            <Link key={a.href} href={a.href}>
                                <div className="p-4 rounded-xl bg-slate-700/40 border border-white/5 hover:border-white/20 hover:bg-slate-700/60 transition-all cursor-pointer">
                                    <a.icon className="h-5 w-5 text-primary mb-2" />
                                    <p className="text-sm font-semibold text-white">{a.label}</p>
                                    <p className="text-xs text-slate-400">{a.desc}</p>
                                </div>
                            </Link>
                        ))}
                    </CardContent>
                </Card>

                {/* Recent Leave Requests */}
                <Card className="bg-slate-800/30 border-white/10">
                    <CardHeader>
                        <CardTitle className="text-white text-base flex items-center gap-2">
                            <ClipboardList className="h-5 w-5 text-yellow-400" /> Recent Leave Requests
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                        {recentLeaves.length === 0 ? (
                            <p className="text-slate-400 text-sm">No leave requests.</p>
                        ) : recentLeaves.map(l => (
                            <div key={l.id} className="flex items-center gap-3 p-3 rounded-lg bg-slate-700/40">
                                <div className="flex-1 min-w-0">
                                    <p className="text-sm font-medium text-white truncate">{l.employeeName}</p>
                                    <p className="text-xs text-slate-400 capitalize">{l.type} leave — from {l.fromDate}</p>
                                </div>
                                <Badge className={l.status === "approved" ? "bg-green-500/20 text-green-300" : l.status === "rejected" ? "bg-red-500/20 text-red-300" : "bg-yellow-500/20 text-yellow-300"}>
                                    {l.status}
                                </Badge>
                            </div>
                        ))}
                        <Link href="/admin/leaves" className="block">
                            <p className="text-xs text-primary hover:underline mt-2">View all leave requests →</p>
                        </Link>
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}
