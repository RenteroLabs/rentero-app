import React from 'react'
import ChooseNFTModal from '../LendNFT/ChooseNFTModal'
import styles from './index.module.scss'

interface IntegrationCardProps {
  callback?: () => any
}

const IntegrationCard: React.FC<IntegrationCardProps> = (props) => {
  const { callback } = props

  return <div className={styles.card}>
    <div className={styles.cover_image}></div>
    <div className={styles.game_logo}></div>
    <div >
      <h4>GameName</h4>
      <p>game introduce game introduce game introduce game introduce game introduce game introduce</p>
    </div>
    {/* Hide current choose game modal, show choose NFT modal */}
    <ChooseNFTModal
      gameName="Axie infinity"
      NFTCollectionAddress=""
      trigger={<div
        className={styles.depositButton}
        onClick={() => { callback && callback() }}
      >Deposit</div>}
    />
  </div>
}

export default IntegrationCard