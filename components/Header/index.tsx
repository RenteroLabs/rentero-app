// @ts-nocheck
import styles from './index.module.scss'
import Logo from '../../public/header_logo.svg'
import Image from 'next/image'
import Link from 'next/link'
import ConnectWallet from '../ConnectWallet'
import { useIsMounted } from '../../hooks'
import { useAccount, useEnsAvatar, useEnsName, useDisconnect } from 'wagmi'
import KeyboardArrowDownOutlinedIcon from '@mui/icons-material/KeyboardArrowDownOutlined';
import { formatAddress } from '../../utils/format'
import { Avatar, Chip, ClickAwayListener, Menu, MenuItem, MenuList } from '@mui/material'
import { useRef, useState } from 'react'

export default function Header() {
  const isMounted = useIsMounted()
  const { data: account } = useAccount()
  const { data: ensAvatar } = useEnsAvatar({ addressOrName: account?.address })
  const { data: ensName } = useEnsName({ address: account?.address })
  const { disconnect } = useDisconnect()
  const [openSetting, setOpenSetting] = useState<boolean>(false)
  const anchorRef = useRef<HTMLElement>(null)

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
  return <header className={styles.header}>
    <div className={styles.logo}>
      <Image src={Logo} alt="Rentero Logo" />
    </div>
    <nav className={styles.navList}>
      <Link href="/" >Market</Link>
      <Link href="/lend">Lend NFTs</Link>
      <Link href="/support">Support</Link>
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
    {/* {
      (isMounted && account) ?
        <div ref={anchorRef} className={styles.accountBox} onClick={() => setOpenSetting(true)}>
          {ensAvatar ? <img src={ensAvatar} alt="account_avatar" /> : <AccountCircleIcon className={styles.addressLogo} />}
          <div className={styles.addressOrEns}>
            {ensName ? `${ensName} (${formatAddress(account.address, 4)})` : formatAddress(account.address, 4)}
          </div>
          <KeyboardArrowDownOutlinedIcon className={styles.downIcon} />
        </div>
        : <ConnectWallet
        trigger={<span className={styles.connectButton}>Connect Wallet</span>}
      />
    } */}
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
        <MenuItem onClick={handleClose}>Dashboard</MenuItem>
        <MenuItem onClick={handleLogout}>Logout</MenuItem>
      </Menu>
    </ClickAwayListener>
  </header >
}