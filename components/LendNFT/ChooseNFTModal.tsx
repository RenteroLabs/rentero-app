import { Box, Grid, Stack, Typography } from '@mui/material'
import React, { useEffect, useMemo, useState } from 'react'
import { useAccount, useContractRead, useNetwork } from 'wagmi'
import { createAlchemyWeb3 } from "@alch/alchemy-web3";
import { Rss3WhitePaper, Rss3WhitePaperABI } from '../../constants/contractABI'
import AppDialog from '../Dialog'
import NFTCard from '../IntegrationCard/NFTCard'
import styles from './style.module.scss'
import { ALCHEMY_ETHEREUM_URL, ALCHEMY_POLYGON_URL } from '../../constants';

interface ChooseNFTModalProps {
  trigger: React.ReactElement
  gameName: string
  NFTCollectionAddress: string
}

const formatNFTdata = (nftList: any[]) => {
  return nftList.map((item) => ({
    nftName: item.title,
    nftImage: item.media?.[0]?.gateway,
    nftNumber: parseInt(item.id.tokenId),
  }))
}

const ChooseNFTModal: React.FC<ChooseNFTModalProps> = (props) => {
  const { trigger, gameName, NFTCollectionAddress } = props
  const [selectedNFT, setSelectedNFT] = useState<string>('')
  const [hiddenModal, setHiddenModal] = useState<boolean>(false)
  const { activeChain } = useNetwork()
  const { data: account } = useAccount()
  const [NFTList, setNFTList] = useState<any[]>([])

  const Web3 = useMemo(() => {
    let archemyUrl
    switch (activeChain?.id) {
      case 1: archemyUrl = ALCHEMY_ETHEREUM_URL; break;
      case 137: archemyUrl = ALCHEMY_POLYGON_URL; break;
      default: return;
    }
    return createAlchemyWeb3(archemyUrl)
  }, [activeChain])

  useEffect(() => {
    (async () => {
      if (!Web3 || !account) {
        setNFTList([])
      } else {
        // https://docs.alchemy.com/alchemy/enhanced-apis/nft-api/getnfts
        const nft = await Web3.alchemy.getNfts({
          owner: account.address,
          contractAddresses: [NFTCollectionAddress]
        })
        setNFTList(formatNFTdata(nft.ownedNfts))
      }
    })()
  }, [Web3, account])

  return <AppDialog
    trigger={trigger}
    title="Choose NFT to deposit"
    hiddenDialog={hiddenModal}
  >
    <Box width="95rem">
      <Grid
        container
        rowSpacing="2.67rem"
        columnSpacing="2.5rem"
        sx={{ p: '3.33rem', maxHeight: '46.66rem', overflowY: 'scroll' }} >
        <Grid item xs={12}>
          <Typography variant="h3" sx={{ fontSize: '2rem', lineHeight: '2.67rem' }} >{gameName}</Typography>
        </Grid>
        {
          NFTList && NFTList.map((item, index) => <Grid key={index} item xs="auto">
            <NFTCard {...item} selectedNFT={selectedNFT} setSelectedNFT={setSelectedNFT} />
          </Grid>)
        }
      </Grid>
    </Box>
    <Box>
      {selectedNFT && <Typography className={styles.selectedMessage}>#{selectedNFT} have been selected</Typography>}
      <Stack direction="row" justifyContent="center" spacing="3.33rem" mb="1.33rem" mt="1.33rem">
        <Box className={styles.defaultButton} onClick={() => setHiddenModal(true)}>Cancel</Box>
        <Box className={styles.primaryButton}>Confirm</Box>
      </Stack>
    </Box>
  </AppDialog>
}

export default ChooseNFTModal