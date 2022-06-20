import { Box, Grid } from '@mui/material'
import React, { useState } from 'react'
import { Ropsten_ERC721Demo_Contract } from '../../constants/contractABI'
import { GameItem } from '../../types'
import AppDialog from '../Dialog'
import IntegrationCard from '../IntegrationCard'

interface LendNFTModalProps {
  trigger: React.ReactElement
}

const GameList: GameItem[] = [
  {
    gameName: 'Someland',
    gameDesc: 'A true play to earn game, get money and fun in bear market',
    gameCover: 'https://tva1.sinaimg.cn/large/e6c9d24egy1h3eptqhmuaj212w0b4abp.jpg',
    gameLogo: 'https://tva1.sinaimg.cn/large/e6c9d24egy1h3epv6i99xj203c03cjr5.jpg',
    gameStatus: 0,
    gameNFTCollection: Ropsten_ERC721Demo_Contract,
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
  const [hiddenModal, setHiddenModal] = useState<boolean>(false)

  return <AppDialog
    trigger={trigger}
    title="Choose Game"
    hiddenDialog={hiddenModal}
  >
    <Box sx={{ flexGrow: 1 }} width="65rem">
      <Grid
        container
        rowSpacing="2.67rem"
        columnSpacing="2.5rem"
        sx={{ p: '3.33rem', maxHeight: '46.66rem', overflowY: 'scroll' }} >

        {/* TODO: 判断当前是否正确处于当前游戏所在区块链网络 */}
        {GameList.map((item, index) => {
          return <Grid item xs="auto" key={index}>
            <IntegrationCard key={1} callback={() => { }} gameItem={item} />
          </Grid>
        })}

      </Grid>
    </Box>
  </AppDialog>
}

export default LendNFTModal