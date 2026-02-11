"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { Construction, Menu, X, Calendar } from "lucide-react"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

export default function PublicLayout({
    children,
}: {
    children: React.ReactNode
}) {
    const pathname = usePathname()
    const [isMenuOpen, setIsMenuOpen] = useState(false)

    const navItems = [
        { name: "Equipment Catalog", href: "/catalog" },
        { name: "Services", href: "/#services" }, // Anchor link example
        { name: "About", href: "/about" },
        { name: "Contact", href: "/contact" },
    ]

    return (
        <div className="flex min-h-screen flex-col font-sans antialiased text-foreground">
            <header className="sticky top-0 z-50 w-full glass-strong">
                <div className="container flex h-16 items-center justify-between">
                    <div className="flex items-center gap-2">
                        <Link href="/" className="flex items-center gap-2">
                            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/20 backdrop-blur-sm border border-primary/20 text-primary">
                                <Construction className="h-5 w-5" />
                            </div>
                            <span className="font-bold text-lg tracking-tight text-white drop-shadow-sm">PMJ Group</span>
                        </Link>
                    </div>

                    {/* Desktop Nav */}
                    <nav className="hidden md:flex items-center gap-8 text-sm font-medium">
                        {navItems.map((item) => (
                            <Link
                                key={item.href}
                                href={item.href}
                                className={cn(
                                    "transition-all hover:text-white hover:drop-shadow-md",
                                    pathname === item.href ? "text-primary font-bold shadow-blue-500/50" : "text-muted-foreground"
                                )}
                            >
                                {item.name}
                            </Link>
                        ))}
                    </nav>

                    <div className="hidden md:flex items-center gap-4">
                        <Link href="/admin/dashboard">
                            <Button variant="ghost" size="sm" className="text-muted-foreground hover:bg-white/10 hover:text-white">Staff Login</Button>
                        </Link>
                        <Link href="https://calendar.app.google/saKTGCNfWYeEDwru9" target="_blank" rel="noopener noreferrer">
                            <Button variant="outline" size="sm" className="hidden lg:inline-flex gap-2 bg-white/5 border-white/10 hover:bg-white/10 backdrop-blur-sm">
                                <Calendar className="h-4 w-4" /> Book Appointment
                            </Button>
                        </Link>
                        <Link href="/contact">
                            <Button size="sm" className="font-semibold shadow-lg shadow-primary/25">Get Quote</Button>
                        </Link>
                    </div>

                    {/* Mobile Menu Toggle */}
                    <button
                        className="md:hidden p-2 text-muted-foreground hover:bg-white/10 rounded-lg"
                        onClick={() => setIsMenuOpen(!isMenuOpen)}
                    >
                        {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
                    </button>
                </div>

                {/* Mobile Menu */}
                {isMenuOpen && (
                    <div className="md:hidden border-t border-white/10 bg-black/60 backdrop-blur-xl p-4 shadow-2xl absolute w-full">
                        <nav className="flex flex-col space-y-4">
                            {navItems.map((item) => (
                                <Link
                                    key={item.href}
                                    href={item.href}
                                    onClick={() => setIsMenuOpen(false)}
                                    className="text-sm font-medium transition-colors hover:text-primary p-2 hover:bg-white/5 rounded-md"
                                >
                                    {item.name}
                                </Link>
                            ))}
                            <div className="pt-4 border-t border-white/10 flex flex-col gap-3">
                                <Link href="/contact" onClick={() => setIsMenuOpen(false)}>
                                    <Button className="w-full">Get Quote</Button>
                                </Link>
                                <Link href="/admin/dashboard" onClick={() => setIsMenuOpen(false)}>
                                    <Button variant="ghost" className="w-full justify-start hover:bg-white/5">Staff Login</Button>
                                </Link>
                                <Link href="https://calendar.app.google/saKTGCNfWYeEDwru9" target="_blank" rel="noopener noreferrer" onClick={() => setIsMenuOpen(false)}>
                                    <Button variant="outline" className="w-full justify-start gap-2 bg-white/5 border-white/10">
                                        <Calendar className="h-4 w-4" /> Book Appointment
                                    </Button>
                                </Link>
                            </div>
                        </nav>
                    </div>
                )}
            </header>
            <main className="flex-1 w-full">{children}</main>
            <footer className="border-t border-white/10 bg-black/20 backdrop-blur-lg py-12">
                <div className="container grid grid-cols-1 md:grid-cols-4 gap-8 px-4 md:px-6">
                    <div className="space-y-4">
                        <div className="flex items-center gap-2">
                            <div className="flex h-6 w-6 items-center justify-center rounded bg-primary text-primary-foreground">
                                <Construction className="h-4 w-4" />
                            </div>
                            <span className="font-bold">PMJ Group</span>
                        </div>
                        <p className="text-sm text-muted-foreground leading-relaxed">
                            Leading provider of construction equipment rentals. Quality machinery and scaffolding for every project size.
                        </p>
                    </div>
                    <div className="space-y-4">
                        <h4 className="font-semibold text-sm tracking-wider uppercase">Equipment</h4>
                        <ul className="space-y-2 text-sm text-muted-foreground">
                            <li><Link href="/catalog?category=Scaffolding">Scaffolding</Link></li>
                            <li><Link href="/catalog?category=Machinery">Heavy Machinery</Link></li>
                            <li><Link href="/catalog?category=Formwork">Formwork</Link></li>
                        </ul>
                    </div>
                    <div className="space-y-4">
                        <h4 className="font-semibold text-sm tracking-wider uppercase">Company</h4>
                        <ul className="space-y-2 text-sm text-muted-foreground">
                            <li><Link href="/about">About Us</Link></li>
                            <li><Link href="/contact">Contact</Link></li>
                            <li><Link href="/terms">Terms of Service</Link></li>
                        </ul>
                    </div>
                    <div className="space-y-4">
                        <h4 className="font-semibold text-sm tracking-wider uppercase">Contact</h4>
                        <ul className="space-y-2 text-sm text-muted-foreground">
                            <li>+91 94470 74312</li>
                            <li>contact@pmjgroup.in</li>
                            <li>Kerala, India</li>
                        </ul>
                    </div>
                </div>
                <div className="container mt-12 pt-8 border-t text-center text-sm text-muted-foreground">
                    © {new Date().getFullYear()} PMJ Group. All rights reserved.
                </div>
            </footer>
        </div>
    )
}
