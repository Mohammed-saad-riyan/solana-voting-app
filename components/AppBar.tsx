import { FC } from "react";
import styles from "../styles/Home.module.css";
import Image from "next/image";
import { WalletMultiButton } from "@solana/wallet-adapter-react-ui";

export const AppBar: FC = () => {
    return (
        <div className={styles.AppHeader}>
            <Image src="/solanaLogo.png" height={30} width={200} alt="Solana Logo" />
            <span className={styles.title}>Decentralized Voting App</span>
            <WalletMultiButton />
        </div>
    );
};
