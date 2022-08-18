import { Avatar, Box, Collapse, Stack, Typography, useMediaQuery } from '@mui/material'
import Image from 'next/image'
import Link from 'next/link'
import React from 'react'
import NFT_RENTED from '../../public/nft_rented.png'
import { ADDRESS_TOKEN_MAP, CHAIN_ICON, ZERO_ADDRESS } from '../../constants'
import styles from './index.module.scss'
import classNames from 'classnames/bind'
import { LeaseItem } from '../../types'
import { BigNumber, utils } from 'ethers'

const cx = classNames.bind(styles)

interface NFTCardProps {
  nftInfo: LeaseItem
  mode?: '@split' | '@trial' | '@lease', // @split: 分成模式 | @trial: 试玩模式 | @lease: 租金模式
}

const NFTCard: React.FC<NFTCardProps> = (props) => {
  const { nftInfo, mode = '@lease' } = props
  const minMobileWidth = useMediaQuery("(max-width: 426px)")

  const handleRentNow = (e: React.MouseEvent) => {
    e.stopPropagation()
  }

  // detail page path: /detail/<network>/<contractAddress>/<tokenId>
  return <Link href={`/detail/main/${nftInfo.nftAddress}/${nftInfo.tokenId}`}  >
    <Box
      className={cx({ "card": true, "cardTrialBackground": mode === '@trial' })}
    >
      <Box className={styles.nftImage}>
        {nftInfo.imageUrl &&
          <Image src={nftInfo.imageUrl} layout="fill" />}
        {nftInfo.status === 'renting' &&
          <Box className={styles.imageCover}>
            <Stack direction="column" className={styles.lockCoverInfo}>
              <Image src={NFT_RENTED} alt="NFT RENTED" className={styles.lockIcon} />
              <Typography>Rented</Typography>
              <Box className={styles.unlockTime}>10-12-2022 Available</Box>
            </Stack>
          </Box>}
        {nftInfo.status === 'lending' &&
          <Box className={styles.imageCoverAttr}>
            <Stack direction="column" className={styles.attrList}>
              <Box>Attr1: Fire</Box>
            </Stack>
          </Box>
        }
        <Box className={styles.tagList}>
          {
            nftInfo.whitelist != ZERO_ADDRESS &&
            <Box component="span" className={styles.whitelistTag} >Whitelist</Box>
          }
        </Box>
      </Box>
      <Box className={styles.cardTitle}>
        <Box className={styles.nftName}>{nftInfo.nftName}</Box>
        <Box className={styles.nftNumber}>#{nftInfo.tokenId}</Box>
      </Box>
      {
        mode === '@trial' ? <Box className={styles.trialDayTag}>7 Days Trial</Box> :
          <>
            <Box className={styles.rentMode}>
              {
                mode === '@lease' ? <>
                  <Box>{!minMobileWidth && "Rental "}Period</Box>
                  <Box>{nftInfo.minRentalPeriods}-{nftInfo.maxRentalPeriods} Days</Box>
                </> : <>
                  <Box>{!minMobileWidth && "Ratio To "}Renter</Box>
                  <Box>30%</Box>
                </>
              }
            </Box>
            <Box className={styles.rentInfo}>
              <Box>Rent</Box>
              <Box sx={{ display: 'inline-flex', alignItems: 'center' }}>
                <img src={ADDRESS_TOKEN_MAP[nftInfo?.erc20Address]?.logo} />
                <Box>
                  {utils.formatUnits(BigNumber.from(nftInfo?.rentPerDay), ADDRESS_TOKEN_MAP[nftInfo?.erc20Address]?.decimal)}
                  /Day
                </Box>
              </Box>
            </Box>
          </>
      }
      <Box className={styles.rentButtonBox} >
        {nftInfo.status === 'lending' && mode !== '@trial' &&
          <Box className={styles.rentButton} onClick={handleRentNow} >
            Rent
          </Box>
        }
      </Box>
    </Box>
  </Link>
}

export default NFTCard