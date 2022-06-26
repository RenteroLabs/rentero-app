import Image from 'next/image'
import Link from 'next/link'
import React from 'react'
import styles from './index.module.scss'

interface NFTCardProps {
  nftInfo: Record<string, any>
  metadata: Record<string, any>
}

const NFTCard: React.FC<NFTCardProps> = (props) => {
  const { nftInfo, metadata } = props
  console.log(metadata, nftInfo)

  return <Link href={`/detail/${nftInfo.nftUid}?skuId=${nftInfo.skuId}`}  >
    <div className={styles.card}>
      {/* 先用背景图片替换 */}
      <div className={styles.nftImage}>
        {metadata && <Image src={metadata?.media[0]?.gateway} layout="fill" />}
      </div>
      <div className={styles.cardTitle}>
        <span className={styles.nftCollectionImage}>
          <Image src="https://tva1.sinaimg.cn/large/e6c9d24egy1h3lgqmbf5cj20u00u0q8u.jpg" layout="fill" />
        </span>
        <span className={styles.nftName}>{nftInfo.nftName}</span>
      </div>
      <p className={styles.nftDesc}>short introduce about this NFT </p>
      <div>
        <span className={styles.nftNumber}>#{nftInfo.nftUid}</span>
        <span className={styles.nftChain}></span>
      </div>
    </div>
  </Link>
}

export default NFTCard