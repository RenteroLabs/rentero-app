import { Box, Step, StepContent, StepLabel, Stepper } from "@mui/material";
import React, { useState } from "react";
import AppDialog from "../Dialog";

interface LendNFTStepModalProps {
  trigger: React.ReactElement
}

const LendNFTStepModal: React.FC<LendNFTStepModalProps> = (props) => {
  const { trigger } = props
  const [activeStep, setActiveStep] = useState<number>(0)

  return <AppDialog
    title="Lend NFT"
    trigger={trigger}
  >
    <Box sx={{ maxWidth: 600 }}>
      <Stepper
        orientation="vertical"
      >
        <Step key="Approve 721 NFT">
          <StepLabel>
            Approve Your Game ERC721 NFT
          </StepLabel>
          <StepContent>

          </StepContent>
        </Step>
        <Step key="Stake ERC721 NFT & Receive Your WrapNFT">
          <StepLabel>
            Stake ERC721 NFT & Receive Your WrapNFT
          </StepLabel>
          <StepContent>

          </StepContent>
        </Step>
        <Step key="Approve WrapNFT">
          <StepLabel>
            Approve Your WrapNFT
          </StepLabel>
          <StepContent >

          </StepContent>
        </Step>
      </Stepper>
    </Box>
  </AppDialog>
}

export default LendNFTStepModal