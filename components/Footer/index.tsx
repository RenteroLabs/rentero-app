import Image from 'next/image'
import FooterLogo from '../../public/header_logo.svg'
import DiscordLogo from '../../public/discord_logo.svg'
import TwitterLogo from '../../public/twitter.svg'
import MediumLogo from '../../public/medium_logo.png'
import styles from './index.module.css'
import { Container } from '@mui/material'

export default function Footer() {

  return <div className={styles.footer} >
    <div className={styles.context}>
      <div className={styles.iconList}>
        <Image src={FooterLogo} />
        <div className={styles.communityList}>
          <a href='https://discord.io/rentero' target="_blank" ><Image src={DiscordLogo} /></a>
          <a href='https://twitter.com/RenteroProtocol' target="_blank"><Image src={TwitterLogo} /></a>
          <a href='https://medium.com/@renteroprotocol' target="_blank"><Image src={MediumLogo} width={32} height={32} /></a>
        </div>
      </div>
      <p className={styles.copywrite}>Copyright 2021-{new Date().getFullYear()} Rentero.All rights reserved</p>
    </div>
  </div>
}