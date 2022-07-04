import { Avatar } from '@mui/material'
import Image from 'next/image'
import Link from 'next/link'
import React from 'react'
import { CHAIN_ICON } from '../../constants'
import styles from './index.module.scss'

interface NFTCardProps {
  nftInfo: Record<string, any>
  metadata: Record<string, any>
}

const NFTCard: React.FC<NFTCardProps> = (props) => {
  const { nftInfo, metadata } = props

  return <Link href={`/detail/${nftInfo.nftUid}?skuId=${nftInfo.skuId}`}  >
    <div className={styles.card}>
      {/* 先用背景图片替换 */}
      <div className={styles.nftImage}>
        {metadata && metadata?.media && metadata?.media[0]?.gateway && <Image src={metadata?.media[0]?.gateway} layout="fill" />}
      </div>
      <div className={styles.cardTitle}>
        <span className={styles.nftCollectionImage}>
          <Image src="https://tva1.sinaimg.cn/large/e6c9d24egy1h3lgqmbf5cj20u00u0q8u.jpg" layout="fill" />
        </span>
        <span className={styles.nftName}>{nftInfo.nftName}</span>
      </div>
      <p className={styles.nftDesc}>short introduce about this NFT </p>
      <div className={styles.nftChainInfo}>
        <span className={styles.nftNumber}>#{nftInfo.nftUid}</span>
        <span className={styles.nftChain}><Avatar alt='chain' src={CHAIN_ICON[1]} sx={{ width: '1.67rem', height: '1.67rem' }} /></span>
      </div>
    </div>
  </Link>
}

export default NFTCard