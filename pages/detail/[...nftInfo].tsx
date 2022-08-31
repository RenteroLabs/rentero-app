import { Box, Breadcrumbs, Fade, IconButton, Paper, Stack, Tooltip, Typography, useMediaQuery } from "@mui/material";
import Link from "next/link";
import { useRouter } from "next/router";
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import { useQuery, useLazyQuery } from '@apollo/client'
import styles from '../../styles/detail.module.scss'
import NFTCard from "../../components/NFTCard";
import ConnectWallet from "../../components/ConnectWallet";
import { etherscanBlockExplorers, useAccount } from "wagmi";
import { useCopyToClipboard, useIsMounted } from "../../hooks";
import RentNFTModal from "../../components/RentNFT/RentNFTModal";
import { PropsWithChildren, ReactElement, useEffect, useMemo, useState } from "react";
import { useRequest } from "ahooks";
import { getNFTInfo } from "../../services/market";
import { formatAddress } from "../../utils/format";
import { ADDRESS_TOKEN_MAP, CHAIN_NAME, NFT_COLLECTIONS, ZERO_ADDRESS } from "../../constants";
import Head from "next/head";
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import CheckIcon from '@mui/icons-material/Check';
import LaunchIcon from '@mui/icons-material/Launch';
import Layout2 from "../../components/layout2";
import { NextPageWithLayout } from "../_app";
import { GET_LEASES, GET_LEASE_INFO, GET_MORE_RECOMMENDED_FOUR } from "../../constants/documentNode";
import { LeaseItem } from "../../types";
import { BigNumber, utils } from "ethers";
import SkeletonNFTCard from "../../components/NFTCard/SkeletonNFTCard";

interface DetailCardBoxProps {
  title: React.ReactElement
}
const DetailCardBox: React.FC<PropsWithChildren<DetailCardBoxProps>> = (props) => {
  const { children, title } = props
  return <Paper
    className={styles.detailCardBox}
  >
    <Box className={styles.cardTitle}>{title}</Box>
    <Box className={styles.cardContent}>{children}</Box>
  </Paper>
}

