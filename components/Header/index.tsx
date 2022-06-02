import styles from './index.module.scss'
import Logo from '../../public/header_logo.svg'
import Image from 'next/image'
import Link from 'next/link'
import ConnectWallet from '../ConnectWallet'
import { useIsMounted } from '../../hooks'
import { useAccount, useEnsAvatar, useEnsName } from 'wagmi'

export default function Header() {

  const isMounted = useIsMounted()
  const { data: account } = useAccount()
  const { data: ensAvatar } = useEnsAvatar({ addressOrName: account?.address })
  const { data: ensName } = useEnsName({ address: account?.address })
  console.log(ensName, account)
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
        <div>
          {ensAvatar && <img src={ensAvatar} alt="account_avatar" />}
          <div>
            {ensName ? `${ensName} (${account.address})` : account.address}
          </div>
        </div>
        : <ConnectWallet
          trigger={<span className={styles.connectButton}>Connect Wallet</span>}
        />
    }

  </header >
}