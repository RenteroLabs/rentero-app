import { Box, Stack, Typography, useMediaQuery } from '@mui/material'
import Image from 'next/image'
import Link from 'next/link'
import React, { useEffect, useMemo, useState } from 'react'
import NFT_RENTED from '../../public/nft_rented.png'
import { ADDRESS_TOKEN_MAP, AVAILABEL_DATE_FORMAT, NFT_COLLECTIONS, ZERO_ADDRESS } from '../../constants'
import styles from './index.module.scss'
import classNames from 'classnames/bind'
import { dateFormat } from "../../utils/format"
import { LeaseItem } from '../../types'
import { BigNumber, utils } from 'ethers'
import { getNFTInfo } from '../../services/market'
import { useRequest } from 'ahooks'

const cx = classNames.bind(styles)

interface NFTCardProps {
  nftInfo: LeaseItem
  mode?: '@split' | '@trial' | '@lease', // @split: 分成模式 | @trial: 试玩模式 | @lease: 租金模式
}

const NFTCard: React.FC<NFTCardProps> = (props) => {
  const { nftInfo, mode = '@lease' } = props
  const [metaInfo, setMetaInfo] = useState<Record<string, any>>({})
  const [attrList, setAttrList] = useState<Record<string, any>[]>([])
  const minMobileWidth = useMediaQuery("(max-width: 600px)")

  const nftStatus = useMemo(() => {
    const current = (Number(new Date) / 1000).toFixed()
    return nftInfo.expires > current ? 'renting' : 'lending'
  }, [nftInfo])

  const { run: fetchNFTInfo } = useRequest(getNFTInfo, {
    manual: true,
    onSuccess: ({ data }) => {
      setMetaInfo(data)
      let attrs = []
      try {
        if (data?.metadata) {
          attrs = JSON.parse(data.metadata)?.attributes || []
        }
      } catch (err) {
        console.error(err)
      }
      setAttrList(attrs)
    }
  })

  useEffect(() => {
    fetchNFTInfo({ tokenId: parseInt(nftInfo.tokenId), contractAddress: nftInfo.nftAddress })
  }, [])


  const handleRentNow = (e: React.MouseEvent) => {
    e.stopPropagation()
  }

  // detail page path: /detail/<network>/<contractAddress>/<tokenId>
  return <Link href={`/detail/main/${nftInfo.nftAddress}/${nftInfo.tokenId}`}  >
    <Box
      className={cx({ "card": true, "cardTrialBackground": mode === '@trial' })}
    >
      <Box className={styles.nftImage}>
        {metaInfo?.imageUrl &&
          <Image src={metaInfo?.imageUrl} layout="fill" />}
        {nftStatus === 'renting' &&
          <Box className={styles.imageCover}>
            <Stack direction="column" className={styles.lockCoverInfo}>
              <Image src={NFT_RENTED} alt="NFT RENTED" className={styles.lockIcon} />
              <Typography>Rented</Typography>
              <Box className={styles.unlockTime}>{dateFormat("mm-dd-YYYY", new Date(parseInt(nftInfo.expires) * 1000))} Available</Box>
            </Stack>
          </Box>}
        {nftStatus === 'lending' &&
          <Box className={styles.imageCoverAttr}>
            <Stack direction="column" className={styles.attrList}>
              {
                attrList.map((item, index) => <Box key={index} className={styles.attrItem}>
                  <span>{item.trait_type}:</span>
                  <span className={styles.attrItemValue}>{item.value}</span>
                </Box>)
              }
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
        <Box className={styles.nftName}>{NFT_COLLECTIONS[nftInfo.nftAddress]}</Box>
        <Box className={styles.nftNumber}>#{nftInfo.tokenId}</Box>
      </Box>
      {
        mode === '@trial' ? <Box className={styles.trialDayTag}>7 Days Trial</Box> :
          <>
            <Box className={styles.rentMode}>
              {
                mode === '@lease' ? <>
                  <Box>{!minMobileWidth && "Rental "}Period</Box>
                  <Box>{nftInfo.minRentalDays}-{nftInfo.maxRentalDays} Days</Box>
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
        {nftStatus === 'lending' && mode !== '@trial' && !minMobileWidth &&
          < Box className={styles.rentButton} onClick={handleRentNow} >
            Rent
          </Box>
        }
      </Box>
    </Box>
  </Link >
}

export default NFTCard