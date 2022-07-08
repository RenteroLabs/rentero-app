import { Box, Dialog, DialogTitle, Grid, IconButton } from '@mui/material'
import React, { useEffect, useState } from 'react'
import CloseIcon from '@mui/icons-material/Close';
import { Ropsten_721_AXE_NFT } from '../../constants/contractABI'
import { GameItem } from '../../types'
import IntegrationCard from '../IntegrationCard'
import styles from './style.module.scss'
import ChooseNFTModal from './ChooseNFTModal';

interface LendNFTModalProps {
  trigger: React.ReactElement
}

const GameList: GameItem[] = [
  {
    gameName: 'Axe Game',
    gameDesc: 'A true play to earn game, get money and fun in bear market',
    gameCover: 'https://tva1.sinaimg.cn/large/e6c9d24egy1h3nrmn495jj209804mt8t.jpg',
    gameLogo: 'https://tva1.sinaimg.cn/large/e6c9d24egy1h3yth290wij20690693yk.jpg',
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
  const [visibile, changeVisibile] = useState<boolean>(false)
  const [NFTModalShow, setNFTModalShow] = useState<boolean>(false)
  const [choosedGame, setChoosedGame] = useState<number>(-1)

  const updateChooseGame = (index: number) => {
    setChoosedGame(index)
    setNFTModalShow(true)
    changeVisibile(false)
  }

  return <React.Fragment>
    <div onClick={() => { changeVisibile(true) }} style={{ display: 'inline-block', marginTop: '4.67rem', width: 'auto' }}>
      {trigger}
    </div>
    <Dialog open={visibile} className={styles.container} >
      <DialogTitle className={styles.dialogTitle} sx={{ width: 'auto' }}>
        Choose Game
        <IconButton
          aria-label="close"
          onClick={() => changeVisibile(false)}
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
                  gameItem={item}
                  index={index}
                  updateGame={updateChooseGame}
                />
              </Grid>
            })}

          </Grid>
        </Box>
      </div>
    </Dialog>
    {choosedGame !== -1 &&
      <ChooseNFTModal
        visibile={NFTModalShow}
        setVisibile={setNFTModalShow}
        gameName={GameList[choosedGame].gameName}
        gameNFTCollection={GameList[choosedGame].gameNFTCollection}
      />}
  </React.Fragment >
}

export default LendNFTModal