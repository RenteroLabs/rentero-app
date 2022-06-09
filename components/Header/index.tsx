// @ts-nocheck
import styles from './index.module.scss'
import Logo from '../../public/header_logo.svg'
import Image from 'next/image'
import Link from 'next/link'
import ConnectWallet from '../ConnectWallet'
import { useIsMounted } from '../../hooks'
import { useAccount, useEnsAvatar, useEnsName, useDisconnect } from 'wagmi'
import KeyboardArrowDownOutlinedIcon from '@mui/icons-material/KeyboardArrowDownOutlined';
import LogoutIcon from '@mui/icons-material/Logout';
import DashboardIcon from '@mui/icons-material/Dashboard';
import { formatAddress } from '../../utils/format'
import { Avatar, Chip, ClickAwayListener, Menu, MenuItem, MenuList, Slide, Snackbar } from '@mui/material'
import { useRef, useState } from 'react'
import { TransitionProps } from '@mui/material/transitions'
import { useRouter } from 'next/router'

export default function Header() {
  const router = useRouter()
  const isMounted = useIsMounted()
  const { data: account } = useAccount()
  const { data: ensAvatar } = useEnsAvatar({ addressOrName: account?.address })
  const { data: ensName } = useEnsName({ address: account?.address })
  const { disconnect } = useDisconnect()
  const [openSetting, setOpenSetting] = useState<boolean>(false)
  const anchorRef = useRef<HTMLElement>(null)

  const [showAlertMessage, setShowAlertMessage] = useState<boolean>(false)

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

  const handleLinkToSupport = (event: Event) => {
    event.preventDefault()
    setShowAlertMessage(true)
  }

  return <header className={styles.header}>
    <div className={styles.logo}>
      <Image src={Logo} alt="Rentero Logo" />
    </div>
    <nav className={styles.navList}>
      <Link href="/"  >
        <a className={router.pathname === '/' || ['/detail'].some(item => item.indexOf(router.pathname) === 0) ? styles.activeNavItem : undefined}>Market</a></Link>
      <Link href="/lend">
        <a className={router.pathname === '/lend' ? styles.activeNavItem : undefined}>Lend NFTs</a>
      </Link>
      <a onClick={handleLinkToSupport} className={styles.supportNav}>Support</a>
      <Snackbar
        open={showAlertMessage}
        message="WIP: Coming soon！"
        autoHideDuration={3000}
        onClose={() => setShowAlertMessage(false)}
        anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
        TransitionComponent={(props: TransitionProps) => <Slide {...props} direction="right" />}
      />
    </nav>
    {
      (isMounted && account) ?
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
        <MenuItem onClick={handleClose}>
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