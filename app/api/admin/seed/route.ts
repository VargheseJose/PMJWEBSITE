
import { NextResponse } from "next/server";
import { db } from "@/lib/firebase";
import { collection, addDoc } from "firebase/firestore";
import fs from 'fs';
import path from 'path';

export async function POST(request: Request) {
    try {
        const IMAGES_DIR = path.join(process.cwd(), 'public', 'images');
        
        if (!fs.existsSync(IMAGES_DIR)) {
            return NextResponse.json({ error: `Directory not found: ${IMAGES_DIR}` }, { status: 404 });
        }

        const files = fs.readdirSync(IMAGES_DIR);
        const imageFiles = files.filter(file => /\.(jpg|jpeg|png|gif|webp|svg)$/i.test(file));
        const equipmentCollection = collection(db, 'equipment');
        const results = [];

        for (const file of imageFiles) {
            const name = path.parse(file).name;
            const itemCode = name.replace(/[^a-z0-9]/gi, '-').toUpperCase();
            
            let category = "Scaffolding";
            const nameLower = name.toLowerCase();
            if (nameLower.includes("machine") || nameLower.includes("mixer")) category = "Machinery";
            if (nameLower.includes("shutter") || nameLower.includes("form")) category = "Formwork";

            const itemData = {
                name: name,
                category: category,
                specifications: "Imported from image library",
                dailyRate: 150,
                itemCode: `IMG-${itemCode}`,
                images: [`/images/${file}`], // Accessible public path
                status: "Available",
                createdAt: new Date()
            };

            const docRef = await addDoc(equipmentCollection, itemData);
            results.push({ name, id: docRef.id });
        }

        return NextResponse.json({ 
            success: true, 
            count: results.length,
            items: results
        });

    } catch (error) {
        console.error("Error seeding images:", error);
        return NextResponse.json(
            { error: "Failed to seed images", details: error instanceof Error ? error.message : String(error) },
            { status: 500 }
        );
    }
}
