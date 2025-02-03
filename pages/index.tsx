import { NextPage } from "next";
import styles from "../styles/Home.module.css";
import WalletContextProvider from "../components/WalletContextProvider";
import { AppBar } from "../components/AppBar";
import Head from "next/head";
import { VotingCards } from "../components/VotingCards";

const Home: NextPage = props => {
  return (
    <div className={styles.App}>
      <Head>
        <title>Crypto Ballet</title>
        <meta name="description" content="Crypto Ballet" />
      </Head>
      <WalletContextProvider>
        <AppBar />
        <div className={styles.AppBody}>
          <VotingCards />
        </div>
      </WalletContextProvider>
      <div className={styles.AppBody}>
        <h1></h1>
      </div>
    </div>
  );
};

export default Home;