import Image from 'next/image'
import Link from 'next/link'
import React from 'react'
import styles from './index.module.css'

interface NFTCardProps {

}

const NFTCard: React.FC<NFTCardProps> = (props) => {
  const { } = props

  return <Link href={"/detail/100"}>
    <div className={styles.card}>
      {/* 先用背景图片替换 */}
      <div className={styles.nftImage}></div>
      <div className={styles.cardTitle}>
        <span className={styles.nftCollectionImage}></span>
        <span className={styles.nftName}>Rebel Bots</span>
      </div>
      <p className={styles.nftDesc}>short introduce about this NFT </p>
      <div>
        <span className={styles.nftNumber}>#9527</span>
        <span className={styles.nftChain}></span>
      </div>
    </div>
  </Link>
}

export default NFTCard