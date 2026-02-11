"use client"

import { useEffect, useState, Suspense } from "react"
import Link from "next/link"
import { useSearchParams } from "next/navigation"
import { collection, getDocs, query, where } from "firebase/firestore"
import { Search, Filter, ShoppingCart } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import { db } from "@/lib/firebase"

interface Equipment {
    id: string
    name: string
    category: string
    specifications: string
    dailyRate: number
    itemCode: string
    images?: string[]
    status?: string
}

function CatalogContent() {
    const searchParams = useSearchParams()
    const initialCategory = searchParams.get("category") || "All"

    const [equipment, setEquipment] = useState<Equipment[]>([])
    const [loading, setLoading] = useState(true)
    const [searchTerm, setSearchTerm] = useState("")
    const [categoryFilter, setCategoryFilter] = useState(initialCategory)

    useEffect(() => {
        const fetchEquipment = async () => {
            try {
                const q = collection(db, "equipment")
                const querySnapshot = await getDocs(q)
                const items: Equipment[] = []
                querySnapshot.forEach((doc) => {
                    items.push({ id: doc.id, ...doc.data() } as Equipment)
                })
                setEquipment(items)
            } catch (error) {
                console.error("Error fetching equipment:", error)
            } finally {
                setLoading(false)
            }
        }

        fetchEquipment()
    }, [])

    useEffect(() => {
        if (initialCategory) {
            setCategoryFilter(initialCategory)
        }
    }, [initialCategory])

    const filteredEquipment = equipment.filter((item) => {
        const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            item.itemCode.toLowerCase().includes(searchTerm.toLowerCase())
        const matchesCategory = categoryFilter === "All" || item.category === categoryFilter
        return matchesSearch && matchesCategory
    })

    // Get unique categories and sort
    const categories = ["All", ...Array.from(new Set(equipment.map((item) => item.category))).filter(Boolean)].sort()

    return (
        <div className="container py-10 px-4 md:px-6">
            <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between mb-8">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Equipment Catalog</h1>
                    <p className="text-muted-foreground mt-2">
                        Browse our extensive range of professional construction equipment.
                    </p>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 lg:grid-cols-5 gap-8">
                {/* Filters Sidebar */}
                <aside className="md:col-span-1 space-y-6">
                    <div className="space-y-4">
                        <div className="flex items-center gap-2 font-semibold text-lg">
                            <Filter className="h-5 w-5" /> Filters
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-medium">Search</label>
                            <div className="relative">
                                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                                <Input
                                    placeholder="Search..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    className="pl-9"
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-medium">Category</label>
                            <div className="grid gap-1">
                                {categories.map((cat) => (
                                    <Button
                                        key={cat}
                                        variant={categoryFilter === cat ? "secondary" : "ghost"}
                                        className="justify-start w-full text-left"
                                        onClick={() => setCategoryFilter(cat)}
                                    >
                                        {cat}
                                    </Button>
                                ))}
                            </div>
                        </div>
                    </div>

                    <div className="rounded-lg border bg-muted/20 p-4">
                        <h4 className="font-semibold mb-2">Need Custom Quote?</h4>
                        <p className="text-sm text-muted-foreground mb-4">
                            For large projects or long-term rentals, contact us directly for special pricing.
                        </p>
                        <Link href="/contact">
                            <Button size="sm" variant="outline" className="w-full">Contact Support</Button>
                        </Link>
                    </div>
                </aside>

                {/* Product Grid */}
                <div className="md:col-span-3 lg:col-span-4">
                    <div className="mb-4 text-sm text-muted-foreground">
                        Showing {filteredEquipment.length} result{filteredEquipment.length !== 1 ? 's' : ''}
                    </div>

                    {loading ? (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                            {[1, 2, 3, 4, 5, 6].map((i) => (
                                <Card key={i} className="animate-pulse">
                                    <div className="h-[200px] bg-muted" />
                                    <CardHeader><div className="h-6 w-3/4 bg-muted rounded" /></CardHeader>
                                    <CardContent><div className="h-4 w-full bg-muted rounded" /></CardContent>
                                </Card>
                            ))}
                        </div>
                    ) : filteredEquipment.length === 0 ? (
                        <div className="flex flex-col items-center justify-center py-20 text-center border rounded-lg bg-muted/10">
                            <Search className="h-10 w-10 text-muted-foreground mb-4" />
                            <h3 className="text-lg font-semibold">No equipment found</h3>
                            <p className="text-muted-foreground">Try adjusting your search or filters.</p>
                            <Button
                                variant="outline"
                                className="mt-4"
                                onClick={() => { setSearchTerm(""); setCategoryFilter("All"); }}
                            >
                                Clear Filters
                            </Button>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
                            {filteredEquipment.map((item) => (
                                <Card key={item.id} className="group overflow-hidden flex flex-col transition-all hover:shadow-lg hover:border-primary/50">
                                    <div className="relative aspect-[4/3] w-full bg-muted/30 flex items-center justify-center overflow-hidden">
                                        {/* Placeholder for actual image */}
                                        {item.images && item.images.length > 0 ? (
                                            <img
                                                src={item.images[0]}
                                                alt={item.name}
                                                className="h-full w-full object-cover transition-transform group-hover:scale-105"
                                            />
                                        ) : (
                                            <div className="flex flex-col items-center text-muted-foreground/50">
                                                <ShoppingCart className="h-12 w-12 mb-2 opactiy-20" />
                                                <span className="text-xs font-medium uppercase tracking-wider">No Image</span>
                                            </div>
                                        )}
                                        <Badge className="absolute top-2 right-2 bg-background/80 text-foreground backdrop-blur-sm hover:bg-background/90">
                                            {item.category}
                                        </Badge>
                                    </div>

                                    <CardHeader className="p-4 pb-2">
                                        <div className="flex justify-between items-start gap-2">
                                            <CardTitle className="text-base font-bold line-clamp-1">{item.name}</CardTitle>
                                        </div>
                                        <CardDescription className="text-xs font-mono">{item.itemCode}</CardDescription>
                                    </CardHeader>

                                    <CardContent className="p-4 pt-2 flex-grow">
                                        <p className="text-sm text-muted-foreground line-clamp-2 min-h-[2.5em]">
                                            {item.specifications || "Professional grade construction equipment."}
                                        </p>
                                    </CardContent>

                                    <CardFooter className="p-4 pt-0 mt-auto flex items-center justify-between border-t bg-muted/10 px-4 py-3">
                                        <div className="flex flex-col">
                                            <span className="text-xs text-muted-foreground uppercase tracking-wider font-semibold">Rate</span>
                                            <span className="text-lg font-bold text-primary">₹{item.dailyRate}<span className="text-xs font-normal text-muted-foreground">/day</span></span>
                                        </div>
                                        <Link href="/contact">
                                            <Button size="sm" className="font-semibold shadow-sm">
                                                Enquire
                                            </Button>
                                        </Link>
                                    </CardFooter>
                                </Card>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}

export default function CatalogPage() {
    return (
        <Suspense fallback={<div className="container py-20 text-center">Loading Catalog...</div>}>
            <CatalogContent />
        </Suspense>
    )
}
