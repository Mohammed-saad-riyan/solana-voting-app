const {
    Connection,
    PublicKey,
    Keypair,
    SystemProgram,
    Transaction,
    sendAndConfirmTransaction,
    TransactionInstruction
} = require("@solana/web3.js");
const fs = require('fs');

// Solana Devnet Connection
const connection = new Connection("https://api.devnet.solana.com", "confirmed");

// Voting Program ID
const PROGRAM_ID = new PublicKey("BUHSLu2Mm6odpLnTPX4pxXdmcBjYoxo4MkpCHnCy7mNB");

// Load your wallet keypair from the default Solana CLI config location
const WALLET_KEYPAIR = Keypair.fromSecretKey(
    Buffer.from(JSON.parse(fs.readFileSync(
        process.env.HOME + '/.config/solana/id.json'
    )))
);

const initializeCandidate = async (candidateKeypair) => {
    try {
        // Calculate space and rent
        const space = 4; // 4 bytes for vote count
        const lamports = await connection.getMinimumBalanceForRentExemption(space);

        // Create account instruction
        const createAccountIx = SystemProgram.createAccount({
            fromPubkey: WALLET_KEYPAIR.publicKey,
            newAccountPubkey: candidateKeypair.publicKey,
            lamports,
            space,
            programId: PROGRAM_ID,
        });

        // Initialize the account with your program
        const initializeIx = new TransactionInstruction({
            keys: [
                { pubkey: candidateKeypair.publicKey, isSigner: true, isWritable: true },
            ],
            programId: PROGRAM_ID,
            data: Buffer.from([0]) // Initialize instruction
        });

        const transaction = new Transaction()
            .add(createAccountIx)
            .add(initializeIx);

        // Send and confirm transaction
        const signature = await sendAndConfirmTransaction(
            connection,
            transaction,
            [WALLET_KEYPAIR, candidateKeypair] // Include both keypairs as signers
        );

        console.log(`✅ Account ${candidateKeypair.publicKey.toString()} initialized`);
        console.log(`Transaction: https://explorer.solana.com/tx/${signature}?cluster=devnet`);

        // Verify ownership
        const accountInfo = await connection.getAccountInfo(candidateKeypair.publicKey);
        if (accountInfo && accountInfo.owner.equals(PROGRAM_ID)) {
            console.log(`✅ Verified: Account is now owned by the program`);
        } else {
            console.log(`❌ Warning: Account ownership verification failed`);
        }

        return candidateKeypair;
    } catch (error) {
        console.error(`Error initializing candidate ${candidateKeypair.publicKey.toString()}:`, error);
        return null;
    }
};

const main = async () => {
    console.log(`Using wallet: ${WALLET_KEYPAIR.publicKey.toString()}`);

    // Generate and initialize 3 new candidate accounts
    const candidates = [];
    for (let i = 0; i < 3; i++) {
        console.log(`\nInitializing candidate ${i + 1}`);
        const candidateKeypair = Keypair.generate();
        const initializedCandidate = await initializeCandidate(candidateKeypair);

        if (initializedCandidate) {
            candidates.push({
                publicKey: initializedCandidate.publicKey.toString(),
                secretKey: Array.from(initializedCandidate.secretKey)
            });
        }
    }

    // Save keypairs to file
    if (candidates.length > 0) {
        fs.writeFileSync(
            'candidate-keypairs.json',
            JSON.stringify(candidates, null, 2)
        );
        console.log('\nCandidate keypairs saved to candidate-keypairs.json');
    }
};

main()
    .then(() => console.log('Finished initializing all candidates'))
    .catch(console.error);