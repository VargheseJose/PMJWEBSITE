"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { collection, getDocs, orderBy, query, doc, updateDoc } from "firebase/firestore"
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

interface Rental {
    id: string
    customerName: string
    customerPhone: string
    startDate: { seconds: number }
    endDate: { seconds: number }
    status: string
    totalAmount: number
}

export default function RentalsPage() {
    const [rentals, setRentals] = useState<Rental[]>([])
    const [loading, setLoading] = useState(true)
    const [searchTerm, setSearchTerm] = useState("")

    useEffect(() => {
        const fetchRentals = async () => {
            try {
                const q = query(collection(db, "rentals"), orderBy("startDate", "desc"))
                const querySnapshot = await getDocs(q)
                const items: Rental[] = []
                querySnapshot.forEach((doc) => {
                    items.push({ id: doc.id, ...doc.data() } as Rental)
                })
                setRentals(items)
            } catch (error) {
                console.error("Error fetching rentals:", error)
            } finally {
                setLoading(false)
            }
        }

        fetchRentals()
    }, [])

    const filteredRentals = rentals.filter((item) =>
        item.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.customerPhone.includes(searchTerm)
    )

    const formatDate = (timestamp: { seconds: number }) => {
        return new Date(timestamp.seconds * 1000).toLocaleDateString()
    }

    const handleComplete = async (id: string) => {
        if (!confirm("Mark this rental as returned/completed?")) return
        try {
            await updateDoc(doc(db, "rentals", id), {
                status: "completed",
                actualReturnDate: new Date()
            })
            setRentals(prev => prev.map(r => r.id === id ? { ...r, status: "completed" } : r))
        } catch (error) {
            console.error("Error updating rental:", error)
            alert("Error updating rental")
        }
    }

    return (
        <div className="flex flex-col gap-4">
            <div className="flex items-center justify-between">
                <h1 className="text-2xl font-bold tracking-tight">Bookings & Rentals</h1>
                <Link href="/admin/rentals/new">
                    <Button>
                        <Plus className="mr-2 h-4 w-4" /> New Booking
                    </Button>
                </Link>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>Rental History</CardTitle>
                    <CardDescription>
                        View and manage all rental orders.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="mb-4 flex items-center gap-2">
                        <Search className="h-4 w-4 text-muted-foreground" />
                        <Input
                            placeholder="Search by customer name or phone..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="max-w-sm"
                        />
                    </div>

                    <div className="rounded-md border">
                        <div className="grid grid-cols-7 gap-4 border-b bg-muted/50 p-4 font-medium">
                            <div className="col-span-2">Customer</div>
                            <div>Start Date</div>
                            <div>End Date</div>
                            <div>Status</div>
                            <div className="text-right">Total</div>
                            <div className="text-right">Actions</div>
                        </div>
                        {loading ? (
                            <div className="p-4 text-center">Loading...</div>
                        ) : filteredRentals.length === 0 ? (
                            <div className="p-4 text-center text-muted-foreground">
                                No rentals found.
                            </div>
                        ) : (
                            filteredRentals.map((item) => (
                                <div
                                    key={item.id}
                                    className="grid grid-cols-7 gap-4 border-b p-4 last:border-0 hover:bg-muted/50 items-center"
                                >
                                    <div className="col-span-2 font-medium">
                                        <div>{item.customerName}</div>
                                        <div className="text-sm text-muted-foreground">{item.customerPhone}</div>
                                    </div>
                                    <div>{formatDate(item.startDate)}</div>
                                    <div>{formatDate(item.endDate)}</div>
                                    <div>
                                        <span
                                            className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 ${item.status === "active"
                                                    ? "bg-green-100 text-green-800"
                                                    : item.status === "completed"
                                                        ? "bg-blue-100 text-blue-800"
                                                        : "bg-gray-100 text-gray-800"
                                                }`}
                                        >
                                            {item.status}
                                        </span>
                                    </div>
                                    <div className="text-right">₹{item.totalAmount}</div>
                                    <div className="text-right">
                                        {item.status === "active" && (
                                            <Button size="sm" variant="outline" onClick={() => handleComplete(item.id)}>
                                                Return
                                            </Button>
                                        )}
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}
