import { Box, Stack, Typography } from '@mui/material'
import React from 'react'
import AppDialog from '../../Dialog'
import styles from './modal.module.scss'

interface ReturnNFTModalProps {
  trigger: React.ReactElement
}

const ReturnNFTModal: React.FC<ReturnNFTModalProps> = (props) => {
  const { trigger } = props

  return <AppDialog
    title='Return NFT'
    trigger={trigger}
  >
    <Box sx={{ p: '3.33rem', pt: '2.67rem' }}>
      <Typography className={styles.normalText}>Are you sure to return the NFT, once returned you won&#39;t be able to earn yields by using that anymore.</Typography>
      <Stack direction="row" spacing="3.33rem" sx={{ mt: '2.67rem' }}>
        <Box className={styles.primaryButton}>Confirm</Box>
        <Box className={styles.defaultButton}>Cancel</Box>
      </Stack>
    </Box>
  </AppDialog>
}

export default ReturnNFTModal