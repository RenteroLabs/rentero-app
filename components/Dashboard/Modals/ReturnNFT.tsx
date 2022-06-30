import { Box, Stack, Typography } from '@mui/material'
import React, { useState } from 'react'
import { useAccount, useSigner, useContract } from 'wagmi'
import { ROPSTEN_MARKET, ROPSTEN_MARKET_ABI } from '../../../constants/contractABI'
import AppDialog from '../../Dialog'
import styles from './modal.module.scss'

interface ReturnNFTModalProps {
  trigger: React.ReactElement,
  orderId: number
}

const ReturnNFTModal: React.FC<ReturnNFTModalProps> = (props) => {
  const { trigger, orderId } = props
  const [showDialog, setShowDialog] = useState<boolean>(false)

  const { data: signer } = useSigner()

  const contractMarket = useContract({
    addressOrName: ROPSTEN_MARKET,
    contractInterface: ROPSTEN_MARKET_ABI,
    signerOrProvider: signer
  })

  const returnBorrowerNFT = async () => {
    try {
      await contractMarket.cancelOrderBorrow(orderId)
    } catch (err: any) {
      console.log(err.message)
    }
  }

  return <AppDialog
    title='Return NFT'
    trigger={trigger}
    hiddenDialog={showDialog}
  >
    <Box sx={{ p: '3.33rem', pt: '2.67rem' }}>
      <Typography className={styles.normalText}>Are you sure to return the NFT, once returned you won&#39;t be able to earn yields by using that anymore.</Typography>
      <Stack direction="row" spacing="3.33rem" sx={{ mt: '2.67rem' }}>
        <Box className={styles.primaryButton} onClick={returnBorrowerNFT}>Confirm</Box>
        <Box className={styles.defaultButton} onClick={() => setShowDialog(true)}>Cancel</Box>
      </Stack>
    </Box>
  </AppDialog>
}

export default ReturnNFTModal