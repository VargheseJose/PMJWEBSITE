
const { initializeApp, getApps, getApp } = require("firebase/app");
const { getFirestore, collection, addDoc } = require("firebase/firestore");
const fs = require('fs');
const path = require('path');

// Manually parse .env.local
try {
    const envPath = path.join(process.cwd(), '.env.local');
    if (fs.existsSync(envPath)) {
        const envConfig = fs.readFileSync(envPath, 'utf8');
        envConfig.split('\n').forEach(line => {
            const match = line.match(/^([^=]+)=(.*)$/);
            if (match) {
                const key = match[1].trim();
                const value = match[2].trim().replace(/^['"]|['"]$/g, ''); // Remove quotes
                process.env[key] = value;
            }
        });
        console.log("Loaded .env.local");
    }
} catch (e) {
    console.error("Error loading .env.local", e);
}

const firebaseConfig = {
    apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
    authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
    projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
    storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
    appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
    measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID
};

console.log("Initializing Firebase with project ID:", firebaseConfig.projectId);

const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
const db = getFirestore(app);

const IMAGES_DIR = path.join(process.cwd(), 'public', 'images');

async function seedImages() {
    try {
        if (!fs.existsSync(IMAGES_DIR)) {
            console.error(`Directory not found: ${IMAGES_DIR}`);
            return;
        }

        const files = fs.readdirSync(IMAGES_DIR);
        const imageFiles = files.filter(file => /\.(jpg|jpeg|png|gif|webp|svg)$/i.test(file));

        console.log(`Found ${imageFiles.length} images.`);

        const equipmentCollection = collection(db, 'equipment');

        for (const file of imageFiles) {
            const name = path.parse(file).name;
            // Simple logic to guess category
            let category = "Scaffolding"; // Default
            const nameLower = name.toLowerCase();
            if (nameLower.includes("machine") || nameLower.includes("mixer")) category = "Machinery";
            if (nameLower.includes("shutter") || nameLower.includes("form")) category = "Formwork";
            if (nameLower.includes("prop") || nameLower.includes("jack")) category = "Support Props";

            // Basic ID generation
            const id = name.replace(/[^a-z0-9]/gi, '_').toLowerCase();
            const itemCode = `IMG-${id.toUpperCase()}`;

            const itemData = {
                name: name,
                category: category,
                specifications: "Standard equipment from inventory.",
                dailyRate: 150,
                itemCode: itemCode,
                images: [`/images/${file}`],
                status: "Available",
                createdAt: new Date()
            };

            await addDoc(equipmentCollection, itemData);
            console.log(`Added: ${name} (${category}) -> ${itemCode}`);
        }

        console.log("Seeding complete!");
        process.exit(0);

    } catch (error) {
        console.error("Error seeding images:", error);
        process.exit(1);
    }
}

seedImages();
