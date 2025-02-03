import { Connection, PublicKey } from "@solana/web3.js";
import { NextApiRequest, NextApiResponse } from "next";

const RPC_URL = "https://api.devnet.solana.com";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method !== "GET") return res.status(405).json({ error: "Method Not Allowed" });

    const { candidatePubkey } = req.query;

    try {
        const connection = new Connection(RPC_URL, "confirmed");
        const candidateAccount = new PublicKey(candidatePubkey as string);

        const accountInfo = await connection.getAccountInfo(candidateAccount);
        if (!accountInfo) return res.status(404).json({ error: "Candidate not found" });

        const voteCount = accountInfo.data.readUInt32LE(0);
        res.status(200).json({ voteCount });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}
