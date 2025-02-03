🗳️ Decentralized Voting App on Solana  

![Solana](https://img.shields.io/badge/Built_on-Solana-3ab7ff?style=for-the-badge&logo=solana)  
![Next.js](https://img.shields.io/badge/Frontend-Next.js-black?style=for-the-badge&logo=next.js)  
![Rust](https://img.shields.io/badge/Smart_Contract-Rust-blue?style=for-the-badge&logo=rust)  
![Firebase](https://img.shields.io/badge/Database-Firebase-orange?style=for-the-badge&logo=firebase)  
![Status](https://img.shields.io/badge/Status-Complete-success?style=for-the-badge)  


Project Overview**
**What is This Project?**
This is a **Decentralized Voting Application** built on **Solana Blockchain**, where users can:
- ✅ **Connect Phantom Wallet**
- ✅ **Vote for 3 candidates (Votes stored on-chain)**
- ✅ **Ensure only verified users (via college email) can vote**
- ✅ **Prevent double-voting**
- ✅ **Fetch real-time vote counts from the blockchain**

**This DApp is fully decentralized, meaning all votes are stored securely on the Solana blockchain.**  
It is built using **Next.js (React), TypeScript, Solana Smart Contracts (Rust), and Firebase**.

---

![PHOTO-2025-02-03-22-05-32](https://github.com/user-attachments/assets/55495e12-138e-43cb-98f3-75365000fb4e)


---

**Tech Stack**
| **Technology**     | **Usage**                      |
|--------------------|--------------------------------|
| **Solana**         | Blockchain for voting storage  |
| **Rust**           | Smart Contract (Solana Program)|
| **Next.js**        | Frontend UI                    |
| **TypeScript**     | Type-safe Frontend Code        |
| **Firebase**       | Email Verification Backend     |
| **Solana Web3.js** | Blockchain Interactions        |
| **Phantom Wallet** | User Authentication            |

---

## **Smart Contract (Rust)**
### **How It Works**
1.**Each candidate has an on-chain Solana account** that stores their vote count.
2.**Users vote by sending transactions** to the Solana program.
3.**The program checks the voter's identity & updates the vote count.**
4.**Frontend fetches real-time vote counts** from the blockchain.

**Installation & Setup**
1. Install Dependencies
git clone https://github.com/YOUR_USERNAME/solana-voting-dapp.git
cd solana-voting-dapp
npm install

2️ Start the Development Server
npm run dev

**Deploying the Solana Smart Contract**
1. Install Solana & Setup CLI
sh -c "$(curl -sSfL https://release.solana.com/stable/install)"
solana --version

2. Configure Devnet
solana config set --url https://api.devnet.solana.com

3. Build & Deploy the Smart Contract
cd programs/solana-voting-program
cargo build-sbf
solana program deploy ./target/deploy/solana_voting_program.so

**How to Use the App**
1. Connect Phantom Wallet
Click on "Connect Wallet" (Phantom required).
Approve the connection.
2. Verify Your Email
Enter your college email (@mjcollege.ac.in).
Receive a verification code and confirm.
3. Vote for a Candidate
Click "Vote" under your chosen candidate.
Approve the Solana transaction in Phantom.
4. View Live Results
Vote counts update automatically from the blockchain.

**Live Working**

https://github.com/user-attachments/assets/5b1a328e-2636-4563-bc01-4342135c11cb
