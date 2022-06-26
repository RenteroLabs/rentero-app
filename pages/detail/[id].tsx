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
import { getNFTDetail } from "../../services/market";
import { formatAddress } from "../../utils/format";

const cx = classNames.bind(styles)

const Detail: NextPage = () => {
  const router = useRouter()
  const { data: account } = useAccount()
  const isMounted = useIsMounted()
  const [nftInfo, setNFTInfo] = useState<Record<string, any>>({})
  const [baseInfo, setBaseInfo] = useState<Record<string, any>>({})
  const Web3 = useAlchemyService()

  const { id } = router.query

  useEffect(() => {
    fetchNFTList({ skuId: router.query['skuId'] });

    (async () => {
      // 获取 NFT metadata 数据
      const result = await Web3?.alchemy.getNftMetadata({
        // 此处在此直接请求 ERC721 合约地址
        contractAddress: Ropsten_721_AXE_NFT,
        tokenId: id || 1,
        tokenType: 'erc721'
      })
      console.log(result)
      setNFTInfo(result)
    })()

  }, [id])
  console.log(nftInfo)
  const { run: fetchNFTList } = useRequest(getNFTDetail, {
    manual: true,
    onSuccess: ({ data }) => {
      console.log(data)
      setBaseInfo(data)
    }
  })

  return <div>
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
            <img src={nftInfo?.media && nftInfo?.media[0]?.gateway} />
            {/* <Box component="span" >Rented</Box> */}
          </Paper>
          <Paper className={styles.rentDetail}>
            <Typography>DAILY EARNING:</Typography>
            <Typography variant="h4" >100 SLP</Typography>
            <Typography>≈ 8.3 ~ 12.6 USD</Typography>
            <Typography className={styles.earnRatio}>RATIO OF PLAYER EARNINGS:</Typography>
            <Typography variant="h4" className={styles.earnRatioValue}>25%</Typography>
          </Paper>

          {isMounted && account ?
            <RentNFTModal
              skuId={router.query['skuId']}
              trigger={<Box
                className={cx({
                  'rentButton': true,
                  // TODO: checkout current NFT if rented
                  'rentedButton': false,
                })}
              >Rent</Box>} /> :
            <ConnectWallet trigger={<Box className={styles.rentButton}>Connect Wallet</Box>} />}
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
              <span>Owned by <span className={styles.ownerAddress}>{formatAddress(baseInfo.lenderAddress, 6)}</span></span>
              <span>Blockchain <span className={styles.deployedChainType}>ETH</span></span>
            </Stack>
          </Paper>
          <Paper className={styles.rentNFTabout}>
            <Typography variant="h4">About</Typography>
          </Paper>
          <Paper className={styles.rentNFTproperties}>
            <Typography variant="h4">Properties</Typography>
            <Box sx={{ display: 'flex', flexWrap: 'wrap', justifyContent: "space-around", mt: '1rem' }}>
              {
                nftInfo?.metadata?.attributes.map(({ value, trait_type }: any) => {
                  return <Stack className={styles.nftAttrCard}>
                    <Box>{trait_type}</Box>
                    <Box>{value}</Box>
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
        <Typography>More &nbsp;&nbsp;<ChevronRightIcon /></Typography>
      </Box>
      <Stack direction="row" spacing="2rem">
        <NFTCard nftInfo={{}} />
        <NFTCard nftInfo={{}} />
        <NFTCard nftInfo={{}} />
        <NFTCard nftInfo={{}} />
      </Stack>
    </Box>
  </div>
}

export default Detail