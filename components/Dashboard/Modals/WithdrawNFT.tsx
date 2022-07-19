import { Alert, Box, Stack, Typography } from '@mui/material'
import React, { useState } from 'react'
import { useAccount, useContract, useSigner } from 'wagmi'
import CircularProgress from '@mui/material/CircularProgress';
import { Ropsten_WrapNFT, Ropsten_WrapNFT_ABI } from '../../../constants/contractABI'
import AppDialog from '../../Dialog'
import styles from './modal.module.scss'

interface WithdrawNFTModalProps {
  trigger: React.ReactElement,
  nftUid: number
}

const WithdrawNFTModal: React.FC<WithdrawNFTModalProps> = (props) => {
  const { trigger, nftUid } = props
  const [hiddenDialog, setHiddenDialog] = useState<boolean>(false)
  const [txError, setTxError] = useState<string | undefined>()
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const { address } = useAccount()
  const { data: signer } = useSigner()
  console.log(nftUid)
  const contractWrap = useContract({
    addressOrName: Ropsten_WrapNFT,
    contractInterface: Ropsten_WrapNFT_ABI,
    signerOrProvider: signer
  })

  const withdrawLendNFT = async () => {
    if (isLoading) return
    setIsLoading(true)
    setTxError('')
    try {
      await contractWrap.redeem(nftUid)
      hiddenAppDialog()
    } catch (err: any) {
      setTxError(err.message)
    }
    setIsLoading(false)
  }

  const hiddenAppDialog = () => {
    setHiddenDialog(true)
    setTxError('')
  }

  return <AppDialog
    trigger={trigger}
    title="Withdraw NFT"
    hiddenDialog={hiddenDialog}
  >
    <Box sx={{ p: '3.33rem', pt: '2.67rem', width: '46rem' }}>
      <Typography className={styles.normalText} >
        Are you sure to withdraw the NFT? Your NFT will be sent to the address below. <span className={styles.tipsText}>(please check it carefully)</span>
      </Typography>
      <Box className={styles.addressBox}>{address}</Box>

      {txError && <Alert variant="outlined" severity="error" sx={{ mt: '2rem', minWidth: 'none !important' }}>{txError}</Alert>}

      <Stack direction="row" spacing="3.33rem" sx={{ mt: '2.67rem' }}>
        <Box className={styles.primaryButton} onClick={withdrawLendNFT}>
          {isLoading && <CircularProgress sx={{ width: '2rem', height: '2rem' }} />}
          Confirm
        </Box>
        <Box className={styles.defaultButton} onClick={hiddenAppDialog}>Cancel</Box>
      </Stack>
    </Box>
  </AppDialog>
}

export default WithdrawNFTModal