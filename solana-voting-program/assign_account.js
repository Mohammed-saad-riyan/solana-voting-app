const { Connection, PublicKey, Keypair, Transaction, SystemProgram } = require('@solana/web3.js');
const fs = require('fs');

// Solana Devnet configuration
const RPC_URL = 'https://api.devnet.solana.com';
const PROGRAM_ID = new PublicKey('BUHSLu2Mm6odpLnTPX4pxXdmcBjYoxo4MkpCHnCy7mNB'); // Replace with your program ID
const ACCOUNT_KEYPAIR_PATH = './candidate2_account.json'; // Path to your keypair file

(async () => {
    const connection = new Connection(RPC_URL, 'confirmed');

    // Load the keypair from the JSON file
    const keypair = Keypair.fromSecretKey(Uint8Array.from(JSON.parse(fs.readFileSync(ACCOUNT_KEYPAIR_PATH, 'utf8'))));

    // Create a transaction to allocate space and assign ownership
    const transaction = new Transaction().add(
        SystemProgram.createAccount({
            fromPubkey: keypair.publicKey,           // Payer of the transaction
            newAccountPubkey: keypair.publicKey,    // Account to assign
            lamports: await connection.getMinimumBalanceForRentExemption(4), // Minimum lamports for rent exemption
            space: 4,                               // Space for a u32
            programId: PROGRAM_ID,                  // Owner program ID
        })
    );

    // Send the transaction
    const signature = await connection.sendTransaction(transaction, [keypair]);
    console.log('Transaction signature:', signature);

    // Confirm the transaction
    await connection.confirmTransaction(signature, 'confirmed');
    console.log('Account assigned successfully.');
})();