const Detail: NextPageWithLayout = () => {
  const router = useRouter()
  const [, nftAddress, tokenId] = router.query.nftInfo as string[] || []

  const { isConnected, address } = useAccount()
  const isMounted = useIsMounted()
  const minMobileWidth = useMediaQuery("(max-width: 600px)")

  const [baseInfo, setBaseInfo] = useState<Record<string, any>>({})
  const [nftList, setNFTList] = useState<Record<string, any>[]>([])
  const [rentInfo, setRentInfo] = useState<LeaseItem>()
  const [metaInfo, setMetaInfo] = useState<Record<string, any>>({})

  const [_, copyAddress] = useCopyToClipboard()
  const [isCopyed, setIsCopyed] = useState<boolean>(false)
  const [isRenterCopyed, setRenterCopyed] = useState<boolean>(false)

  const contractBlockExplore = useMemo(() => {
    return `${etherscanBlockExplorers[CHAIN_NAME[3]]?.url}/address/${nftAddress}`
  }, [nftAddress])

  const nftStatus = useMemo(() => {
    const current = (Number(new Date) / 1000).toFixed()
    return (rentInfo?.expires || 0) > current ? 'renting' : 'lending'
  }, [rentInfo])

  const [getLeaseInfo, { refetch }] = useLazyQuery(GET_LEASE_INFO, {
    variables: { id: [nftAddress, tokenId].join('-') },
    onCompleted(data) {
      setRentInfo(data.lease)
    },
  })

  useQuery(GET_MORE_RECOMMENDED_FOUR, {
    variables: {
      nftAddress,
      tokenId,
      expires: (Number(new Date) / 1000).toFixed()
    },
    onCompleted(data) { setNFTList(data.leases) }
  })

  const { run: fetchNFTInfo } = useRequest(getNFTInfo, {
    manual: true,
    onSuccess: ({ data }) => { setMetaInfo(data) }
  })

  useEffect(() => {
    getLeaseInfo()
    if (nftAddress && tokenId) {
      fetchNFTInfo({ tokenId: parseInt(tokenId), contractAddress: nftAddress })
    }
  }, [nftAddress, tokenId])

  return <Box>
    <Head>
      <title>NFT Detail | Rentero</title>
      <meta name="description" content="Lend and rent your NFTs | Rentero Protocol" />
    </Head>
    {/* <Box className={styles.navBox}>
      <Breadcrumbs separator={<NavigateNextIcon fontSize="small" />}>
        <Link href={"/"}>Home</Link>
        <Link href={"/"}>Market</Link>
        <Typography >Detail</Typography>
      </Breadcrumbs>
    </Box> */}
    {isMounted && <Box className={styles.mainContentBox}>
      {/* left content */}
      <Box className={styles.leftBox}>
        <Stack spacing="1.67rem">
          <Paper className={styles.itemCover} >
            {(metaInfo?.imageUrl) && <img src={metaInfo?.imageUrl} />}
          </Paper>

          <DetailCardBox title={<Box>About {NFT_COLLECTIONS[nftAddress]}</Box>}>
            <Box className={styles.nftDesc}>
              {
                metaInfo?.metadata && (JSON.parse(metaInfo.metadata).description)
              }
              {metaInfo?.metadata && <a href={JSON.parse(metaInfo.metadata).external_link}>{JSON.parse(metaInfo.metadata).external_link}</a>}
            </Box>

          </DetailCardBox>

          <DetailCardBox
            title={<Box>Details</Box>}
          >
            <Stack className={styles.detailList}>
              <Box>
                <Box>Contract Address</Box>
                <a href={contractBlockExplore} target="_blank" rel="noreferrer">
                  <Box className={styles.linkAddress}>
                    {formatAddress(nftAddress, 4)}&nbsp;
                    <LaunchIcon />
                  </Box>
                </a>
              </Box>
              <Box>
                <Box>Token ID</Box>
                <Box className={styles.linkAddress}>{tokenId}</Box>
              </Box>
              <Box>
                <Box>Token Standard</Box>
                <Box>ERC-721</Box>
              </Box>
              <Box>
                <Box>Blockchain</Box>
                <Box>Ethereum</Box>
              </Box>
            </Stack>
          </DetailCardBox>
        </Stack>
      </Box>

      {/* right content */}
      <Box className={styles.rightBox} >
        <Stack spacing="1.67rem">
          <Paper className={styles.rentNFTinfo}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <span className={styles.nftCollectionName}>{NFT_COLLECTIONS[nftAddress]}</span>
              </Box>
              <Box className={styles.tagList}>
                {nftStatus === 'renting' &&
                  <Box component="span" className={styles.rentedTag}>Rented</Box>}
                {
                  rentInfo?.whitelist && rentInfo.whitelist != ZERO_ADDRESS &&
                  <Box component="span" className={styles.whitelistTag} >Whitelist</Box>
                }
              </Box>
            </Box>
            <Typography variant="h2">{NFT_COLLECTIONS[nftAddress]} #{rentInfo?.tokenId}</Typography>
            <Stack direction={minMobileWidth ? 'column' : 'row'} spacing={minMobileWidth ? '10px' : '4.83rem'} className={styles.addressInfo}>
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <Typography >Owner</Typography>
                <span className={styles.ownerAddress}>
                  {address?.toLowerCase() === rentInfo?.lender ? "You" : formatAddress(rentInfo?.lender, 4)}
                </span>
                {
                  isCopyed ?
                    <Tooltip title="Copyed">
                      <Fade in={true}>
                        <IconButton size="small"><CheckIcon color="success" fontSize="small" /></IconButton>
                      </Fade>
                    </Tooltip> :
                    <Tooltip title="Copy Address To Clipboard">
                      <Fade in={true}>
                        <IconButton
                          size="small"
                          onClick={() => {
                            copyAddress(rentInfo?.lender as string)
                            setIsCopyed(true)
                            setTimeout(() => setIsCopyed(false), 2500)
                          }}>
                          <ContentCopyIcon fontSize="small" sx={{ opacity: '0.8' }} />
                        </IconButton>
                      </Fade>
                    </Tooltip>
                }
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <Typography>Renter</Typography>
                {
                  rentInfo?.renter != ZERO_ADDRESS ?
                    <>
                      <span className={styles.ownerAddress}>
                        {address?.toLowerCase() === rentInfo?.renter ? "You" : formatAddress(rentInfo?.renter, 4)}
                      </span>
                      {
                        isRenterCopyed ?
                          <Tooltip title="Copyed">
                            <Fade in={true}>
                              <IconButton size="small"><CheckIcon color="success" fontSize="small" /></IconButton>
                            </Fade>
                          </Tooltip> :
                          <Tooltip title="Copy Address To Clipboard">
                            <Fade in={true}>
                              <IconButton
                                size="small"
                                onClick={() => {
                                  copyAddress(rentInfo?.renter || '')
                                  setRenterCopyed(true)
                                  setTimeout(() => setRenterCopyed(false), 2500)
                                }}>
                                <ContentCopyIcon fontSize="small" sx={{ opacity: '0.8' }} />
                              </IconButton>
                            </Fade>
                          </Tooltip>
                      }
                    </>
                    : <Box sx={{ marginLeft: '1rem' }}>-</Box>
                }
              </Box>
            </Stack>
          </Paper>

          <DetailCardBox
            title={<Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <Box>{baseInfo.mode === 'FreeTrial' ? 'Trial Period' : 'Rental Period'}</Box>
              <Box>{rentInfo ? `${rentInfo?.minRentalDays}-${rentInfo?.maxRentalDays}Days` : '-'}</Box>
            </Box>}
          >
            <Stack spacing="1.33rem" className={styles.rentInfoList}>
              {/* {
                baseInfo.mode === 'Dividend' &&
                <>
                  <Box><Box>Ratio To Renter</Box><Box>{baseInfo.borrowerEarnRatio}</Box></Box>
                  <Box><Box>Security Deposit</Box><Box>10</Box></Box>
                </>
              } */}
              {/* 租金模式 */}
              {/* {
                baseInfo.mode === 'Rent' && 
              } */}
              <Box>
                <Box>Deposit</Box>
                <Box>
                  {
                    rentInfo ? <>
                      <img src={ADDRESS_TOKEN_MAP[rentInfo?.erc20Address]?.logo} />
                      {utils.formatUnits(BigNumber.from(rentInfo?.deposit), ADDRESS_TOKEN_MAP[rentInfo?.erc20Address]?.decimal)}
                    </> : '-'
                  }
                </Box>
              </Box>
              <Box>
                <Box>Rent</Box>
                <Box>
                  {
                    rentInfo ? <>
                      <img src={ADDRESS_TOKEN_MAP[rentInfo?.erc20Address]?.logo} />
                      {utils.formatUnits(BigNumber.from(rentInfo?.rentPerDay), ADDRESS_TOKEN_MAP[rentInfo?.erc20Address]?.decimal)}/Day
                    </> : '-'
                  }
                </Box>
              </Box>
              {nftStatus === 'renting' &&
                <Box className={styles.rentedButton}>
                  {baseInfo.mode === 'FreeTrial' ? 'Trialed' : 'Rented'}
                </Box>}
              {
                nftStatus === 'lending' &&
                ((isMounted && !isConnected) ?
                  <ConnectWallet
                    trigger={<Box className={styles.rentButton}>Connect Wallet</Box>}
                    closeCallback={() => { }}
                  />
                  :
                  ([ZERO_ADDRESS, address?.toLowerCase()].includes(rentInfo?.whitelist) ?
                    <RentNFTModal
                      reloadInfo={refetch}
                      rentInfo={rentInfo || {} as LeaseItem}
                      trigger={<Box
                        className={
                          baseInfo.mode === 'FreeTrial' ?
                            styles.rentTrialButton :
                            styles.rentButton}>
                        {baseInfo.mode === 'FreeTrial' ? 'Trial' : 'Rent'}
                      </Box>} /> :
                    <Box className={styles.rentedButton}>
                      {baseInfo.mode === 'FreeTrial' ? 'Trial' : 'Rent'}
                    </Box>
                  ))
              }
            </Stack>
            {rentInfo?.whitelist !== ZERO_ADDRESS &&
              <Typography className={styles.whitelistButtonTip}>
                * This NFT is only for the whitelist user.
              </Typography>}
          </DetailCardBox>

          <DetailCardBox title={<Box>Status</Box>}>
            <Typography className={styles.cardSubtitle}>Attributes</Typography>
            <Stack className={styles.statusAttrList} spacing="1.33rem">
              {
                metaInfo?.metadata &&
                JSON.parse(metaInfo?.metadata).attributes.map(({ value, trait_type }: any, index: number) => <Box key={index}>
                  <Box>{trait_type}:</Box>
                  <Box className={styles.attrValue}>{value}</Box>
                </Box>
                )}
            </Stack>
          </DetailCardBox>
        </Stack>
      </Box>

      <Paper className={styles.itemCoverMobile} >
        {(metaInfo?.imageUrl) && <img src={metaInfo?.imageUrl} />}
      </Paper>
    </Box>}

    {isMounted && <Box className={styles.moreNFTCards} >
      <Box className={styles.moreNFTtitle}>
        <Typography variant="h3">More NFTs</Typography>
        <Link href="/"><Typography>More &nbsp;&nbsp;<ChevronRightIcon /></Typography></Link>
      </Box>
      <Box sx={{ overflowX: 'scroll' }}>
        {nftList && isMounted &&
          <Stack direction="row" className={styles.cardList} spacing="1rem">
            {
              nftList.map((item: any, index: number) =>
                <NFTCard nftInfo={item} key={index} />)
            }
            {
              nftList.length === 0 && <>
                <SkeletonNFTCard />
                <SkeletonNFTCard />
                <SkeletonNFTCard />
                <SkeletonNFTCard />
              </>
            }
          </Stack>}
      </Box>
    </Box>}
  </Box>
}

Detail.getLayout = function getLayout(page: ReactElement) {
  return (
    <Layout2>{page}</Layout2>
  )
}

export default Detail