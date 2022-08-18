import { Avatar, Box, Breadcrumbs, Fade, IconButton, Paper, Stack, Tooltip, Typography } from "@mui/material";
import Link from "next/link";
import { useRouter } from "next/router";
import { NextPage } from "next/types";
import NavigateNextIcon from '@mui/icons-material/NavigateNext';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import { useQuery, gql, useLazyQuery } from '@apollo/client'
import styles from '../../styles/detail.module.scss'
import NFTCard from "../../components/NFTCard";
import ConnectWallet from "../../components/ConnectWallet";
import { etherscanBlockExplorers, useAccount } from "wagmi";
import { useCopyToClipboard, useIsMounted } from "../../hooks";
import classNames from "classnames/bind";
import RentNFTModal from "../../components/RentNFT/RentNFTModal";
import { PropsWithChildren, ReactElement, useEffect, useMemo, useState } from "react";
import { useRequest } from "ahooks";
import { getMarketNFTList, getNFTDetail } from "../../services/market";
import { formatAddress } from "../../utils/format";
import { ADDRESS_TOKEN_MAP, CHAIN_ICON, CHAIN_NAME, ZERO_ADDRESS } from "../../constants";
import Head from "next/head";
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import CheckIcon from '@mui/icons-material/Check';
import LaunchIcon from '@mui/icons-material/Launch';
import Layout2 from "../../components/layout2";
import { NextPageWithLayout } from "../_app";
import { Ropsten_721_AXE_NFT } from "../../constants/contractABI";
import { GET_LEASES, GET_LEASE_INFO } from "../../constants/documentNode";
import { LeaseItem } from "../../types";
import { BigNumber, utils } from "ethers";

