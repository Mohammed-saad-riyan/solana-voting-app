import { FC, useEffect, useState } from "react";
import styles from "../styles/VotingCards.module.css";
import { useWallet } from "@solana/wallet-adapter-react";
import { Connection, PublicKey, Transaction } from "@solana/web3.js";

const VOTE_PROGRAM_ID = new PublicKey("BUHSLu2Mm6odpLnTPX4pxXdmcBjYoxo4MkpCHnCy7mNB"); // Your actual program ID
const RPC_URL = "https://api.devnet.solana.com";

const candidates = [
	{ id: 1, name: "Candidate 1", pubkey: "FUW3A9W5KHNfexe16QcyuR5BwnUXcwDam2F9mEDuYQkw" },
	{ id: 2, name: "Candidate 2", pubkey: "4N8293Tg1hEFGnviDmJ5m4v8decX1wpdvJSH1pg4zo78" },
	{ id: 3, name: "Candidate 3", pubkey: "CsmscLoYQXoHzF6TLLNXP7pawjUPWKSqWzpvrthZxbH1" },
];

export const VotingCards: FC = () => {
	const { publicKey, sendTransaction, signTransaction } = useWallet();
	const [voteCounts, setVoteCounts] = useState<{ [key: string]: number } | null>(null);
	const connection = new Connection(RPC_URL, "confirmed");

	// Fetch vote counts client-side
	useEffect(() => {
		const fetchVoteCounts = async () => {
			const updatedVotes: { [key: string]: number } = {};
			for (const candidate of candidates) {
				try {
					const accountInfo = await connection.getAccountInfo(new PublicKey(candidate.pubkey));
					if (accountInfo) {
						const voteCount = accountInfo.data.readUInt32LE(0);
						updatedVotes[candidate.pubkey] = voteCount;
					}
				} catch (error) {
					console.error(`Error fetching votes for ${candidate.name}:`, error);
				}
			}
			setVoteCounts(updatedVotes);
		};

		fetchVoteCounts();
	}, []);

	if (!voteCounts) return <p className={styles.loading}>Loading votes...</p>;

	const handleVote = async (candidatePubkey: string) => {
		if (!publicKey) {
			alert("Please connect your Phantom wallet!");
			return;
		}

		try {
			const response = await fetch("/api/cast-vote", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({
					candidatePubkey,
					walletPubkey: publicKey.toBase58(),
				}),
			});

			const { transaction } = await response.json();
			if (!transaction) throw new Error("Failed to create transaction.");

			const tx = Transaction.from(Buffer.from(transaction, "base64"));
			const signedTransaction = await signTransaction(tx);
			const txid = await connection.sendRawTransaction(signedTransaction.serialize());

			await connection.confirmTransaction(txid, "confirmed");

			alert(`🎉 Vote cast successfully! Transaction ID: ${txid}`);

			// Update vote count
			const updatedVotes = { ...voteCounts };
			updatedVotes[candidatePubkey] = (updatedVotes[candidatePubkey] || 0) + 1;
			setVoteCounts(updatedVotes);
		} catch (error) {
			console.error("🚨 Error casting vote:", error);
			alert(`Error: ${error.message}`);
		}
	};

	return (
		<div className={styles.container}>
			<h1 className={styles.heading}>Vote for Your Candidate</h1>
			<div className={styles.cardsContainer}>
				{candidates.map((candidate) => (
					<div key={candidate.id} className={styles.card}>
						<h3 className={styles.cardTitle}>{candidate.name}</h3>
						<p className={styles.voteCount}>Votes: {voteCounts[candidate.pubkey] || 0}</p>
						<button
							className={styles.voteButton}
							onClick={() => handleVote(candidate.pubkey)}
							disabled={!publicKey}
						>
							{publicKey ? "Vote" : "Connect Wallet to Vote"}
						</button>
					</div>
				))}
			</div>
		</div>
	);
};
