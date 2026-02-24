export const dynamic = 'force-dynamic'
import { NextResponse } from "next/server";
import { db } from "@/lib/firebase";
import { collection, addDoc } from "firebase/firestore";


export async function POST(request: Request) {
    try {
        const body = await request.json();

        // Basic validation
        if (!body.name || !body.category || !body.dailyRate) {
            return NextResponse.json(
                { error: "Missing required fields: name, category, dailyRate" },
                { status: 400 }
            );
        }

        // Add to Firestore
        const docRef = await addDoc(collection(db, "equipment"), {
            ...body,
            createdAt: new Date(),
        });

        return NextResponse.json({
            success: true,
            id: docRef.id,
            message: "Equipment added successfully"
        });

    } catch (error) {
        console.error("Error adding equipment:", error);
        return NextResponse.json(
            { error: "Failed to add equipment", details: error instanceof Error ? error.message : String(error) },
            { status: 500 }
        );
    }
}