const cx = classNames.bind(styles)

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

  const [baseInfo, setBaseInfo] = useState<Record<string, any>>({})
  const [metadata, setMetadata] = useState<Record<string, any>>({})
  const [nftList, setNFTList] = useState<Record<string, any>[]>([])
  const [rentInfo, setRentInfo] = useState<LeaseItem>()

  const [_, copyAddress] = useCopyToClipboard()
  const [isCopyed, setIsCopyed] = useState<boolean>(false)
  const [isRenterCopyed, setRenterCopyed] = useState<boolean>(false)


  const contractBlockExplore = useMemo(() => {
    return `${etherscanBlockExplorers[CHAIN_NAME[3 | baseInfo.chainId]]?.url}/address/${baseInfo.nftAddress}`
  }, [baseInfo])


  const [getLeaseInfo, { loading }] = useLazyQuery(GET_LEASE_INFO, {
    variables: { id: [nftAddress, tokenId].join('-') },
    onCompleted(data) {
      setRentInfo(data.lease)
    },
  })

  const [getLeasesList, { loading: isLeasesLoading }] = useLazyQuery(GET_LEASES, {
    variables: {
      pageSize: 5,
      skip: 0
    },
    onCompleted(data) {
      setNFTList(data.leases.filter((item: any) => item.tokenId != tokenId).splice(0, 4))
    }
  })
  // const tokenInfo = useMemo(() => {
  //   if (rentInfo) {
  //     return ADDRESS_TOKEN_MAP[rentInfo.erc20Address]
  //   }
  // }, [rentInfo])

  useEffect(() => {
    getLeaseInfo()
    getLeasesList()
  }, [])

  const { run: fetchNFTDetail } = useRequest(getNFTDetail, {
    manual: true,
    onSuccess: ({ data }) => {
      setBaseInfo(data)
      try {
        setMetadata(JSON.parse(data.metadata))
      } catch (err) {
        console.error(err)
      }
    }
  })

  // // 获取相关推荐 NFT
  // const { run: fetchNFTList } = useRequest(getMarketNFTList, {
  //   manual: true,
  //   onSuccess: async ({ data }) => {
  //     const { pageContent } = data
  //     const moreNFTs = pageContent.filter((item: any) => item.nftUid != tokenId).splice(0, 4)
  //     setNFTList(moreNFTs)
  //   }
  // })

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
    <Box className={styles.mainContentBox}>
      {/* left content */}
      <Box className={styles.leftBox}>
        <Stack spacing="1.67rem">
          <Paper className={styles.itemCover} >
            {(baseInfo.imageUrl) && <img src={baseInfo.imageUrl} />}
          </Paper>

          <DetailCardBox title={<Box>About {baseInfo.nftName}</Box>}>
            NFT Collection introduction
          </DetailCardBox>

          <DetailCardBox
            title={<Box>Details</Box>}
          >
            <Stack className={styles.detailList}>
              <Box>
                <Box>Contract Address</Box>
                <a href={contractBlockExplore} target="_blank" rel="noreferrer">
                  <Box className={styles.linkAddress}>
                    {formatAddress(rentInfo?.nftAddress, 4)}&nbsp;
                    <LaunchIcon />
                  </Box>
                </a>
              </Box>
              <Box>
                <Box>Token ID</Box>
                <Box className={styles.linkAddress}>{rentInfo?.tokenId}</Box>
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
                <span className={styles.nftCollectionName}>{baseInfo.nftName}</span>
              </Box>
              <Box className={styles.tagList}>
                {rentInfo?.status === 'renting' &&
                  <Box component="span" className={styles.rentedTag}>Rented</Box>}
                {
                  rentInfo?.whitelist && rentInfo.whitelist != ZERO_ADDRESS &&
                  <Box component="span" className={styles.whitelistTag} >Whitelist</Box>
                }
              </Box>
            </Box>
            <Typography variant="h2">{baseInfo.nftName} #{rentInfo?.tokenId}</Typography>
            <Stack direction="row" spacing="4.83rem" className={styles.addressInfo}>
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <Typography >Owned</Typography>
                <span className={styles.ownerAddress}>
                  {formatAddress(rentInfo?.lender, 4)}
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
                            copyAddress(baseInfo.lenderAddress)
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
                  rentInfo?.renter ?
                    <>
                      <span className={styles.ownerAddress}>
                        {formatAddress(rentInfo?.renter, 4)}
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
                                  copyAddress(rentInfo?.renter)
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
              <Box>{baseInfo.mode === 'FreeTrial' ? '15' : `${rentInfo?.minRentalPeriods}-${rentInfo?.maxRentalPeriods}`} Days</Box>
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
              {rentInfo?.status === 'renting' &&
                <Box className={styles.rentedButton}>
                  {baseInfo.mode === 'FreeTrial' ? 'Trialed' : 'Rented'}
                </Box>}
              {
                (rentInfo?.status !== 'renting' && isMounted && !isConnected) ?
                  <ConnectWallet
                    trigger={<Box className={styles.rentButton}>Connect Wallet</Box>}
                    closeCallback={() => { }}
                  />
                  :
                  ([ZERO_ADDRESS, address?.toLowerCase()].includes(rentInfo?.whitelist) ?
                    <RentNFTModal
                      reloadInfo={() => { fetchNFTDetail({ skuId: router.query['skuId'] }) }}
                      skuId={tokenId}
                      baseInfo={baseInfo}
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
                  )
              }
            </Stack>
            {rentInfo?.whitelist !== ZERO_ADDRESS &&
              <Typography className={styles.whitelistButtonTip}>
                * This NFT is only for the whitelist user.
              </Typography>}
          </DetailCardBox>

          <DetailCardBox title={<Box>Status</Box>}>
            <Box sx={{ display: 'flex', flexWrap: 'wrap', justifyContent: "flex-start" }}>
              {
                metadata?.attributes?.map(({ value, trait_type }: any, index: number) => {
                  return <Stack className={styles.nftAttrCard} key={index}>
                    <Box>{trait_type}</Box>
                    <Box className={styles.attrValue}>{value}</Box>
                  </Stack>
                })
              }
            </Box>
          </DetailCardBox>
        </Stack>
      </Box>

      <Paper className={styles.itemCoverMobile} >
        {(baseInfo.imageUrl) && <img src={baseInfo.imageUrl} />}
      </Paper>
    </Box>

    <Box className={styles.moreNFTCards} >
      <Box className={styles.moreNFTtitle}>
        <Typography variant="h3">More NFTs</Typography>
        <Link href="/"><Typography>More &nbsp;&nbsp;<ChevronRightIcon /></Typography></Link>
      </Box>
      <Box sx={{ overflowX: 'scroll' }}>
        <Stack direction="row" className={styles.cardList} >
          {
            nftList.map((item: any, index: number) =>
              <NFTCard nftInfo={item} key={index} />)
          }
        </Stack>
      </Box>
    </Box>
  </Box>
}

Detail.getLayout = function getLayout(page: ReactElement) {
  return (
    <Layout2>{page}</Layout2>
  )
}

export default Detail