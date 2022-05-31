import React from 'react'
import styles from './index.module.scss'

interface IntegrationCardProps {

}

const IntegrationCard: React.FC<IntegrationCardProps> = (props) => {
  const { } = props

  return <div className={styles.card}>
    <div className={styles.cover_image}></div>
    <div className={styles.game_logo}></div>
    <div >
      <h4>GameName</h4>
      <p>game introduce game introduce game introduce game introduce game introduce game introduce</p>
    </div>
    <div className={styles.depositButton}>Deposit</div>
  </div>
}

export default IntegrationCard