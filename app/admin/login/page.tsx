"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/lib/auth-context"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Loader2, Lock, Mail } from "lucide-react"

export default function AdminLoginPage() {
    const { signIn } = useAuth()
    const router = useRouter()
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState("")

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setLoading(true)
        setError("")
        try {
            await signIn(email, password)
            router.push("/admin/dashboard")
        } catch (err: unknown) {
            const msg = err instanceof Error ? err.message : "Login failed"
            if (msg.includes("invalid-credential") || msg.includes("wrong-password") || msg.includes("user-not-found")) {
                setError("Invalid email or password.")
            } else {
                setError(msg)
            }
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-4">
            {/* Background blobs */}
            <div className="absolute top-0 left-1/4 w-96 h-96 bg-blue-600/20 rounded-full blur-[120px] pointer-events-none" />
            <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-indigo-600/20 rounded-full blur-[120px] pointer-events-none" />

            <div className="relative w-full max-w-md">
                {/* Logo */}
                <div className="flex flex-col items-center mb-8">
                    <img
                        src="/images/pmj_logo.jpg"
                        alt="PMJ Group"
                        className="h-16 w-auto object-contain rounded-lg shadow-xl mb-4"
                    />
                    <h1 className="text-2xl font-bold text-white">PMJ Admin Portal</h1>
                    <p className="text-slate-400 text-sm mt-1">Sign in to manage your operations</p>
                </div>

                <Card className="border-white/10 bg-white/5 backdrop-blur-xl shadow-2xl">
                    <CardHeader className="space-y-1 pb-4">
                        <CardTitle className="text-xl text-white">Sign In</CardTitle>
                        <CardDescription className="text-slate-400">
                            Enter your credentials to access the dashboard
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="email" className="text-slate-300">Email</Label>
                                <div className="relative">
                                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                                    <Input
                                        id="email"
                                        type="email"
                                        placeholder="admin@pmjgroup.in"
                                        value={email}
                                        onChange={e => setEmail(e.target.value)}
                                        required
                                        className="pl-9 bg-white/5 border-white/10 text-white placeholder:text-slate-500 focus:bg-white/10"
                                    />
                                </div>
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="password" className="text-slate-300">Password</Label>
                                <div className="relative">
                                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                                    <Input
                                        id="password"
                                        type="password"
                                        placeholder="••••••••"
                                        value={password}
                                        onChange={e => setPassword(e.target.value)}
                                        required
                                        className="pl-9 bg-white/5 border-white/10 text-white placeholder:text-slate-500 focus:bg-white/10"
                                    />
                                </div>
                            </div>

                            {error && (
                                <div className="text-sm text-red-400 bg-red-500/10 border border-red-500/20 rounded-md px-3 py-2">
                                    {error}
                                </div>
                            )}

                            <Button
                                type="submit"
                                disabled={loading}
                                className="w-full bg-primary hover:bg-primary/90 text-white font-semibold py-5 shadow-lg shadow-primary/25"
                            >
                                {loading
                                    ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Signing in…</>
                                    : "Sign In"
                                }
                            </Button>
                        </form>
                    </CardContent>
                </Card>

                <p className="text-center text-xs text-slate-600 mt-6">
                    PMJ Group Construction Equipment © {new Date().getFullYear()}
                </p>
            </div>
        </div>
    )
}
