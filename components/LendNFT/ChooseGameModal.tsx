import { Box, Grid } from '@mui/material'
import React from 'react'
import AppDialog from '../Dialog'
import IntegrationCard from '../IntegrationCard'

interface LendNFTModalProps {
  trigger: React.ReactElement
}

const LendNFTModal: React.FC<LendNFTModalProps> = (props) => {
  const { trigger } = props
  return <AppDialog
    trigger={trigger}
    title="Choose Game"
  >
    <Box sx={{ flexGrow: 1 }} width="95rem">
      <Grid
        container
        rowSpacing="2.67rem"
        columnSpacing="2.5rem"
        sx={{ p: '3.33rem', maxHeight: '46.66rem', overflowY: 'scroll' }} >
        <Grid item xs="auto">
          <IntegrationCard />
        </Grid>
        <Grid item xs="auto">
          <IntegrationCard />
        </Grid>
        <Grid item xs="auto">
          <IntegrationCard />
        </Grid>
        <Grid item xs="auto">
          <IntegrationCard />
        </Grid>
      </Grid>
    </Box>
  </AppDialog>
}

export default LendNFTModal