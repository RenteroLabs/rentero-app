import type { NextPage } from 'next'
import Head from 'next/head'
import Image from 'next/image'
import styles from '../styles/Home.module.scss'
import NFTCard from '../components/NFTCard'
import Link from 'next/link'

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
        <Link href={"/detail/33"}><div className={styles.listTitle}>111 Items</div></Link>
        <div className={styles.nftCardList}>
          <NFTCard />
          <NFTCard />
          <NFTCard />
          <NFTCard />
          <NFTCard />
          <NFTCard />
          <NFTCard />
          <NFTCard />
        </div>
        <div className={styles.showMore}>Show more</div>
      </div>
    </div>
  )
}

export default Home
