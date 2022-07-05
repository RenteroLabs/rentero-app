// @ts-nocheck
import styles from './index.module.scss'
import Image from 'next/image'
import Link from 'next/link'
import Logo from '../../public/header_logo.svg'
import ConnectWallet from '../ConnectWallet'
import { useIsMounted } from '../../hooks'
import { useAccount, useEnsAvatar, useEnsName, useDisconnect, useNetwork, chain, useContractWrite, erc20ABI, useProvider, useContract, useSigner, erc721ABI, useSignMessage } from 'wagmi'
import KeyboardArrowDownOutlinedIcon from '@mui/icons-material/KeyboardArrowDownOutlined';
import LogoutIcon from '@mui/icons-material/Logout';
import DashboardIcon from '@mui/icons-material/Dashboard';
import { formatAddress } from '../../utils/format'
import { Avatar, Chip, ClickAwayListener, Menu, MenuItem, MenuList, Slide, Snackbar, Typography, Box, Button } from '@mui/material'
import { useEffect, useMemo, useRef, useState } from 'react'
import { TransitionProps } from '@mui/material/transitions'
import { useRouter } from 'next/router'
import { utils } from 'ethers'
import { CHAIN_ICON, SUPPORT_CHAINS } from '../../constants'
import { ERC721DemoABI, Ropsten_ERC721Demo_Contract, AXE_ABI, Ropsten_721_AXE_NFT } from '../../constants/contractABI'
import { UserLoginParams } from '../../types/service'
import { userLogin } from '../../services/dashboard'
import { useLocalStorageState } from 'ahooks'

