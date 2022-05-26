import type { NextPage } from 'next'
import Head from 'next/head'
import Image from 'next/image'
import styles from '../styles/Home.module.css'
import NFTCard from '../components/NFTCard'

const Home: NextPage = () => {
  return (
    <div className={styles.container}>
      <Head>
        <title>Market | Rentero</title>
        <meta name="description" content="Lend and rent your NFTs" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <div className={styles.leftNav}>

      </div>
      <div className={styles.contentBox}>
        <section className={styles.introductCard}>

        </section>
        <div className={styles.listTitle}>111 Items</div>
        <div className={styles.nftCardList}>
          <NFTCard />
          <NFTCard />
          <NFTCard />
          <NFTCard />
          <NFTCard />
          <NFTCard />
          <NFTCard />
          <NFTCard />
          <NFTCard />
        </div>
      </div>
    </div>
  )
}

export default Home
