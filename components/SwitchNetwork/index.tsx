import { LoadingButton } from '@mui/lab';
import { Button, Dialog, DialogActions, DialogContent, DialogTitle, Stack, Typography } from '@mui/material'
import React, { useState } from 'react'
import { useSwitchNetwork } from 'wagmi'
import styles from './styles.module.scss'

interface SwitchNetworkProps {
  showDialog: boolean;
  closeDialog: () => any;
  callback: () => any;
  targetNetwork: number;
}

const SwitchNetwork: React.FC<SwitchNetworkProps> = (props) => {
  const { showDialog, closeDialog, targetNetwork, callback } = props
  const [loading, setLoading] = useState<boolean>(false)

  const { isLoading, switchNetwork } = useSwitchNetwork({
    chainId: targetNetwork,
    onError(error: any) {
      console.error(error.message)
    },
    onSuccess() {
      closeDialog()
    }
  })

  const handleSwitchNetwork = async () => {

  }

  return <Dialog
    open={showDialog}
    classes={{ paper: styles.dialogPaper }}
  >
    <DialogTitle classes={{ root: styles.dialogModalTitle }}> Switch Network</DialogTitle>
    <Typography className={styles.dialogModalContent} >
      Please switch network to to lend or rent it!
    </Typography>
    <DialogActions classes={{ root: styles.dialogModalActions }}>
      <Stack direction="row">
        <Button variant="outlined" onClick={closeDialog}>Cancel</Button>
        <LoadingButton
          loading={isLoading}
          variant="contained"
          onClick={() => switchNetwork(targetNetwork)}
        >
          Switch Network
        </LoadingButton>
      </Stack>
    </DialogActions>
  </Dialog>
}

export default SwitchNetwork