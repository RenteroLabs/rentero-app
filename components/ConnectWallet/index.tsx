import React, { useEffect, useMemo, useState } from 'react'
import { Alert, Box, CircularProgress } from '@mui/material'
import AppDialog from '../Dialog'
import ArrowRightAltRoundedIcon from '@mui/icons-material/ArrowRightAltRounded';
import MetaMaskLogo from '../../public/png_metamask.svg'
import WalletConnectLogo from '../../public/png_walletconnect.svg'
import styles from './index.module.scss'
import Image from 'next/image'
import { useIsMounted } from '../../hooks';
import { Connector, useConnect } from 'wagmi';

interface ConnectWalletProps {
  trigger: React.ReactElement
}

const ConnectWallet: React.FC<ConnectWalletProps> = (props) => {
  const { trigger } = props
  const [hiddenModal, setHiddenModal] = useState<boolean>(false)

  const isMounted = useIsMounted()
  const { activeConnector, connect, connectors, error, isConnecting, pendingConnector } = useConnect()

  const [MetaMaskConnector, WalletConnectConnector] = connectors

  const [MetaMaskConnecting, WalletConnectConnecting] = useMemo(() => {
    if (!isConnecting) return [false, false]

    return [
      MetaMaskConnector.id === pendingConnector?.id,
      WalletConnectConnector.id === pendingConnector?.id
    ]
  }, [isConnecting, pendingConnector])

  // close dialog after connected 
  useEffect(() => {
    if (activeConnector) {
      setHiddenModal(true)
    }
  }, [activeConnector])

  const handleConnect = (selectedConnector: Connector) => {
    if (isConnecting && pendingConnector?.id === selectedConnector.id) {
      return
    }
    connect(selectedConnector)
  }

  // current support metamask and walletconnect to login
  return <AppDialog
    trigger={trigger}
    title="Choose a wallet"
    hiddenDialog={hiddenModal}
  >
    <Box className={styles.walletList}>
      {error &&
        <Alert severity="error" sx={{ display: 'flex', alignItems: 'center' }}> {error.message} </Alert>}

      <div className={styles.walletItem} onClick={() => handleConnect(MetaMaskConnector)}>
        <Image src={MetaMaskLogo} alt='metamask_logo' />
        <p>MetaMask</p>
        {MetaMaskConnecting ? <CircularProgress /> : <ArrowRightAltRoundedIcon />}
      </div>

      <div className={styles.walletItem} onClick={() => handleConnect(WalletConnectConnector)}>
        <Image src={WalletConnectLogo} alt='walletconnect_logo' />
        <p>WalletConnect</p>
        {WalletConnectConnecting ? <CircularProgress /> : <ArrowRightAltRoundedIcon />}
      </div>
    </Box>
  </AppDialog>
}

export default ConnectWallet