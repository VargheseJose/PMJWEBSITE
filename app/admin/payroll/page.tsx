"use client"

import { useEffect, useState } from "react"
import { collection, getDocs, query, where, orderBy } from "firebase/firestore"
import { db } from "@/lib/firebase"
import { UserProfile } from "@/lib/auth-context"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Download, DollarSign } from "lucide-react"

interface PayrollRow {
    employee: UserProfile
    presentDays: number
    absentDays: number
    lateDays: number
    leaveDays: number
    grossSalary: number
    deductions: number
    netSalary: number
}

function monthStr(offset = 0) {
    const d = new Date()
    d.setMonth(d.getMonth() + offset)
    return d.toISOString().slice(0, 7) // YYYY-MM
}

export default function PayrollPage() {
    const [month, setMonth] = useState(monthStr())
    const [rows, setRows] = useState<PayrollRow[]>([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const fetchPayroll = async () => {
            setLoading(true)
            const [empSnap, attSnap, leaveSnap] = await Promise.all([
                getDocs(query(collection(db, "users"), where("status", "==", "active"))),
                getDocs(query(collection(db, "attendance"), where("date", ">=", `${month}-01`), where("date", "<=", `${month}-31`))),
                getDocs(query(collection(db, "leaves"), where("status", "==", "approved"))),
            ])

            const employees = empSnap.docs.map(d => ({ uid: d.id, ...d.data() } as UserProfile))
            const attByEmp: Record<string, { present: number; absent: number; late: number }> = {}
            attSnap.docs.forEach(d => {
                const { employeeId, status } = d.data()
                if (!attByEmp[employeeId]) attByEmp[employeeId] = { present: 0, absent: 0, late: 0 }
                if (status === "present") attByEmp[employeeId].present++
                else if (status === "absent") attByEmp[employeeId].absent++
                else if (status === "late") { attByEmp[employeeId].present++; attByEmp[employeeId].late++ }
            })
            const leaveByEmp: Record<string, number> = {}
            leaveSnap.docs.forEach(d => {
                const { employeeId, days, fromDate } = d.data()
                if (fromDate?.startsWith(month)) leaveByEmp[employeeId] = (leaveByEmp[employeeId] || 0) + (days || 0)
            })

            const workingDays = 26 // avg working days per month
            const payrollRows: PayrollRow[] = employees.map(emp => {
                const att = attByEmp[emp.uid] ?? { present: 0, absent: 0, late: 0 }
                const leaveDays = leaveByEmp[emp.uid] ?? 0
                const salary = emp.salary ?? 0
                const perDay = salary / workingDays
                const lateDeduction = att.late * (perDay * 0.1) // 10% of daily rate per late
                const absentDeduction = att.absent * perDay
                const deductions = Math.round(lateDeduction + absentDeduction)
                return {
                    employee: emp,
                    presentDays: att.present,
                    absentDays: att.absent,
                    lateDays: att.late,
                    leaveDays,
                    grossSalary: salary,
                    deductions,
                    netSalary: Math.max(0, salary - deductions),
                }
            })
            setRows(payrollRows)
            setLoading(false)
        }
        fetchPayroll()
    }, [month])

    const totalPayroll = rows.reduce((sum, r) => sum + r.netSalary, 0)

    const exportCSV = () => {
        const headers = ["Name", "Department", "Gross (₹)", "Present Days", "Absent Days", "Late", "Leaves", "Deductions (₹)", "Net Pay (₹)"]
        const data = rows.map(r => [r.employee.name, r.employee.department ?? "", r.grossSalary, r.presentDays, r.absentDays, r.lateDays, r.leaveDays, r.deductions, r.netSalary])
        const csv = [headers, ...data].map(r => r.join(",")).join("\n")
        const a = document.createElement("a")
        a.href = "data:text/csv," + encodeURIComponent(csv)
        a.download = `payroll_${month}.csv`
        a.click()
    }

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-white">Payroll</h1>
                    <p className="text-slate-400 text-sm">Monthly salary summary with attendance adjustments</p>
                </div>
                <div className="flex gap-2">
                    <input type="month" value={month} onChange={e => setMonth(e.target.value)} className="h-10 rounded-md border border-white/10 bg-slate-800 px-3 text-sm text-white focus:outline-none" />
                    <Button variant="outline" onClick={exportCSV} className="border-white/10 text-slate-300 hover:text-white gap-2">
                        <Download className="h-4 w-4" /> Export CSV
                    </Button>
                </div>
            </div>

            {/* Summary */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <Card className="bg-blue-500/10 border-blue-500/20">
                    <CardContent className="p-5 flex items-center gap-4">
                        <DollarSign className="h-8 w-8 text-blue-400" />
                        <div>
                            <p className="text-xs text-slate-400">Total Payroll</p>
                            <p className="text-2xl font-bold text-white">₹{totalPayroll.toLocaleString("en-IN")}</p>
                        </div>
                    </CardContent>
                </Card>
                <Card className="bg-slate-800/30 border-white/10">
                    <CardContent className="p-5">
                        <p className="text-xs text-slate-400">Employees</p>
                        <p className="text-2xl font-bold text-white">{rows.length}</p>
                    </CardContent>
                </Card>
                <Card className="bg-slate-800/30 border-white/10">
                    <CardContent className="p-5">
                        <p className="text-xs text-slate-400">Avg Net Pay</p>
                        <p className="text-2xl font-bold text-white">₹{rows.length ? Math.round(totalPayroll / rows.length).toLocaleString("en-IN") : 0}</p>
                    </CardContent>
                </Card>
            </div>

            <Card className="bg-slate-800/30 border-white/10">
                <div className="overflow-x-auto">
                    {loading ? <p className="text-slate-400 p-6 text-center">Calculating payroll…</p> : (
                        <table className="w-full text-sm">
                            <thead>
                                <tr className="border-b border-white/5 text-slate-400 text-xs uppercase">
                                    <th className="text-left p-4">Employee</th>
                                    <th className="text-left p-4">Dept</th>
                                    <th className="text-right p-4">Gross (₹)</th>
                                    <th className="text-right p-4">Present</th>
                                    <th className="text-right p-4">Absent</th>
                                    <th className="text-right p-4">Late</th>
                                    <th className="text-right p-4">Deductions</th>
                                    <th className="text-right p-4">Net Pay</th>
                                </tr>
                            </thead>
                            <tbody>
                                {rows.map(r => (
                                    <tr key={r.employee.uid} className="border-b border-white/5 hover:bg-white/5">
                                        <td className="p-4">
                                            <p className="font-medium text-white">{r.employee.name}</p>
                                            <p className="text-xs text-slate-400 capitalize">{r.employee.role}</p>
                                        </td>
                                        <td className="p-4 text-slate-300">{r.employee.department ?? "—"}</td>
                                        <td className="p-4 text-right text-slate-300">₹{r.grossSalary.toLocaleString("en-IN")}</td>
                                        <td className="p-4 text-right text-green-400">{r.presentDays}</td>
                                        <td className="p-4 text-right text-red-400">{r.absentDays}</td>
                                        <td className="p-4 text-right text-yellow-400">{r.lateDays}</td>
                                        <td className="p-4 text-right text-red-400">-₹{r.deductions.toLocaleString("en-IN")}</td>
                                        <td className="p-4 text-right font-bold text-white">₹{r.netSalary.toLocaleString("en-IN")}</td>
                                    </tr>
                                ))}
                            </tbody>
                            <tfoot>
                                <tr className="border-t-2 border-white/10">
                                    <td colSpan={7} className="p-4 text-right font-semibold text-slate-300">Total Payroll</td>
                                    <td className="p-4 text-right font-bold text-primary text-lg">₹{totalPayroll.toLocaleString("en-IN")}</td>
                                </tr>
                            </tfoot>
                        </table>
                    )}
                </div>
            </Card>
        </div>
    )
}
