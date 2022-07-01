import { Avatar, Box, Breadcrumbs, Paper, Stack, Typography } from "@mui/material";
import Link from "next/link";
import { useRouter } from "next/router";
import { NextPage } from "next/types";
import NavigateNextIcon from '@mui/icons-material/NavigateNext';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import styles from '../../styles/detail.module.scss'
import NFTCard from "../../components/NFTCard";
import ConnectWallet from "../../components/ConnectWallet";
import { useAccount } from "wagmi";
import { useAlchemyService, useIsMounted } from "../../hooks";
import classNames from "classnames/bind";
import RentNFTModal from "../../components/RentNFT/RentNFTModal";
import { useEffect, useState } from "react";
import { Ropsten_721_AXE_NFT } from "../../constants/contractABI";
import { useRequest } from "ahooks";
import { getMarketNFTList, getNFTDetail } from "../../services/market";
import { formatAddress } from "../../utils/format";
import { web3GetNFTMetadata } from "../../services/web3NFT";
import { CHAIN_ICON } from "../../constants";
import Head from "next/head";

const cx = classNames.bind(styles)

const Detail: NextPage = () => {
  const router = useRouter()
  const { data: account } = useAccount()
  const isMounted = useIsMounted()
  const [nftInfo, setNFTInfo] = useState<Record<string, any>>({})
  const [baseInfo, setBaseInfo] = useState<Record<string, any>>({})

  const [nftList, setNFTList] = useState<Record<string, any>[]>([])
  const [NFTMetadataList, setNFTMetadataList] = useState<Record<string, any>[]>([])

  const { id } = router.query

  useEffect(() => {
    fetchNFTDetail({ skuId: router.query['skuId'] });
    fetchNFTList({ pageIndex: 1, pageSize: 5 });

    (async () => {
      const result = await web3GetNFTMetadata({
        contractAddress: Ropsten_721_AXE_NFT,
        tokenId: id as string || '1',
        tokenType: 'erc721'
      })
      setNFTInfo(result as Record<string, any>)
    })()

  }, [id])

  const { run: fetchNFTDetail } = useRequest(getNFTDetail, {
    manual: true,
    onSuccess: ({ data }) => {
      setBaseInfo(data)
    }
  })

  const { run: fetchNFTList, loading } = useRequest(getMarketNFTList, {
    manual: true,
    onSuccess: async ({ data }) => {
      const { pageContent } = data
      const moreNFTs = pageContent.filter((item: any) => item.nftUid != id).splice(0, 4)
      setNFTList(moreNFTs)

      const metarequests = moreNFTs.map((item: any) => {
        return web3GetNFTMetadata({
          contractAddress: Ropsten_721_AXE_NFT || item.wrapNftAddress,
          tokenId: item.nftUid,
          tokenType: 'erc721'
        })
      })
      const result = await Promise.all(metarequests)
      let newMetaList: Record<number, any> = {}
      result.forEach((item: any, index: number) => {
        newMetaList[parseInt(pageContent[index].skuId)] = item
      })

      setNFTMetadataList({ ...NFTMetadataList, ...newMetaList })
    }
  })

  return <div>
    <Head>
      <title>NFT Detail | Rentero</title>
      <meta name="description" content="Lend and rent your NFTs | Rentero Protocol" />
    </Head>
    <Box className={styles.navBox}>
      <Breadcrumbs separator={<NavigateNextIcon fontSize="small" />}>
        <Link href={"/"}>Home</Link>
        <Link href={"/"}>Market</Link>
        <Typography >Detail</Typography>
      </Breadcrumbs>
    </Box>
    <Box sx={{ display: 'flex', justifyContent: 'center', marginTop: '4rem' }}>
      <Box className={styles.leftBox}>
        <Stack spacing="2rem">
          <Paper className={styles.itemCover} >
            {nftInfo?.media && <img src={nftInfo?.media[0]?.gateway} />}
            {baseInfo.status === 'Renting' && <Box component="span" >Rented</Box>}
          </Paper>
          <Paper className={styles.rentDetail}>
            <Typography>DAILY EARNING:</Typography>
            <Typography variant="h4" >100 SLP</Typography>
            <Typography>≈ 8.3 ~ 12.6 USD</Typography>
            <Typography className={styles.earnRatio}>RATIO OF PLAYER EARNINGS:</Typography>
            <Typography variant="h4" className={styles.earnRatioValue}>25%</Typography>
          </Paper>

          {/* 已出租 */}
          {baseInfo.status === 'Renting' && <Box
            className={cx({
              'rentButton': true,
              'rentedButton': true,
            })}
          >Rented</Box>}

          {baseInfo.status !== 'Renting' && (isMounted && account ?
            <RentNFTModal
              skuId={router.query['skuId'] as string}
              baseInfo={baseInfo}
              trigger={<Box
                className={cx({
                  'rentButton': true,
                  'rentedButton': false,
                })}
              >Rent</Box>} /> :
            <ConnectWallet trigger={<Box className={styles.rentButton}>Connect Wallet</Box>} />)}

        </Stack>
      </Box>

      <Box className={styles.rightBox} sx={{ marginLeft: '5.33rem', width: '60.83rem' }}>
        <Stack spacing="2rem">
          <Paper className={styles.rentNFTinfo}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <Avatar src="/rebel_logo.gif" variant="rounded" sx={{ width: '2.67rem', height: '2.67rem' }} />
                <span className={styles.nftCollectionName}>{baseInfo.nftName}</span>
              </Box>
              <span>#{baseInfo.nftUid}</span>
            </Box>
            <Typography variant="h2">{baseInfo.nftName} #{baseInfo.nftUid}</Typography>
            <Stack direction="row" spacing="4.83rem">
              <Box>Owned by <span className={styles.ownerAddress}>{formatAddress(baseInfo.lenderAddress, 6)}</span></Box>
              <Box sx={{ display: 'flex', alignItems: 'center' }}>Blockchain <span className={styles.deployedChainType}><Avatar alt='chain' src={CHAIN_ICON[1]} sx={{ width: '1.67rem', height: '1.67rem', mr: '0.67rem' }} /> ETH</span></Box>
            </Stack>
          </Paper>
          <Paper className={styles.rentNFTabout}>
            <Typography variant="h4">Detail</Typography>
            <Stack className={styles.detailList}>
              <Box>
                <Box>Contract Address</Box>
                <Box className={styles.linkAddress}>{formatAddress(baseInfo.nftAddress, 6)}</Box>
              </Box>
              <Box>
                <Box>Token ID</Box>
                <Box className={styles.linkAddress}>{baseInfo.nftUid}</Box>
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
          </Paper>
          <Paper className={styles.rentNFTproperties}>
            <Typography variant="h4">Properties</Typography>
            <Box sx={{ display: 'flex', flexWrap: 'wrap', justifyContent: "flex-start", mt: '1rem' }}>
              {
                nftInfo?.metadata?.attributes.map(({ value, trait_type }: any, index: number) => {
                  return <Stack className={styles.nftAttrCard} key={index}>
                    <Box>{trait_type}</Box>
                    <Box className={styles.attrValue}>{value}</Box>
                  </Stack>
                })
              }
            </Box>
          </Paper>
        </Stack>
      </Box>
    </Box>

    <Box maxWidth="94.66rem" margin="auto" marginTop="8.33rem">
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2.67rem' }} className={styles.moreNFTtitle}>
        <Typography variant="h3">More NFTs</Typography>
        <Link href="/"><Typography>More &nbsp;&nbsp;<ChevronRightIcon /></Typography></Link>
      </Box>
      <Stack direction="row" spacing="2rem">
        {
          nftList.map((item: any, index: number) => <NFTCard nftInfo={item} metadata={NFTMetadataList[parseInt(item.skuId)]} key={index} />)
        }
      </Stack>
    </Box>
  </div>
}

export default Detail