import Image from 'next/image'
import FooterLogo from '../../public/header_logo.svg'
import DiscordLogo from '../../public/discord_logo.svg'
import TwitterLogo from '../../public/twitter.svg'
import TelegramLogo from '../../public/telegram.svg'
import styles from './index.module.css'
import { Container } from '@mui/material'

export default function Footer() {

  return <div className={styles.footer} >
    <div className={styles.context}>
      <div className={styles.iconList}>
        <Image src={FooterLogo} />
        <div className={styles.communityList}>
          <a href='' ><Image src={DiscordLogo} /></a>
          <a href='' ><Image src={TwitterLogo} /></a>
          <a href='' ><Image src={TelegramLogo} /></a>
        </div>
      </div>
      <p className={styles.copywrite}>Copyright 2021-{new Date().getFullYear()} Rentero.All rights reserved</p>
    </div>
  </div>
}