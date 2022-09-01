// @ts-nocheck
import styles from './index.module.scss'
import Link from 'next/link'
import ConnectWallet from '../ConnectWallet'
import { useIsMounted } from '../../hooks'
import { useAccount, useEnsAvatar, useEnsName, useDisconnect, useNetwork, chain, useContractWrite, erc20ABI, useProvider, useContract, useSigner, erc721ABI, useSignMessage, useSwitchNetwork } from 'wagmi'
import KeyboardArrowDownOutlinedIcon from '@mui/icons-material/KeyboardArrowDownOutlined';
import LogoutIcon from '@mui/icons-material/Logout';
import DashboardIcon from '@mui/icons-material/Dashboard';
import { formatAddress } from '../../utils/format'
import { Avatar, Chip, ClickAwayListener, Menu, MenuItem,  Typography, Box, IconButton, Drawer, Stack, useMediaQuery } from '@mui/material'
import React, { useEffect, useMemo, useRef, useState } from 'react'
import { useRouter } from 'next/router'
import { CHAIN_ICON, SUPPORT_CHAINS } from '../../constants'
import { Ropsten_721_AXE_NFT_ABI, Ropsten_721_AXE_NFT } from '../../constants/contractABI'
import { UserLoginParams } from '../../types/service'
import { userLogin } from '../../services/dashboard'
import { useLocalStorageState } from 'ahooks'
import AccountBalanceWalletIcon from '@mui/icons-material/AccountBalanceWallet';
import StoreIcon from '@mui/icons-material/Store';
import MenuIcon from '@mui/icons-material/Menu';
import SwapHorizIcon from '@mui/icons-material/SwapHoriz';
import CloseIcon from '@mui/icons-material/Close';
import ExitToAppIcon from '@mui/icons-material/ExitToApp';

