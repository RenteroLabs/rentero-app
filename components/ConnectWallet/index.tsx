import React, { useEffect, useMemo, useState } from 'react'
import { Alert, Box, CircularProgress } from '@mui/material'
import AppDialog from '../Dialog'
import ArrowRightAltRoundedIcon from '@mui/icons-material/ArrowRightAltRounded';
import styles from './index.module.scss'
import { Connector, useAccount, useConnect } from 'wagmi';

interface ConnectWalletProps {
  trigger: React.ReactElement
}

const ConnectWallet: React.FC<ConnectWalletProps> = (props) => {
  const { trigger } = props
  const [hiddenModal, setHiddenModal] = useState<boolean>(false)

  const { connector: activeConnector, isConnected } = useAccount()
  const { connect, connectors, error, isLoading, pendingConnector } = useConnect({
    onSuccess() {
      setHiddenModal(true)
    }
  })

  const [MetaMaskConnector, WalletConnectConnector] = connectors

  const [MetaMaskConnecting, WalletConnectConnecting] = useMemo(() => {
    if (!isLoading) return [false, false]

    return [
      MetaMaskConnector.id === pendingConnector?.id,
      WalletConnectConnector.id === pendingConnector?.id
    ]
  }, [isLoading, pendingConnector])

  const handleConnect = async (selectedConnector: Connector) => {
    if (isLoading && pendingConnector?.id === selectedConnector.id) {
      return
    }
    await connect({ connector: selectedConnector })
  }

  // current support metamask and walletconnect to login
  return <AppDialog
    trigger={trigger}
    title="Choose a wallet"
    hiddenDialog={hiddenModal}
  >
    <Box className={styles.walletList}>
      {error &&
        <Alert severity="error" sx={{ display: 'flex', alignItems: 'center' }}>
          {error.message}
        </Alert>}
      <Box className={styles.walletItem}>
        <div
          onClick={() => handleConnect(connectors[0])}>
          <span className={styles.itemMetamaskLogo}></span>
          <p>MetaMask</p>
          {MetaMaskConnecting ? <CircularProgress /> : <ArrowRightAltRoundedIcon />}
        </div>
      </Box>

      <Box className={styles.walletItem}>
        <div
          onClick={() => handleConnect(WalletConnectConnector)}>
          <span className={styles.itemWalletConnectLogo}></span>
          <p>WalletConnect</p>
          {WalletConnectConnecting ? <CircularProgress /> : <ArrowRightAltRoundedIcon />}
        </div>
      </Box>

    </Box>
  </AppDialog>
}

export default ConnectWallet