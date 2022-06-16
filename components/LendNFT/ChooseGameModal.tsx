import { Box, Grid } from '@mui/material'
import React, { useState } from 'react'
import AppDialog from '../Dialog'
import IntegrationCard from '../IntegrationCard'

interface LendNFTModalProps {
  trigger: React.ReactElement
}

const GameList = [
  {

  }, {

  }, {

  }, {

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
    <Box sx={{ flexGrow: 1 }} width="95rem">
      <Grid
        container
        rowSpacing="2.67rem"
        columnSpacing="2.5rem"
        sx={{ p: '3.33rem', maxHeight: '46.66rem', overflowY: 'scroll' }} >
        {GameList.map((item, index) => {
          return <Grid item xs="auto" key={index}>
            <IntegrationCard key={1} callback={() => setHiddenModal(true)} />
          </Grid>
        })}
        {/* <Grid item xs="auto">
          <IntegrationCard key={1} callback={() => setHiddenModal(true)} />
        </Grid>
        <Grid item xs="auto">
          <IntegrationCard key={2} callback={() => setHiddenModal(true)} />
        </Grid>
        <Grid item xs="auto">
          <IntegrationCard key={3} callback={() => setHiddenModal(true)} />
        </Grid>
        <Grid item xs="auto">
          <IntegrationCard key={4} callback={() => setHiddenModal(true)} />
        </Grid> */}
      </Grid>
    </Box>
  </AppDialog>
}

export default LendNFTModal