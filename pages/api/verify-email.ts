import type { NextApiRequest, NextApiResponse } from "next";
import admin from "firebase-admin";
import serviceAccount from "../../voting-dapp-fa9b8-firebase-adminsdk-551np-c06374b34a.json"; // Path to your JSON file

// Initialize Firebase
if (!admin.apps.length) {
    admin.initializeApp({
        credential: admin.credential.cert(serviceAccount as admin.ServiceAccount),
    });
}

const db = admin.firestore();

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse
) {
    if (req.method === "POST") {
        const { email, walletAddress } = req.body;

        // Validate email format
        if (!email.endsWith("@mjcollege.ac.in")) {
            return res.status(400).json({ error: "Invalid college email ID." });
        }

        try {
            // Add the email and wallet address to Firestore
            await db.collection("verifiedEmails").doc(email).set({
                email,
                walletAddress,
                isVerified: false,
            });

            res.status(200).json({ message: "Email added for verification." });
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: "Failed to add email." });
        }
    } else {
        res.status(405).json({ error: "Method not allowed." });
    }
}