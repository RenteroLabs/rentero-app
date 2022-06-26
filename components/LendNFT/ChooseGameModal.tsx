import { Box, Dialog, DialogTitle, Grid, IconButton } from '@mui/material'
import React, { useEffect, useState } from 'react'
import CloseIcon from '@mui/icons-material/Close';
import { Ropsten_721_AXE_NFT } from '../../constants/contractABI'
import { GameItem } from '../../types'
import IntegrationCard from '../IntegrationCard'
import styles from './style.module.scss'

interface LendNFTModalProps {
  trigger: React.ReactElement
}

const GameList: GameItem[] = [
  {
    gameName: 'Axe Game',
    gameDesc: 'A true play to earn game, get money and fun in bear market',
    gameCover: 'https://tva1.sinaimg.cn/large/e6c9d24egy1h3lkh7hvtdj21dk0u0n7t.jpg',
    gameLogo: 'https://tva1.sinaimg.cn/large/e6c9d24egy1h3lgqmbf5cj20u00u0q8u.jpg',
    gameStatus: 0,
    gameNFTCollection: Ropsten_721_AXE_NFT,
    chainId: 3,
  }, {
    gameName: '',
    gameDesc: '',
    gameCover: '',
    gameLogo: '',
    gameStatus: 1,
    gameNFTCollection: '',
    chainId: 3
  }
]

const LendNFTModal: React.FC<LendNFTModalProps> = (props) => {
  const { trigger } = props
  const [visibile, setVisibile] = useState<boolean>(false)

  const closeModal = () => {
    setVisibile(false)
  }

  return <React.Fragment>
    <div onClick={() => { setVisibile(true) }} style={{ display: 'inline-block', marginTop: '4.67rem', width: 'auto' }}>
      {trigger}
    </div>
    <Dialog open={visibile} className={styles.container} key="ChooseGame" >
      <DialogTitle className={styles.dialogTitle} sx={{ width: 'auto' }}>
        Choose Game
        <IconButton
          aria-label="close"
          onClick={() => setVisibile(false)}
          sx={{
            position: 'absolute',
            right: 8,
            top: "2rem",
            color: (theme) => theme.palette.grey[500],
          }}
        >
          <CloseIcon />
        </IconButton>
      </DialogTitle>
      <div className={styles.dialogContent}>
        <Box sx={{ flexGrow: 1 }} width="65rem">
          <Grid
            container
            rowSpacing="2.67rem"
            columnSpacing="2.5rem"
            sx={{ p: '3.33rem', maxHeight: '46.66rem', overflowY: 'scroll' }} >

            {/* TODO: 判断当前是否正确处于当前游戏所在区块链网络 */}
            {GameList.map((item, index) => {
              return <Grid item xs="auto" key={index}>
                <IntegrationCard
                  key={`${index}_${new Date().getTime()}`}
                  changeModal={closeModal}
                  gameItem={item} />
              </Grid>
            })}

          </Grid>
        </Box>
      </div>
    </Dialog>
  </React.Fragment >
}

export default LendNFTModal