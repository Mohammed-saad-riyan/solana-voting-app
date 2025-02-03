import { Connection, PublicKey, Keypair, Transaction, SystemProgram } from "@solana/web3.js";
import { NextApiRequest, NextApiResponse } from "next";
import fs from "fs";

// Solana Setup
const RPC_URL = "https://api.devnet.solana.com";
const PROGRAM_ID = new PublicKey("BUHSLu2Mm6odpLnTPX4pxXdmcBjYoxo4MkpCHnCy7mNB");

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method !== "POST") return res.status(405).json({ error: "Method Not Allowed" });

    const { candidateKeypairPath } = req.body; // e.g., "./candidate1.json"

    try {
        const connection = new Connection(RPC_URL, "confirmed");

        // Load candidate keypair
        const keypair = Keypair.fromSecretKey(Uint8Array.from(JSON.parse(fs.readFileSync(candidateKeypairPath, "utf8"))));

        // Check if account is already initialized
        const accountInfo = await connection.getAccountInfo(keypair.publicKey);
        if (accountInfo) {
            return res.status(400).json({ message: "Candidate account already initialized" });
        }

        // Create a transaction to initialize candidate
        const transaction = new Transaction().add(
            SystemProgram.createAccount({
                fromPubkey: keypair.publicKey,
                newAccountPubkey: keypair.publicKey,
                lamports: await connection.getMinimumBalanceForRentExemption(4),
                space: 4, // Space for vote count
                programId: PROGRAM_ID,
            })
        );

        const signature = await connection.sendTransaction(transaction, [keypair]);
        await connection.confirmTransaction(signature, "confirmed");

        res.status(200).json({ message: "Candidate initialized", signature });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}
