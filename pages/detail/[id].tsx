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
import { useIsMounted } from "../../hooks";
import classNames from "classnames/bind";
import RentNFTModal from "../../components/RentNFT/RentNFTModal";

const cx = classNames.bind(styles)

const Detail: NextPage = () => {
  const router = useRouter()
  const { data: account } = useAccount()
  const isMounted = useIsMounted()

  const { id } = router.query

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
            <img src="/rebelbot_08949.png" />
            <Box component="span" >Rented</Box>
          </Paper>
          <Paper className={styles.rentDetail}>
            <Typography>DAILY EARNING:</Typography>
            <Typography variant="h4" >100 SLP</Typography>
            <Typography>≈ 8.3 ~ 12.6 USD</Typography>
            <Typography className={styles.earnRatio}>RATIO OF PLAYER EARNINGS:</Typography>
            <Typography variant="h4" className={styles.earnRatioValue}>25%</Typography>
          </Paper>

          {isMounted && account ?
            <RentNFTModal trigger={<Box
              className={cx({
                'rentButton': true,
                // TODO: checkout current NFT if rented
                'rentedButton': false,
              })}
            >Rent</Box>} /> :
            <ConnectWallet trigger={<Box className={styles.rentButton}>Connect Wallet</Box>} />}
        </Stack>
      </Box>
      <Box className={styles.rightBox} sx={{ marginLeft: '5.33rem' }}>
        <Stack spacing="2rem">
          <Paper className={styles.rentNFTinfo}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <Avatar src="/rebel_logo.gif" variant="rounded" sx={{ width: '2.67rem', height: '2.67rem' }} />
                <span className={styles.nftCollectionName}>Rebel Bots</span>
              </Box>
              <span>#228933</span>
            </Box>
            <Typography variant="h2">RebelBot #02341</Typography>
            <Stack direction="row" spacing="4.83rem">
              <span>Owned by <span className={styles.ownerAddress}>Ox8s2e...ds23</span></span>
              <span>Blockchain <span className={styles.deployedChainType}>ETH</span></span>
            </Stack>
          </Paper>
          <Paper className={styles.rentNFTabout}>
            <Typography variant="h4">About</Typography>
          </Paper>
          <Paper className={styles.rentNFTproperties}>
            <Typography variant="h4">Properties</Typography>
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
        <NFTCard />
        <NFTCard />
        <NFTCard />
        <NFTCard />
      </Stack>
    </Box>
  </div>
}

export default Detail