export default function Header() {
  const router = useRouter()
  const isMounted = useIsMounted()
  const [jwtToken, setJwtToken] = useLocalStorageState<string>('token', {
    defaultValue: ''
  })
  const { data: account } = useAccount()

  useEffect(() => {
    const [address] = jwtToken.split('*')
    if (account?.address !== address && router.pathname === '/dashboard') {
      setTimeout(signMessage, 2000)
    }
  }, [account])

  const {
    activeChain,
    error,
    isLoading,
    pendingChainId,
    switchNetwork, } = useNetwork()

  const { signMessage } = useSignMessage({
    message: 'Login Rentero',
    onSuccess: async (data) => {
      const params: UserLoginParams = {
        signature: data,
        timestamp: new Date().getTime(),
        userAddress: account.address
      }
      const result = await userLogin(params)
      // 存储 jwt token
      setJwtToken(`${account?.address}*${result.data.authToken}`)
      router.push('/dashboard')
    }
  })

  const isEth = useMemo(() => {
    if (activeChain && activeChain.id === 1) {
      return true
    }
    return false
  }, [activeChain])

  const { data: ensAvatar } = useEnsAvatar({ addressOrName: account?.address, enabled: isEth })
  const { data: ensName } = useEnsName({ address: account?.address, enabled: isEth })
  const { disconnect } = useDisconnect()

  const [openSetting, setOpenSetting] = useState<boolean>(false)
  const anchorRef = useRef<HTMLElement>(null)
  const networkListAnchorRef = useRef<HTMLElement>(null)
  const [networkListOpen, setNetworkListOpen] = useState<boolean>(false)

  const [showAlertMessage, setShowAlertMessage] = useState<boolean>(false)

  // const provider = useProvider()
  const { data: signer } = useSigner()

  const contract = useContract({
    addressOrName: Ropsten_721_AXE_NFT,
    contractInterface: AXE_ABI,
    signerOrProvider: signer
  })

  const mint721 = async () => {
    try {
      await contract.mint(account?.address, 105)
    } catch (err: any) {
      console.log(err.message)
    }
  }
  // const updateURI = async () => {
  //   try {
  //     await contract.setBaseURI("ipfs://QmaV3ixoANZQcgTNnTFnXDtVR7wgBKQq7wX4JSrpYmkmer/")
  //   } catch (err: any) {
  //     console.log(err.message)
  //   }
  // }

  const transfer721 = async () => {
    try {
      await contract.transferFrom(account?.address, '0xBEaa278dB721b34e61721C1F8edaB25c069bae8D', 16)
    } catch (err: any) {
      console.log(err.message)

    }
  }

  const handleClose = (event: Event | React.SyntheticEvent) => {
    if (
      anchorRef.current &&
      anchorRef.current.contains(event.target as HTMLElement)
    ) {
      return;
    }

    setOpenSetting(false);
  }

  const handleEnterDashboard = (event: Event | React.SyntheticEvent) => {
    handleClose(event)
    if (!jwtToken) {
      signMessage()
    } else {
      const [address] = jwtToken.split('*')
      if (address !== account?.address) {
        signMessage()
      }
    }
    router.push('/dashboard')
  }

  const handleLogout = (event: Event | React.SyntheticEvent) => {
    disconnect()
    handleClose(event)
  }

  const handleLinkToSupport = (event: Event) => {
    event.preventDefault()
    setShowAlertMessage(true)
  }

  const chooseSwitchNetwork = (id) => {
    setNetworkListOpen(false)
    if ((activeChain?.id !== id || pendingChainId !== id)) {
      switchNetwork(id)
    }
  }

  return <header className={styles.header}>
    <div className={styles.logo}>
      <a href='https://rentero.io' rel='noreferrer'>
        <img src='/header_logo.svg' alt='Rentero Logo' />
      </a>
    </div>
    <nav className={styles.navList}>
      <Link href="/"  >
        <a className={router.pathname === '/' || ['/detail'].some(item => item.indexOf(router.pathname) === 0) ? styles.activeNavItem : undefined}>Market</a></Link>
      <Link href="/lend">
        <a className={router.pathname === '/lend' ? styles.activeNavItem : undefined}>Lend NFTs</a>
      </Link>
      <a className={styles.supportNav}>Support</a>
      <Snackbar
        open={showAlertMessage}
        message="WIP: Coming soon！"
        autoHideDuration={3000}
        onClose={() => setShowAlertMessage(false)}
        anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
        TransitionComponent={(props: TransitionProps) => <Slide {...props} direction="right" />}
      />
    </nav>
    {/* <button onClick={updateURI}>updateURI</button> */}
    {/* <button onClick={mint721}>Click</button> */}
    {/* <button onClick={transfer721}>Transfer</button> */}
    {(isMounted && account) &&
      <Chip
        avatar={<Avatar alt={activeChain?.name} className={styles.networkIcon} src={CHAIN_ICON[activeChain?.id || chain.mainnet.id]} />}
        label={activeChain?.name || chain.mainnet.name}
        className={styles.networkList}
        ref={networkListAnchorRef}
        onDelete={() => setNetworkListOpen(true)}
        deleteIcon={<KeyboardArrowDownOutlinedIcon className={styles.downIcon} />}
        onClick={() => setNetworkListOpen(true)}
      />}
    <Menu
      anchorEl={networkListAnchorRef.current}
      open={networkListOpen}
      onClose={() => setNetworkListOpen(false)}
      anchorOrigin={{
        vertical: 'bottom',
        horizontal: 'center',
      }}
      transformOrigin={{
        vertical: 'top',
        horizontal: 'center',
      }}
      sx={{ width: '200px' }}
    >
      <MenuItem disabled>
        <Typography className={styles.networkListTitle}>Switch Network</Typography>
      </MenuItem>
      {
        SUPPORT_CHAINS.map(item => {
          return <MenuItem key={item.id} onClick={() => chooseSwitchNetwork(item.id)} className={styles.networkListItem}>
            <Avatar src={CHAIN_ICON[item.id]} alt={item.name} sx={{ width: '20px', height: '20px', marginRight: '0.8rem' }} />
            <span>{item.name}</span>
            {activeChain && <Box className={item.id === activeChain.id && styles.currentNetwork}></Box>}
          </MenuItem>
        })
      }
    </Menu>

    {(isMounted && account) ?
      <Chip
        avatar={<Avatar src={ensAvatar} alt="account_avatar" />}
        label={<div className={styles.addressOrEns}>
          {ensName ? ensName : formatAddress(account.address, 4)}
          <KeyboardArrowDownOutlinedIcon className={styles.downIcon} />
        </div>}
        className={styles.accountBox}
        onClick={() => setOpenSetting(true)}
        ref={anchorRef}
      /> : <ConnectWallet
        trigger={<span className={styles.connectButton}>Connect Wallet</span>}
      />
    }
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
      >
        <MenuItem onClick={handleEnterDashboard}>
          <DashboardIcon />
          <span className={styles.menuText}>Dashboard</span>
        </MenuItem>
        <MenuItem onClick={handleLogout}>
          <LogoutIcon />
          <span className={styles.menuText}>Disconnect</span>
        </MenuItem>
      </Menu>
    </ClickAwayListener>
  </header >
}