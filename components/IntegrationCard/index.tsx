import React from 'react'
import Image from 'next/image'
import { GameItem } from '../../types'
import ChooseNFTModal from '../LendNFT/ChooseNFTModal'
import styles from './index.module.scss'
import Upcoming from '../../public/game-upcoming.svg'

interface IntegrationCardProps {
  gameItem: GameItem
  changeModal: () => any
}

const IntegrationCard: React.FC<IntegrationCardProps> = (props) => {
  const { changeModal, gameItem } = props

  return <div className={styles.card}>
    <div className={styles.cover_image}>
      {
        gameItem.gameCover ? <Image src={gameItem.gameCover} alt="game_cover" layout="fill" /> : <Image src={Upcoming} width="90" height="90" />
      }
    </div>
    {gameItem.gameStatus === 0 && <div className={styles.game_logo}>
      <Image alt='game_logo' src={gameItem.gameLogo} layout="fill" />
    </div>}
    <div >
      <h4>{gameItem.gameName || 'Upcoming...'}</h4>
      <p>{gameItem.gameDesc || 'Submit the game name and reasons for us to support in time.'}</p>
    </div>
    {/* Hide current choose game modal, show choose NFT modal */}
    {
      gameItem.gameStatus === 0 ?
        <ChooseNFTModal
          gameName={gameItem.gameName}
          gameNFTCollection={gameItem.gameNFTCollection}
          trigger={<div
            className={styles.depositButton}
          >Deposit</div>
          }
        /> : <div className={`${styles.depositButton} ${styles.disableButton}`}  >
          Deposit
        </div>}
  </div >
}

export default IntegrationCard