import { Connection, PublicKey, Transaction, TransactionInstruction } from "@solana/web3.js";
import { NextApiRequest, NextApiResponse } from "next";

const RPC_URL = "https://api.devnet.solana.com";
const PROGRAM_ID = new PublicKey("BUHSLu2Mm6odpLnTPX4pxXdmcBjYoxo4MkpCHnCy7mNB"); // Your actual program ID

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method !== "POST") return res.status(405).json({ error: "Method Not Allowed" });

    try {
        const { candidatePubkey, walletPubkey } = req.body;

        if (!candidatePubkey || !walletPubkey) {
            throw new Error("Invalid candidate or wallet public key");
        }

        console.log("📩 Processing vote for candidate:", candidatePubkey);
        console.log("🔑 Voter Wallet:", walletPubkey);

        const connection = new Connection(RPC_URL, "confirmed");
        const candidateAccount = new PublicKey(candidatePubkey);
        const voterWallet = new PublicKey(walletPubkey);

        // Ensure the candidate account exists
        const accountInfo = await connection.getAccountInfo(candidateAccount);
        if (!accountInfo) {
            throw new Error(`❌ Candidate account ${candidatePubkey} does not exist.`);
        }

        // ✅ Get latest blockhash to include in the transaction
        const { blockhash } = await connection.getLatestBlockhash();

        // Create voting transaction
        const instruction = new TransactionInstruction({
            keys: [
                { pubkey: candidateAccount, isSigner: false, isWritable: true }, // Candidate account (writable)
                { pubkey: voterWallet, isSigner: true, isWritable: false }, // Voter wallet (signer)
            ],
            programId: PROGRAM_ID,
            data: Buffer.alloc(0), // No extra data needed for voting
        });

        const transaction = new Transaction().add(instruction);

        // ✅ Set recent blockhash
        transaction.recentBlockhash = blockhash;
        transaction.feePayer = voterWallet; // Ensure the voter is the fee payer

        // Convert transaction to base64
        const serializedTransaction = transaction.serialize({ requireAllSignatures: false });
        const base64Transaction = serializedTransaction.toString("base64");

        console.log("✅ Transaction successfully created!");

        res.status(200).json({ message: "Transaction Created", transaction: base64Transaction });
    } catch (error) {
        console.error("🚨 Error in cast-vote API:", error);
        res.status(500).json({ error: error.message });
    }
}
