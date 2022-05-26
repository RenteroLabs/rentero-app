
import styles from './index.module.css'
import Logo from '../../public/header_logo.svg'
import Image from 'next/image'
import Link from 'next/link'

export default function Header() {

  return <header className={styles.header}>
    <div className={styles.logo}>
      <Image src={Logo} alt="Rentero Logo" />
    </div>
    <nav className={styles.navList}>
      <Link href="/" >Market</Link>
      <Link href="/lend">Lend NFTs</Link>
      <Link href="/support">Support</Link>
    </nav>
    <span className={styles.connectButton}>Connect Wallet</span>
  </header>
}