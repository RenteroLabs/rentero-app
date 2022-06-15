import { Box, Stack, Typography } from '@mui/material'
import React from 'react'
import { useAccount } from 'wagmi'
import AppDialog from '../../Dialog'
import styles from './modal.module.scss'

interface WithdrawNFTModalProps {
  trigger: React.ReactElement
}

const WithdrawNFTModal: React.FC<WithdrawNFTModalProps> = (props) => {
  const { trigger } = props
  const { data: account } = useAccount()

  return <AppDialog
    trigger={trigger}
    title="Withdraw NFT"
  >
    <Box sx={{ p: '3.33rem', pt: '2.67rem' }}>
      <Typography className={styles.normalText} >
        Are you sure to withdraw the NFT? You will stop earning yields once confirming, your NFT will be sent to the address below. <span className={styles.tipsText}>(please check it carefully)</span>
      </Typography>
      <Box className={styles.addressBox}>{account?.address}</Box>
      <Stack direction="row" spacing="3.33rem" sx={{ mt: '2.67rem' }}>
        <Box className={styles.primaryButton}>Confirm</Box>
        <Box className={styles.defaultButton}>Cancel</Box>
      </Stack>
    </Box>
  </AppDialog>
}

export default WithdrawNFTModal