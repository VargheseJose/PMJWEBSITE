"use client"

import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { useEffect } from "react"
import {
    LayoutDashboard, Package, Calendar, Settings, FileText,
    Users, Clock, ClipboardList, DollarSign, LogOut, Menu, ChevronRight
} from "lucide-react"
import { cn } from "@/lib/utils"
import { AuthProvider, useAuth } from "@/lib/auth-context"
import { Button } from "@/components/ui/button"

const navSections = [
    {
        label: "Overview",
        items: [
            { href: "/admin/dashboard", icon: LayoutDashboard, label: "Dashboard" },
        ]
    },
    {
        label: "Operations",
        items: [
            { href: "/admin/inventory", icon: Package, label: "Inventory" },
            { href: "/admin/rentals", icon: Calendar, label: "Bookings" },
            { href: "/admin/maintenance", icon: Settings, label: "Maintenance" },
        ]
    },
    {
        label: "People",
        items: [
            { href: "/admin/employees", icon: Users, label: "Employees" },
            { href: "/admin/attendance", icon: Clock, label: "Attendance" },
            { href: "/admin/attendance/my", icon: Clock, label: "My Attendance" },
            { href: "/admin/leaves", icon: ClipboardList, label: "Leave Management" },
            { href: "/admin/payroll", icon: DollarSign, label: "Payroll" },
        ]
    },
    {
        label: "Analytics",
        items: [
            { href: "/admin/reports", icon: FileText, label: "Reports" },
        ]
    }
]

function AdminSidebar() {
    const pathname = usePathname()
    const { profile, signOut } = useAuth()
    const router = useRouter()

    const handleSignOut = async () => {
        await signOut()
        router.push("/admin/login")
    }

    return (
        <div className="hidden border-r border-white/5 bg-slate-900 md:flex flex-col h-screen sticky top-0">
            {/* Logo */}
            <div className="flex h-16 items-center border-b border-white/5 px-4 lg:px-6">
                <Link href="/" className="flex items-center gap-2">
                    <img src="/images/pmj_logo.jpg" alt="PMJ Group" className="h-8 w-auto object-contain rounded" />
                    <div>
                        <p className="text-sm font-bold text-white leading-none">PMJ Admin</p>
                        <p className="text-[10px] text-slate-500 mt-0.5">Management Portal</p>
                    </div>
                </Link>
            </div>

            {/* Nav */}
            <div className="flex-1 overflow-y-auto py-4 px-3">
                {navSections.map((section) => (
                    <div key={section.label} className="mb-6">
                        <p className="text-[10px] font-semibold uppercase tracking-widest text-slate-500 px-3 mb-2">
                            {section.label}
                        </p>
                        {section.items.map((item) => {
                            const active = pathname === item.href || (item.href !== "/admin/dashboard" && pathname.startsWith(item.href))
                            return (
                                <Link
                                    key={item.href}
                                    href={item.href}
                                    className={cn(
                                        "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-all mb-0.5",
                                        active
                                            ? "bg-primary/20 text-primary"
                                            : "text-slate-400 hover:bg-white/5 hover:text-white"
                                    )}
                                >
                                    <item.icon className="h-4 w-4 shrink-0" />
                                    <span className="flex-1">{item.label}</span>
                                    {active && <ChevronRight className="h-3 w-3" />}
                                </Link>
                            )
                        })}
                    </div>
                ))}
            </div>

            {/* User info + Logout */}
            {profile && (
                <div className="border-t border-white/5 p-3">
                    <div className="flex items-center gap-3 rounded-lg p-3 bg-white/5 mb-2">
                        <div className="h-8 w-8 rounded-full bg-primary/20 flex items-center justify-center text-primary font-bold text-sm">
                            {profile.name?.[0]?.toUpperCase() ?? "?"}
                        </div>
                        <div className="flex-1 min-w-0">
                            <p className="text-sm font-semibold text-white truncate">{profile.name}</p>
                            <p className="text-xs text-slate-400 capitalize">{profile.role}</p>
                        </div>
                    </div>
                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={handleSignOut}
                        className="w-full justify-start text-slate-400 hover:text-red-400 hover:bg-red-500/10"
                    >
                        <LogOut className="h-4 w-4 mr-2" /> Sign Out
                    </Button>
                </div>
            )}
        </div>
    )
}

function AdminAuthGuard({ children }: { children: React.ReactNode }) {
    const { user, loading } = useAuth()
    const router = useRouter()
    const pathname = usePathname()

    useEffect(() => {
        if (!loading && !user && pathname !== "/admin/login") {
            router.replace("/admin/login")
        }
    }, [user, loading, pathname, router])

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-slate-900">
                <div className="flex flex-col items-center gap-4">
                    <img src="/images/pmj_logo.jpg" alt="PMJ" className="h-12 w-auto rounded animate-pulse" />
                    <div className="h-1 w-48 bg-slate-800 rounded-full overflow-hidden">
                        <div className="h-full bg-primary rounded-full animate-pulse" style={{ width: "60%" }} />
                    </div>
                    <p className="text-slate-500 text-sm">Loading Portal…</p>
                </div>
            </div>
        )
    }

    if (!user && pathname !== "/admin/login") return null
    return <>{children}</>
}

export default function AdminLayout({ children }: { children: React.ReactNode }) {
    const pathname = usePathname()
    const isLoginPage = pathname === "/admin/login"

    return (
        <AuthProvider>
            <AdminAuthGuard>
                {isLoginPage ? (
                    <>{children}</>
                ) : (
                    <div className="flex min-h-screen bg-slate-950 text-slate-100">
                        <AdminSidebar />
                        <div className="flex flex-col flex-1 min-w-0">
                            {/* Top bar — mobile */}
                            <header className="flex h-16 items-center gap-4 border-b border-white/5 bg-slate-900 px-4 lg:px-6 md:hidden">
                                <button className="text-slate-400 hover:text-white">
                                    <Menu className="h-5 w-5" />
                                </button>
                                <img src="/images/pmj_logo.jpg" alt="PMJ" className="h-7 w-auto rounded" />
                                <span className="font-semibold text-white">PMJ Admin</span>
                            </header>
                            <main className="flex-1 p-4 lg:p-6 overflow-auto">
                                {children}
                            </main>
                        </div>
                    </div>
                )}
            </AdminAuthGuard>
        </AuthProvider>
    )
}
