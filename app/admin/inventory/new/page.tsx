"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { addDoc, collection } from "firebase/firestore"
import { Loader2 } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import { db } from "@/lib/firebase"

export default function NewEquipmentPage() {
    const router = useRouter()
    const [loading, setLoading] = useState(false)
    const [formData, setFormData] = useState({
        name: "",
        category: "",
        itemCode: "",
        dailyRate: "",
        description: "",
    })

    const handleChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
    ) => {
        const { name, value } = e.target
        setFormData((prev) => ({ ...prev, [name]: value }))
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setLoading(true)

        try {
            await addDoc(collection(db, "equipment"), {
                ...formData,
                dailyRate: Number(formData.dailyRate),
                status: "available",
                createdAt: new Date(),
            })
            router.push("/admin/inventory")
            router.refresh()
        } catch (error) {
            console.error("Error adding equipment:", error)
            alert("Error adding equipment")
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="flex flex-col gap-4">
            <h1 className="text-2xl font-bold tracking-tight">Add New Equipment</h1>

            <Card className="max-w-2xl">
                <CardHeader>
                    <CardTitle>Equipment Details</CardTitle>
                    <CardDescription>
                        Enter the details for the new equipment item.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div className="grid gap-2">
                            <Label htmlFor="name">Equipment Name</Label>
                            <Input
                                id="name"
                                name="name"
                                placeholder="e.g. H Frame Scaffolding"
                                required
                                value={formData.name}
                                onChange={handleChange}
                            />
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="grid gap-2">
                                <Label htmlFor="category">Category</Label>
                                <Input
                                    id="category"
                                    name="category"
                                    placeholder="e.g. Scaffolding"
                                    required
                                    value={formData.category}
                                    onChange={handleChange}
                                />
                            </div>
                            <div className="grid gap-2">
                                <Label htmlFor="itemCode">Item Code</Label>
                                <Input
                                    id="itemCode"
                                    name="itemCode"
                                    placeholder="e.g. SF-001"
                                    required
                                    value={formData.itemCode}
                                    onChange={handleChange}
                                />
                            </div>
                        </div>

                        <div className="grid gap-2">
                            <Label htmlFor="dailyRate">Daily Rate (₹)</Label>
                            <Input
                                id="dailyRate"
                                name="dailyRate"
                                type="number"
                                placeholder="0.00"
                                required
                                value={formData.dailyRate}
                                onChange={handleChange}
                            />
                        </div>

                        <div className="grid gap-2">
                            <Label htmlFor="description">Description / Specifications</Label>
                            <Textarea
                                id="description"
                                name="description"
                                placeholder="Enter details..."
                                value={formData.description}
                                onChange={handleChange}
                            />
                        </div>

                        <div className="flex justify-end gap-2">
                            <Button
                                type="button"
                                variant="outline"
                                onClick={() => router.back()}
                            >
                                Cancel
                            </Button>
                            <Button type="submit" disabled={loading}>
                                {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                                Save Equipment
                            </Button>
                        </div>
                    </form>
                </CardContent>
            </Card>
        </div>
    )
}
