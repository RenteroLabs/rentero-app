import { Alert, Box, CircularProgress, Stack, Typography } from '@mui/material'
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
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [txError, setTxError] = useState<string>('')

  const { data: signer } = useSigner()

  const contractMarket = useContract({
    addressOrName: ROPSTEN_MARKET,
    contractInterface: ROPSTEN_MARKET_ABI,
    signerOrProvider: signer
  })

  const returnBorrowerNFT = async () => {
    setIsLoading(true)
    setTxError('')
    try {
      await contractMarket.cancelOrderBorrow(orderId)
      hiddenAppDialog()
    } catch (err: any) {
      setTxError(err.message)
    }
    setIsLoading(false)
  }

  const hiddenAppDialog = () => {
    setShowDialog(true)
    setTxError('')
  }

  return <AppDialog
    title='Return NFT'
    trigger={trigger}
    hiddenDialog={showDialog}
  >
    <Box sx={{ p: '3.33rem', pt: '2.67rem' }}>
      <Typography className={styles.normalText}>Are you sure to return the NFT, once returned you won&#39;t be able to earn yields by using that anymore.</Typography>

      {txError && <Alert variant="outlined" severity="error" sx={{ mt: '2rem' }}>{txError}</Alert>}
      
      <Stack direction="row" spacing="3.33rem" sx={{ mt: '2.67rem' }}>
        <Box className={styles.primaryButton} onClick={returnBorrowerNFT}>
          {
            isLoading ? <>
              <CircularProgress size={24} />
              Pendding
            </> : <>Confirm</>
          }
        </Box>
        <Box className={styles.defaultButton} onClick={hiddenAppDialog}>Cancel</Box>
      </Stack>
    </Box>
  </AppDialog>
}

export default ReturnNFTModal