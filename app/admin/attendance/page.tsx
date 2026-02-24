"use client"

import { useEffect, useState } from "react"
import { collection, getDocs, query, where, orderBy, doc, setDoc, updateDoc, Timestamp } from "firebase/firestore"
import { db } from "@/lib/firebase"
import { UserProfile } from "@/lib/auth-context"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Search, Download, Users, CheckCircle, XCircle, Clock } from "lucide-react"

interface AttendanceRecord {
    id: string
    employeeId: string
    employeeName: string
    date: string
    clockIn?: string
    clockOut?: string
    status: "present" | "absent" | "late" | "half-day"
    location?: { lat: number; lng: number }
    hoursWorked?: number
}

function todayStr() { return new Date().toISOString().split("T")[0] }
function timeStr() { return new Date().toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit", hour12: false }) }

export default function AttendancePage() {
    const [records, setRecords] = useState<AttendanceRecord[]>([])
    const [employees, setEmployees] = useState<UserProfile[]>([])
    const [loading, setLoading] = useState(true)
    const [date, setDate] = useState(todayStr())
    const [search, setSearch] = useState("")

    const fetchForDate = async (d: string) => {
        setLoading(true)
        const [empSnap, attSnap] = await Promise.all([
            getDocs(query(collection(db, "users"), orderBy("name"))),
            getDocs(query(collection(db, "attendance"), where("date", "==", d)))
        ])
        const emps = empSnap.docs.map(doc => ({ uid: doc.id, ...doc.data() } as UserProfile)).filter(e => e.status === "active")
        const atts = attSnap.docs.reduce((acc, doc) => {
            acc[doc.data().employeeId] = { id: doc.id, ...doc.data() } as AttendanceRecord
            return acc
        }, {} as Record<string, AttendanceRecord>)

        // Build merged list — one row per active employee
        const merged: AttendanceRecord[] = emps.map(emp => atts[emp.uid] ?? {
            id: `${emp.uid}_${d}`,
            employeeId: emp.uid,
            employeeName: emp.name,
            date: d,
            status: "absent" as const,
        })
        setEmployees(emps)
        setRecords(merged)
        setLoading(false)
    }

    useEffect(() => { fetchForDate(date) }, [date])

    const markManual = async (record: AttendanceRecord, status: AttendanceRecord["status"]) => {
        const ref = doc(db, "attendance", `${record.employeeId}_${date}`)
        const data = { ...record, status, employeeId: record.employeeId, employeeName: record.employeeName, date }
        await setDoc(ref, data, { merge: true })
        setRecords(prev => prev.map(r => r.employeeId === record.employeeId ? { ...r, status } : r))
    }

    const exportCSV = () => {
        const rows = [["Name", "Date", "Clock In", "Clock Out", "Status", "Hours"]]
        records.forEach(r => rows.push([r.employeeName, r.date, r.clockIn ?? "", r.clockOut ?? "", r.status, String(r.hoursWorked ?? "")]))
        const csv = rows.map(r => r.join(",")).join("\n")
        const a = document.createElement("a")
        a.href = "data:text/csv," + encodeURIComponent(csv)
        a.download = `attendance_${date}.csv`
        a.click()
    }

    const filtered = records.filter(r => r.employeeName?.toLowerCase().includes(search.toLowerCase()))
    const presentCount = records.filter(r => r.status === "present" || r.status === "late").length
    const absentCount = records.filter(r => r.status === "absent").length
    const lateCount = records.filter(r => r.status === "late").length

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-white">Attendance</h1>
                    <p className="text-slate-400 text-sm">Track and manage daily employee attendance</p>
                </div>
                <div className="flex gap-2">
                    <Input type="date" value={date} onChange={e => setDate(e.target.value)} className="bg-slate-800 border-white/10 text-white w-40" />
                    <Button variant="outline" onClick={exportCSV} className="border-white/10 text-slate-300 hover:text-white gap-2">
                        <Download className="h-4 w-4" /> Export
                    </Button>
                </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                {[
                    { label: "Total Staff", value: employees.length, icon: Users, color: "blue" },
                    { label: "Present", value: presentCount, icon: CheckCircle, color: "green" },
                    { label: "Absent", value: absentCount, icon: XCircle, color: "red" },
                    { label: "Late", value: lateCount, icon: Clock, color: "yellow" },
                ].map(s => (
                    <Card key={s.label} className={`bg-${s.color}-500/10 border-${s.color}-500/20`}>
                        <CardContent className="p-4 flex items-center gap-3">
                            <s.icon className={`h-8 w-8 text-${s.color}-400`} />
                            <div>
                                <p className="text-xs text-slate-400">{s.label}</p>
                                <p className="text-2xl font-bold text-white">{s.value}</p>
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>

            {/* Search + Table */}
            <div className="space-y-3">
                <div className="relative max-w-sm">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                    <Input placeholder="Search employee..." value={search} onChange={e => setSearch(e.target.value)} className="pl-9 bg-slate-800 border-white/10 text-white placeholder:text-slate-500" />
                </div>

                <Card className="bg-slate-800/30 border-white/10">
                    <div className="overflow-x-auto">
                        {loading ? (
                            <p className="text-slate-400 p-6 text-center">Loading…</p>
                        ) : (
                            <table className="w-full text-sm">
                                <thead>
                                    <tr className="border-b border-white/5 text-slate-400 text-xs uppercase">
                                        <th className="text-left p-4">Employee</th>
                                        <th className="text-left p-4">Clock In</th>
                                        <th className="text-left p-4">Clock Out</th>
                                        <th className="text-left p-4">Hours</th>
                                        <th className="text-left p-4">Status</th>
                                        <th className="text-left p-4">Location</th>
                                        <th className="text-left p-4">Override</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {filtered.map(r => (
                                        <tr key={r.employeeId} className="border-b border-white/5 hover:bg-white/5">
                                            <td className="p-4 font-medium text-white">{r.employeeName}</td>
                                            <td className="p-4 text-slate-300">{r.clockIn ?? "—"}</td>
                                            <td className="p-4 text-slate-300">{r.clockOut ?? "—"}</td>
                                            <td className="p-4 text-slate-300">{r.hoursWorked != null ? `${r.hoursWorked}h` : "—"}</td>
                                            <td className="p-4">
                                                <Badge className={
                                                    r.status === "present" ? "bg-green-500/20 text-green-300" :
                                                        r.status === "late" ? "bg-yellow-500/20 text-yellow-300" :
                                                            r.status === "half-day" ? "bg-orange-500/20 text-orange-300" :
                                                                "bg-red-500/20 text-red-300"
                                                }>{r.status}</Badge>
                                            </td>
                                            <td className="p-4 text-slate-400 text-xs">
                                                {r.location ? `${r.location.lat.toFixed(4)}, ${r.location.lng.toFixed(4)}` : "—"}
                                            </td>
                                            <td className="p-4">
                                                <div className="flex gap-1">
                                                    {(["present", "absent", "late", "half-day"] as const).map(s => (
                                                        <button
                                                            key={s}
                                                            onClick={() => markManual(r, s)}
                                                            className={`text-[10px] px-2 py-0.5 rounded-full border transition-colors ${r.status === s ? "bg-primary text-white border-primary" : "border-white/10 text-slate-400 hover:text-white hover:border-white/30"}`}
                                                        >
                                                            {s[0].toUpperCase() + s.slice(1)}
                                                        </button>
                                                    ))}
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        )}
                    </div>
                </Card>
            </div>
        </div>
    )
}
