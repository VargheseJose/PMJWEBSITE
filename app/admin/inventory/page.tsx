"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { collection, getDocs, addDoc } from "firebase/firestore"
import { Plus, Search } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import { db } from "@/lib/firebase"

interface Equipment {
    id: string
    name: string
    category: string
    status: string
    dailyRate: number
    itemCode: string
}

export default function InventoryPage() {
    const [equipment, setEquipment] = useState<Equipment[]>([])
    const [loading, setLoading] = useState(true)
    const [searchTerm, setSearchTerm] = useState("")

    useEffect(() => {
        const fetchEquipment = async () => {
            try {
                const querySnapshot = await getDocs(collection(db, "equipment"))
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

    const filteredEquipment = equipment.filter((item) =>
        item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.itemCode.toLowerCase().includes(searchTerm.toLowerCase())
    )

    const seedDefaults = async () => {
        if (!confirm("Add default equipment from images? This may create duplicates if run twice.")) return
        setLoading(true)
        const defaults = [
            { name: "Pipe 6 M", category: "Scaffolding", itemCode: "PIPE-006", dailyRate: 15, images: ["/images/Pipe 6 M.jpg"], status: "available" },
            { name: "Span", category: "Formwork", itemCode: "SPAN-001", dailyRate: 25, images: ["/images/Span.jpg"], status: "available" },
            { name: "Props", category: "Formwork", itemCode: "PROP-001", dailyRate: 10, images: ["/images/props.JPG"], status: "available" },
            { name: "Scafolding", category: "Scaffolding", itemCode: "SCAF-001", dailyRate: 50, images: ["/images/scafolding.jpg"], status: "available" },
            { name: "Shutter", category: "Formwork", itemCode: "SHUT-001", dailyRate: 30, images: ["/images/shutter.jpg"], status: "available" },
        ]

        try {
            for (const item of defaults) {
                await addDoc(collection(db, "equipment"), {
                    ...item,
                    createdAt: new Date(),
                })
            }
            alert("Default items added!")
            window.location.reload()
        } catch (error) {
            console.error("Error seeding:", error)
            alert("Error adding defaults")
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="flex flex-col gap-4">
            <div className="flex items-center justify-between">
                <h1 className="text-2xl font-bold tracking-tight">Inventory</h1>
                <div className="flex gap-2">
                    <Button variant="outline" onClick={seedDefaults}>
                        Load Defaults
                    </Button>
                    <Link href="/admin/inventory/new">
                        <Button>
                            <Plus className="mr-2 h-4 w-4" /> Add Equipment
                        </Button>
                    </Link>
                </div>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>Equipment List</CardTitle>
                    <CardDescription>
                        Manage your rental stock here.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="mb-4 flex items-center gap-2">
                        <Search className="h-4 w-4 text-muted-foreground" />
                        <Input
                            placeholder="Search equipment..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="max-w-sm"
                        />
                    </div>

                    <div className="rounded-md border">
                        <div className="grid grid-cols-5 gap-4 border-b bg-muted/50 p-4 font-medium">
                            <div>Name</div>
                            <div>Category</div>
                            <div>Code</div>
                            <div>Status</div>
                            <div className="text-right">Daily Rate</div>
                        </div>
                        {loading ? (
                            <div className="p-4 text-center">Loading...</div>
                        ) : filteredEquipment.length === 0 ? (
                            <div className="p-4 text-center text-muted-foreground">
                                No equipment found.
                            </div>
                        ) : (
                            filteredEquipment.map((item) => (
                                <div
                                    key={item.id}
                                    className="grid grid-cols-5 gap-4 border-b p-4 last:border-0 hover:bg-muted/50"
                                >
                                    <div className="font-medium">{item.name}</div>
                                    <div>{item.category}</div>
                                    <div className="font-mono text-sm">{item.itemCode}</div>
                                    <div>
                                        <span
                                            className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 ${item.status === "available"
                                                ? "bg-green-100 text-green-800"
                                                : item.status === "rented"
                                                    ? "bg-red-100 text-red-800"
                                                    : "bg-yellow-100 text-yellow-800"
                                                }`}
                                        >
                                            {item.status}
                                        </span>
                                    </div>
                                    <div className="text-right">₹{item.dailyRate}</div>
                                </div>
                            ))
                        )}
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}
