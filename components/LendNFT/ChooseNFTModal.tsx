import { Box, Grid, Stack, Typography } from '@mui/material'
import React, { useState } from 'react'
import AppDialog from '../Dialog'
import NFTCard from '../IntegrationCard/NFTCard'
import styles from './style.module.scss'

interface ChooseNFTModalProps {
  trigger: React.ReactElement
  gameName: string
  NFTCollectionAddress: string
}

const NFTList = [
  {
    nftName: 'NextGame',
    nftImage: 'https://tva1.sinaimg.cn/large/e6c9d24egy1h3a3l1m420j20go0gomyz.jpg',
    nftNumber: '321124',
  }, {
    nftName: 'NextGame',
    nftImage: 'https://tva1.sinaimg.cn/large/e6c9d24egy1h3a3mfh78wj20go0gowfg.jpg',
    nftNumber: '321125',
  }, {
    nftName: 'NextGame',
    nftImage: 'https://tva1.sinaimg.cn/large/e6c9d24egy1h3a3mh98psj20go0go75q.jpg',
    nftNumber: '321126',
  }, {
    nftName: 'NextGame',
    nftImage: 'https://tva1.sinaimg.cn/large/e6c9d24egy1h3a3p0k82fj20go0godh6.jpg',
    nftNumber: '321127',
  },
]

const ChooseNFTModal: React.FC<ChooseNFTModalProps> = (props) => {
  const { trigger, gameName, NFTCollectionAddress } = props
  const [selectedNFT, setSelectedNFT] = useState<string>('')

  return <AppDialog
    trigger={trigger}
    title="Choose NFT to deposit"
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
          NFTList.map((item, index) => <Grid key={index} item xs="auto">
            <NFTCard {...item} selectedNFT={selectedNFT} setSelectedNFT={setSelectedNFT} />
          </Grid>)
        }
      </Grid>
    </Box>
    <Box>
      {selectedNFT && <Typography className={styles.selectedMessage}>#{selectedNFT} have been selected</Typography>}
      <Stack direction="row" justifyContent="center" spacing="3.33rem" mb="1.33rem" mt="1.33rem">
        <Box className={styles.defaultButton}>Cancel</Box>
        <Box className={styles.primaryButton}>Confirm</Box>
      </Stack>
    </Box>
  </AppDialog>
}

export default ChooseNFTModal