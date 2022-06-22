import { Accordion, AccordionDetails, AccordionSummary, Box, Button, Stack, Typography } from '@mui/material'
import React, { useState } from 'react'
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';

import AppDialog from '../Dialog'
import styles from './rentModal.module.scss'
import { erc20ABI, useAccount, useContract, useSigner } from 'wagmi';
import { Ropsten_ERC721Demo_Contract } from '../../constants/contractABI';

interface RentNFTModalProps {
  trigger: React.ReactElement
}

const RentNFTModal: React.FC<RentNFTModalProps> = (props) => {
  const { trigger } = props
  const [closeModal, setCloseModal] = useState<boolean>(false)
  const { data: account } = useAccount()
  const { data: signer } = useSigner()

  const contract = useContract({
    addressOrName: '0x512A34a032116eCdE07bfe47e731B2d16b77A5fB',
    contractInterface: erc20ABI,
    signerOrProvider: signer
  })

  // 用户授权转账保证金以租赁NFT
  const handleApproveToStake = async () => {
    try {
      await contract.transferFrom(account?.address, Ropsten_ERC721Demo_Contract, 0)
    } catch (err) {
      console.log(err)
    }
  }

  return <AppDialog
    trigger={trigger}
    title="Rent NFT"
    hiddenDialog={false}
  >
    <Box className={styles.rentModal}>
      <Box>
        <Typography sx={{ fontSize: '1.6rem' }}>
          Security Money: <span style={{}}>1</span> USDT
        </Typography>
        <Stack sx={{ mt: '1rem', opacity: '0.6', lineHeight: '1.5rem' }}>
          <Box sx={{ lineHeight: '1.5rem', marginBottom: '0.5rem' }}>Tips:</Box>
          <Box>1. The security deposit is used to ensure that the lessor receives the minimum benefit during each rental cycle</Box>
          <Box>2. If the borrower's average return per cycle is less than the deposit amount, it will be paid to the lessor</Box>
        </Stack>
      </Box>
      <Box sx={{ mt: '2rem', textAlign: 'center', color: 'white' }}  >
        <Button variant="contained" onClick={handleApproveToStake}>Approve To Rent</Button>
      </Box>
    </Box>
  </AppDialog>
}

export default RentNFTModal