export default function Header() {
  const router = useRouter()
  const isMounted = useIsMounted()
  const [jwtToken, setJwtToken] = useLocalStorageState<string>('token', {
    defaultValue: ''
  })
  const { address, isConnected } = useAccount()
  const [showDrawer, setShowDrawer] = useState<boolean>(false)
  const isMenuDrawer = useMediaQuery("(max-width: 900px)")
  const isOperateSize = useMediaQuery("(max-width: 750px)")

  // useEffect(() => {
  //   const [recordAddress] = jwtToken.split('*')
  //   if (address !== recordAddress && router.pathname === '/dashboard') {
  //     setTimeout(signMessage, 2000)
  //   }
  // }, [address])

  const { chain } = useNetwork()
  const { pendingChainId, switchNetwork } = useSwitchNetwork()

  // const { signMessage } = useSignMessage({
  //   message: 'Login Rentero',
  //   onSuccess: async (data) => {
  //     const params: UserLoginParams = {
  //       signature: data,
  //       timestamp: new Date().getTime(),
  //       userAddress: address
  //     }
  //     const result = await userLogin(params)
  //     // 存储 jwt token
  //     setJwtToken(`${address}*${result.data.authToken}`)
  //     router.push('/dashboard')
  //   }
  // })

  const isEth = useMemo(() => {
    if (chain && chain.id === 1) {
      return true
    }
    return false
  }, [chain])

  const { data: ensAvatar } = useEnsAvatar({ addressOrName: address, enabled: isEth })
  const { data: ensName } = useEnsName({ address: address, enabled: isEth })
  const { disconnect } = useDisconnect()

  const [openSetting, setOpenSetting] = useState<boolean>(false)
  const anchorRef = useRef<HTMLElement>(null)
  const networkListAnchorRef = useRef<HTMLElement>(null)
  const [networkListOpen, setNetworkListOpen] = useState<boolean>(false)

  const { data: signer } = useSigner()

  const contract = useContract({
    addressOrName: Ropsten_721_AXE_NFT,
    contractInterface: Ropsten_721_AXE_NFT_ABI,
    signerOrProvider: signer
  })

  const handleClose = (event: Event | React.SyntheticEvent) => {
    if (
      anchorRef.current &&
      anchorRef.current.contains(event.target as HTMLElement)
    ) {
      return;
    }

    setOpenSetting(false);
  }

  const handleLogout = (event: Event | React.SyntheticEvent) => {
    disconnect()
    handleClose(event)
  }

  const chooseSwitchNetwork = (id) => {
    setNetworkListOpen(false)
    if ((chain?.id !== id || pendingChainId !== id)) {
      switchNetwork(id)
    }
  }

  return <header className={styles.header}>
    <div className={styles.logo}>
      <a href='https://app.rentero.io' rel='noreferrer'>
        <img src='/header_logo.svg' alt='Rentero Logo' />
      </a>
    </div>
    <nav className={styles.navList}>
      <Link href="/"  >
        <a className={router.pathname === '/' || ['/detail'].some(item => router.pathname.indexOf(item) === 0) ? styles.activeNavItem : undefined}>Market</a></Link>
      <Link href="/lend">
        <a className={router.pathname === '/lend' ? styles.activeNavItem : undefined}>Lend</a>
      </Link>
      <Link href="/dashboard">
        <a className={router.pathname === '/dashboard' ? styles.activeNavItem : undefined}>Dashboard</a>
      </Link>
    </nav>
    <Box sx={{ display: 'flex', alignItems: 'center' }}>
      {(isMounted && isConnected) &&
        <Chip
          avatar={<Avatar alt={chain?.name} className={styles.networkIcon} src={CHAIN_ICON[chain?.id || 1]} />}
          label={chain?.name || "Ethereum"}
          className={styles.networkList}
          ref={networkListAnchorRef}
          onDelete={() => setNetworkListOpen(true)}
          deleteIcon={<KeyboardArrowDownOutlinedIcon className={styles.downIcon} />}
          onClick={() => setNetworkListOpen(true)}
        />}

      {(isMounted && isConnected) ?
        <Chip
          avatar={<AccountBalanceWalletIcon />}
          label={<div className={styles.addressOrEns}>
            {ensName ? ensName : formatAddress(address, 4)}
            <KeyboardArrowDownOutlinedIcon className={styles.downIcon} />
          </div>}
          className={styles.accountBox}
          onClick={() => setOpenSetting(true)}
          ref={anchorRef}
        /> : <ConnectWallet
          trigger={<span className={styles.connectButton}>Connect Wallet</span>}
        />
      }
      <Box
        className={styles.drawerMenuIcon}
        onClick={() => setShowDrawer(!showDrawer)}>
        {
          isMenuDrawer && showDrawer ?
            <CloseIcon sx={{ fontSize: '2rem' }} />
            : <MenuIcon sx={{ fontSize: '2rem' }} />
        }
      </Box>
    </Box>

    {/* 抽屉弹窗 */}
    <Drawer
      anchor="right"
      open={showDrawer && isMenuDrawer}
      onClose={() => setShowDrawer(false)}
      className={styles.drawer}
      key="header_drawer"
      ModalProps={{ keepMounted: true }}
    >
      <Box
        className={styles.drawerBox}
        onClick={() => setShowDrawer(!showDrawer)}
        onKeyDown={() => setShowDrawer(!showDrawer)}
      >
        {isConnected && isOperateSize && <Box className={styles.drawerHeader}>
          {(isMounted && isConnected) &&
            <Chip
              avatar={<Avatar alt={chain?.name} className={styles.networkIcon} src={CHAIN_ICON[chain?.id || 1]} />}
              label={chain?.name || "Ethereum"}
              className={styles.drawerNetworkList}
              ref={networkListAnchorRef}
              onDelete={() => setNetworkListOpen(true)}
              deleteIcon={<KeyboardArrowDownOutlinedIcon className={styles.downIcon} />}
              onClick={(e: React.MouseEvent) => {
                setNetworkListOpen(true)
                e.stopPropagation()
              }}
            />}
          <Chip
            className={styles.drawerAccountBox}
            avatar={<AccountBalanceWalletIcon />}
            label={<div className={styles.addressOrEns}>
              {ensName ? ensName : formatAddress(address, 6)}
            </div>}
            onClick={(e: React.MouseEvent) => e.stopPropagation()}
          />
        </Box>}
        <Stack className={styles.drawerMenuList} spacing="1rem">
          <Link href="/"><Box><StoreIcon />Market</Box></Link>
          <Link href="/lend"><Box><SwapHorizIcon />Lend</Box></Link>
          {isConnected && <Link href="/dashboard"><Box><DashboardIcon /> Dashboard</Box></Link>}
          {
            isConnected
              ? <Box onClick={handleLogout}><ExitToAppIcon /> Disconnect</Box>
              : <ConnectWallet
                trigger={<Box
                  className={styles.connectButtonInner}
                  closeCallback={() => setShowDrawer(false)}
                >Connect Wallet</Box>} />
          }
        </Stack>
      </Box>
    </Drawer>

    <Menu
      anchorEl={networkListAnchorRef.current}
      open={networkListOpen}
      onClose={() => setNetworkListOpen(false)}
      anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      transformOrigin={{ vertical: 'top', horizontal: 'center' }}
      sx={{ width: '200px', zIndex: 1600 }}
    >
      <MenuItem disabled>
        <Typography className={styles.networkListTitle}>Switch Network</Typography>
      </MenuItem>
      {
        SUPPORT_CHAINS.map(item => {
          return <MenuItem key={item.id} onClick={() => chooseSwitchNetwork(item.id)} className={styles.networkListItem}>
            <Avatar src={CHAIN_ICON[item.id]} alt={item.name} sx={{ width: '20px', height: '20px', marginRight: '0.8rem' }} />
            <span>{item.name}</span>
            {chain && <Box className={item.id === chain.id && styles.currentNetwork}></Box>}
          </MenuItem>
        })
      }
    </Menu>

    <ClickAwayListener onClickAway={handleClose}>
      <Menu
        open={openSetting}
        anchorEl={anchorRef.current}
        onClose={handleClose}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'center',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'center',
        }}
        sx={{ zIndex: 1600 }}
      >
        <MenuItem onClick={handleLogout}>
          <LogoutIcon />
          <span className={styles.menuText}>Disconnect</span>
        </MenuItem>
      </Menu>
    </ClickAwayListener>
  </header >
}