import { Avatar, Box, Collapse, Stack, Typography } from '@mui/material'
import Image from 'next/image'
import Link from 'next/link'
import React from 'react'
import NFT_RENTED from '../../public/nft_rented.png'
import { CHAIN_ICON, ZERO_ADDRESS } from '../../constants'
import styles from './index.module.scss'

interface NFTCardProps {
  nftInfo: Record<string, any>
  mode?: '@split' | '@trial' | '@lease', // @split: 分成模式 | @trial: 试玩模式 | @lease: 租金模式
}

const NFTCard: React.FC<NFTCardProps> = (props) => {
  const { nftInfo, mode = '@split' } = props


  const handleRentNow = (e: React.MouseEvent) => {
    e.stopPropagation()
  }

  return <Link href={`/detail/${nftInfo.nftUid}?skuId=${nftInfo.skuId}`}  >
    <Box className={`${styles.card} ${mode === '@trial' && styles.cardTrialBackground}`}>
      <Box className={styles.nftImage}>
        {nftInfo.imageUrl &&
          <Image src={nftInfo.imageUrl} layout="fill" />}
        {nftInfo.status === 'Renting' &&
          <Box className={styles.imageCover}>
            <Stack direction="column" className={styles.lockCoverInfo}>
              <Image src={NFT_RENTED} alt="NFT RENTED" className={styles.lockIcon} />
              <Typography>Rented</Typography>
              <Box className={styles.unlockTime}>10-12-2022 Available</Box>
            </Stack>
          </Box>}
        {nftInfo.status === 'Active' &&
          <Box className={styles.imageCoverAttr}>
            <Stack direction="column" className={styles.attrList}>
              <Box>Attr1: Fire</Box>
            </Stack>
          </Box>
        }
        <Box className={styles.tagList}>
          {
            nftInfo.whiteAddress != ZERO_ADDRESS &&
            <Box component="span" className={styles.whitelistTag} >Whitelist</Box>
          }
        </Box>
      </Box>
      <Box className={styles.cardTitle}>
        <Box className={styles.nftName}>{nftInfo.nftName}</Box>
        <Box className={styles.nftNumber}>#{nftInfo.nftUid}</Box>
      </Box>
      {
        mode === '@trial' ? <Box className={styles.trialDayTag}>7 Days Trial</Box> :
          <>
            <Box className={styles.rentMode}>
              <Box>Ratio To Renter</Box>
              <Box>30%</Box>
            </Box>
            <Box className={styles.rentInfo}>
              <Box>Rent</Box>
              <Box>100/Day</Box>
            </Box>
          </>
      }
      {nftInfo.status === 'Active' && mode !== '@trial' &&
        <Box className={styles.rentButton} onClick={handleRentNow} >
          Rent
        </Box>
      }
    </Box>
  </Link>
}

export default NFTCard