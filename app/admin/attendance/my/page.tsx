"use client"

import { useEffect, useState } from "react"
import { doc, getDoc, setDoc, updateDoc } from "firebase/firestore"
import { db } from "@/lib/firebase"
import { useAuth } from "@/lib/auth-context"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Clock, MapPin, CheckCircle, LogIn, LogOut, Loader2 } from "lucide-react"

interface TodayRecord {
    clockIn?: string
    clockOut?: string
    status: string
    location?: { lat: number; lng: number }
    hoursWorked?: number
}

function todayStr() { return new Date().toISOString().split("T")[0] }
function timeStr() { return new Date().toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit", second: "2-digit", hour12: false }) }

export default function MyAttendancePage() {
    const { user, profile } = useAuth()
    const [record, setRecord] = useState<TodayRecord | null>(null)
    const [loading, setLoading] = useState(true)
    const [actionLoading, setActionLoading] = useState(false)
    const [loc, setLoc] = useState<{ lat: number; lng: number } | null>(null)
    const [locError, setLocError] = useState("")
    const [currentTime, setCurrentTime] = useState(timeStr())

    // Live clock
    useEffect(() => {
        const t = setInterval(() => setCurrentTime(timeStr()), 1000)
        return () => clearInterval(t)
    }, [])

    // Request location
    useEffect(() => {
        navigator.geolocation?.getCurrentPosition(
            pos => setLoc({ lat: pos.coords.latitude, lng: pos.coords.longitude }),
            () => setLocError("Location unavailable — attendance will be recorded without GPS")
        )
    }, [])

    // Fetch today's record
    useEffect(() => {
        if (!user) return
        getDoc(doc(db, "attendance", `${user.uid}_${todayStr()}`))
            .then(snap => snap.exists() ? setRecord(snap.data() as TodayRecord) : setRecord(null))
            .finally(() => setLoading(false))
    }, [user])

    const handleClockIn = async () => {
        if (!user || !profile) return
        setActionLoading(true)
        const now = timeStr()
        const hour = new Date().getHours()
        const status = hour >= 9 && new Date().getMinutes() <= 15 ? "present" : hour > 9 ? "late" : "present"

        const data = {
            employeeId: user.uid,
            employeeName: profile.name,
            date: todayStr(),
            clockIn: now,
            status,
            ...(loc ? { location: loc } : {}),
        }
        await setDoc(doc(db, "attendance", `${user.uid}_${todayStr()}`), data)
        setRecord(data)
        setActionLoading(false)
    }

    const handleClockOut = async () => {
        if (!user || !record) return
        setActionLoading(true)
        const now = timeStr()
        const [ih, im] = record.clockIn!.split(":").map(Number)
        const [oh, om] = now.split(":").map(Number)
        const hours = Math.round(((oh * 60 + om) - (ih * 60 + im)) / 60 * 10) / 10

        await updateDoc(doc(db, "attendance", `${user.uid}_${todayStr()}`), {
            clockOut: now,
            hoursWorked: hours,
        })
        setRecord(prev => prev ? { ...prev, clockOut: now, hoursWorked: hours } : prev)
        setActionLoading(false)
    }

    const isClockedIn = !!record?.clockIn
    const isClockedOut = !!record?.clockOut

    return (
        <div className="space-y-6 max-w-lg mx-auto">
            <div>
                <h1 className="text-2xl font-bold text-white">My Attendance</h1>
                <p className="text-slate-400 text-sm">Record your daily attendance</p>
            </div>

            {/* Clock */}
            <Card className="bg-slate-800/30 border-white/10 text-center">
                <CardContent className="py-10">
                    <p className="text-6xl font-mono font-bold text-white tracking-widest">{currentTime}</p>
                    <p className="text-slate-400 mt-2">{new Date().toLocaleDateString("en-IN", { weekday: "long", year: "numeric", month: "long", day: "numeric" })}</p>
                    {loc ? (
                        <div className="flex items-center justify-center gap-1 text-xs text-green-400 mt-3">
                            <MapPin className="h-3 w-3" /> GPS: {loc.lat.toFixed(4)}, {loc.lng.toFixed(4)}
                        </div>
                    ) : (
                        <p className="text-xs text-yellow-400 mt-3">{locError || "Fetching location…"}</p>
                    )}
                </CardContent>
            </Card>

            {/* Status */}
            {loading ? (
                <p className="text-slate-400 text-center">Loading today's record…</p>
            ) : (
                <Card className="bg-slate-800/30 border-white/10">
                    <CardHeader><CardTitle className="text-white text-base">Today's Record — {todayStr()}</CardTitle></CardHeader>
                    <CardContent className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                            <div className="p-4 rounded-lg bg-slate-700/50 text-center">
                                <p className="text-xs text-slate-400 mb-1">Clock In</p>
                                <p className="text-xl font-bold text-white">{record?.clockIn ?? "—"}</p>
                            </div>
                            <div className="p-4 rounded-lg bg-slate-700/50 text-center">
                                <p className="text-xs text-slate-400 mb-1">Clock Out</p>
                                <p className="text-xl font-bold text-white">{record?.clockOut ?? "—"}</p>
                            </div>
                        </div>

                        {record?.status && (
                            <div className="flex items-center justify-center gap-2">
                                <Badge className={record.status === "present" ? "bg-green-500/20 text-green-300" : record.status === "late" ? "bg-yellow-500/20 text-yellow-300" : "bg-slate-500/20 text-slate-300"}>
                                    {record.status}
                                </Badge>
                                {record.hoursWorked && <span className="text-slate-400 text-sm">{record.hoursWorked}h worked</span>}
                            </div>
                        )}

                        {isClockedOut ? (
                            <div className="flex items-center justify-center gap-2 text-green-400 py-4">
                                <CheckCircle className="h-6 w-6" />
                                <span className="font-semibold">Attendance recorded. See you tomorrow!</span>
                            </div>
                        ) : isClockedIn ? (
                            <Button onClick={handleClockOut} disabled={actionLoading} className="w-full py-6 bg-red-600 hover:bg-red-500 text-white font-bold text-lg gap-2">
                                {actionLoading ? <Loader2 className="h-5 w-5 animate-spin" /> : <LogOut className="h-5 w-5" />} Clock Out
                            </Button>
                        ) : (
                            <Button onClick={handleClockIn} disabled={actionLoading} className="w-full py-6 bg-green-600 hover:bg-green-500 text-white font-bold text-lg gap-2">
                                {actionLoading ? <Loader2 className="h-5 w-5 animate-spin" /> : <LogIn className="h-5 w-5" />} Clock In
                            </Button>
                        )}
                    </CardContent>
                </Card>
            )}
        </div>
    )
}
