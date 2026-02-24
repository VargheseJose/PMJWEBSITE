"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { createUserWithEmailAndPassword } from "firebase/auth"
import { doc, setDoc } from "firebase/firestore"
import { auth, db } from "@/lib/firebase"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowLeft, Loader2 } from "lucide-react"
import Link from "next/link"

const DEPARTMENTS = ["Operations", "Logistics", "Finance", "HR", "Technical", "Sales", "Management"]

export default function NewEmployeePage() {
    const router = useRouter()
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState("")
    const [form, setForm] = useState({
        name: "", email: "", password: "", role: "employee",
        department: "", phone: "", salary: "", joinDate: new Date().toISOString().split("T")[0]
    })

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) =>
        setForm(p => ({ ...p, [e.target.name]: e.target.value }))

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setLoading(true)
        setError("")
        try {
            // Create Firebase Auth user
            const cred = await createUserWithEmailAndPassword(auth, form.email, form.password)
            // Save profile in Firestore
            await setDoc(doc(db, "users", cred.user.uid), {
                name: form.name,
                email: form.email,
                role: form.role,
                department: form.department,
                phone: form.phone,
                salary: form.salary ? Number(form.salary) : null,
                joinDate: form.joinDate,
                status: "active",
                createdAt: new Date().toISOString(),
            })
            router.push("/admin/employees")
        } catch (err: unknown) {
            setError(err instanceof Error ? err.message : "Failed to create employee")
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="space-y-6 max-w-2xl">
            <div className="flex items-center gap-4">
                <Link href="/admin/employees">
                    <Button variant="outline" size="sm" className="border-white/10 text-slate-300 hover:text-white gap-2">
                        <ArrowLeft className="h-4 w-4" /> Back
                    </Button>
                </Link>
                <div>
                    <h1 className="text-2xl font-bold text-white">Add Employee</h1>
                    <p className="text-slate-400 text-sm">Create a new employee account</p>
                </div>
            </div>

            <Card className="bg-slate-800/30 border-white/10">
                <CardHeader><CardTitle className="text-white">Employee Details</CardTitle></CardHeader>
                <CardContent>
                    <form onSubmit={handleSubmit} className="space-y-5">
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div className="space-y-1.5">
                                <Label className="text-slate-300">Full Name *</Label>
                                <Input name="name" value={form.name} onChange={handleChange} required placeholder="John Doe" className="bg-slate-800 border-white/10 text-white placeholder:text-slate-500" />
                            </div>
                            <div className="space-y-1.5">
                                <Label className="text-slate-300">Email *</Label>
                                <Input name="email" type="email" value={form.email} onChange={handleChange} required placeholder="john@pmjgroup.in" className="bg-slate-800 border-white/10 text-white placeholder:text-slate-500" />
                            </div>
                            <div className="space-y-1.5">
                                <Label className="text-slate-300">Password *</Label>
                                <Input name="password" type="password" value={form.password} onChange={handleChange} required placeholder="Min. 8 characters" minLength={8} className="bg-slate-800 border-white/10 text-white placeholder:text-slate-500" />
                            </div>
                            <div className="space-y-1.5">
                                <Label className="text-slate-300">Phone</Label>
                                <Input name="phone" type="tel" value={form.phone} onChange={handleChange} placeholder="+91 98765 43210" className="bg-slate-800 border-white/10 text-white placeholder:text-slate-500" />
                            </div>
                            <div className="space-y-1.5">
                                <Label className="text-slate-300">Role *</Label>
                                <select name="role" value={form.role} onChange={handleChange} className="flex h-10 w-full rounded-md border border-white/10 bg-slate-800 px-3 py-2 text-sm text-white focus:outline-none focus:ring-2 focus:ring-primary">
                                    <option value="employee">Employee</option>
                                    <option value="manager">Manager</option>
                                    <option value="admin">Admin</option>
                                </select>
                            </div>
                            <div className="space-y-1.5">
                                <Label className="text-slate-300">Department</Label>
                                <select name="department" value={form.department} onChange={handleChange} className="flex h-10 w-full rounded-md border border-white/10 bg-slate-800 px-3 py-2 text-sm text-white focus:outline-none focus:ring-2 focus:ring-primary">
                                    <option value="">Select department</option>
                                    {DEPARTMENTS.map(d => <option key={d} value={d}>{d}</option>)}
                                </select>
                            </div>
                            <div className="space-y-1.5">
                                <Label className="text-slate-300">Join Date</Label>
                                <Input name="joinDate" type="date" value={form.joinDate} onChange={handleChange} className="bg-slate-800 border-white/10 text-white" />
                            </div>
                            <div className="space-y-1.5">
                                <Label className="text-slate-300">Monthly Salary (₹)</Label>
                                <Input name="salary" type="number" value={form.salary} onChange={handleChange} placeholder="e.g. 25000" className="bg-slate-800 border-white/10 text-white placeholder:text-slate-500" />
                            </div>
                        </div>

                        {error && <p className="text-sm text-red-400 bg-red-500/10 border border-red-500/20 rounded-md px-3 py-2">{error}</p>}

                        <div className="flex gap-3 pt-2">
                            <Button type="submit" disabled={loading} className="flex-1">
                                {loading ? <><Loader2 className="h-4 w-4 mr-2 animate-spin" />Creating…</> : "Create Employee"}
                            </Button>
                            <Link href="/admin/employees" className="flex-1">
                                <Button type="button" variant="outline" className="w-full border-white/10 text-slate-300">Cancel</Button>
                            </Link>
                        </div>
                    </form>
                </CardContent>
            </Card>
        </div>
    )
}
