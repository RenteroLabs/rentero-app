import { Accordion, AccordionDetails, AccordionSummary, Box, Stack, Typography, Alert, Dialog, DialogTitle, IconButton } from '@mui/material'
import React, { useMemo, useState } from 'react'
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import DoneIcon from '@mui/icons-material/Done';
import AppDialog from '../Dialog'
import styles from './rentModal.module.scss'
import { erc20ABI, etherscanBlockExplorers, useAccount, useContract, useNetwork, useSigner, useWaitForTransaction } from 'wagmi';
import { Ropsten_721_AXE_NFT, ROPSTEN_MARKET, ROPSTEN_MARKET_ABI } from '../../constants/contractABI';
import { LoadingButton } from '@mui/lab';
import OpenInNewIcon from '@mui/icons-material/OpenInNew';
import CloseIcon from '@mui/icons-material/Close';
import DefaultButton from '../Buttons/DefaultButton';
import InputNumber from 'rc-input-number'

interface RentNFTModalProps {
  trigger: React.ReactElement,
  skuId: number | string,
  baseInfo: Record<string, any>,
  reloadInfo: () => any;
}

const RentNFTModal: React.FC<RentNFTModalProps> = (props) => {
  const { trigger, skuId, baseInfo, reloadInfo } = props
  const [visibile, setVisibile] = useState<boolean>(false)

  const [txHash, setTxHash] = useState<string | undefined>()
  const [txError, setTxError] = useState<string>('')
  const { chain } = useNetwork()
  const [buttonLoading, setButtonLoading] = useState<boolean>(false)
  const [isRented, setIsRented] = useState<boolean>(false)
  const { address } = useAccount()
  const { data: signer } = useSigner()

  const [rentDay, setRentDay] = useState<number>()

  const blockscanUrl = useMemo(() => {
    return `${chain?.blockExplorers?.default.url}/tx/${txHash}`
  }, [txHash, chain])

  const contractMarket = useContract({
    addressOrName: ROPSTEN_MARKET,
    contractInterface: ROPSTEN_MARKET_ABI,
    signerOrProvider: signer
  })

  const { isLoading } = useWaitForTransaction({
    hash: txHash,
    onSuccess: () => {
      setIsRented(true)
    }
  })

  // 用户授权转账保证金以租赁NFT
  // const handleApproveToStake = async () => {
  //   try {
  //     await contract.transferFrom(account?.address, Ropsten_721_AXE_NFT, 0)
  //   } catch (err) {
  //     console.log(err)
  //   }
  // }

  const handleCreateOrder = async () => {
    setTxError('')
    // 用户不能租借自己出租的 NFT
    if (baseInfo.lenderAddress === address?.toLowerCase()) {
      setTxError('Users cannot rent NFTs they own')
      return
    }

    setButtonLoading(true)
    try {
      const { hash } = await contractMarket.createOrder(skuId)
      setTxHash(hash)
    } catch (err: any) {
      setTxError(err.message)
    }
    setButtonLoading(false)
  }

  return <Box>
    <Box sx={{ width: '100%' }} onClick={() => setVisibile(true)}>{trigger}</Box>
    {/* <AppDialog
      trigger={trigger}
      title="Rent NFT"
      hiddenDialog={visibile}
    >
      <Box className={styles.rentModal}>
        <Box>
          <Typography sx={{ fontSize: '1.6rem' }}>
            Security Money: <span style={{}}>1</span> USDT
          </Typography>
          <Stack sx={{ mt: '1rem', opacity: '0.6', lineHeight: '1.5rem' }}>
            <Box sx={{ lineHeight: '1.5rem', marginBottom: '0.5rem' }}>Tips:</Box>
            <Box>1. The security deposit is used to ensure that the lessor receives the minimum benefit during each rental cycle</Box>
            <Box>2. If the borrower&#39;s average return per cycle is less than the deposit amount, it will be paid to the lessor</Box>
          </Stack>
        </Box>
        {txError && <Alert variant="outlined" severity="error" sx={{ mt: '2rem' }}>
          {txError}
        </Alert>}
        <Box sx={{ mt: '2rem', textAlign: 'center', color: 'white' }}  >
          {!isLoading && !isRented && <LoadingButton
            loading={buttonLoading}
            variant="contained"
            onClick={handleCreateOrder}
          >
            Approve To Rent
          </LoadingButton>}
          {isLoading &&
            <Box className={styles.txProcessing}>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <img src='/block-loading.svg' />
                The transaction is waiting for being packaged...
              </Box>
              <a href={blockscanUrl} target="_blank" rel="noreferrer">
                <Typography sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', marginTop: '0.5rem' }}>
                  See detail in blockscan&nbsp;<OpenInNewIcon />
                </Typography>
              </a>
            </Box>}
          {isRented &&
            <Button variant="text" color="success" sx={{ fontWeight: 'bolder' }}
              onClick={() => {
                reloadInfo()
                setVisibile(true)
              }}
            >
              🎉&nbsp; Rented
            </Button>}
        </Box>
      </Box>
    </AppDialog > */}

    <Dialog
      open={visibile}
      className={styles.container}
      onClose={() => setVisibile(false)}
    >
      <DialogTitle className={styles.dialogTitle} >
        <Typography>Renting #{baseInfo.nftId}</Typography>
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
      <Box className={styles.dialogContent}>
        <Stack className={styles.payBox}>
          <Box>
            <Typography>Duration</Typography>
            <Typography>min-max Days</Typography>
          </Box>
          <Box>
            <Box className={styles.rentDayBox}>
              <InputNumber
                min={3}
                max={300}
                value={rentDay}
                onChange={(val: number) => {
                  if (!val || val > 300 || val < 3) {
                    return
                  }
                  setRentDay(val)
                }}
                className={styles.rentDayInput}
                formatter={(val: any) => {
                  if (!val || val > 300 || val < 3) {
                    return ''
                  }
                  return val
                }}
              />
              <Box className={styles.rentDayType}>Days</Box>
            </Box>
          </Box>
          <Box>
            <Typography variant="h5">Daily Price</Typography>
            <Typography>USDT 100</Typography>
          </Box>
          <Box>
            <Typography variant="h5">Total Amount</Typography>
            <Typography>0</Typography>
          </Box>
        </Stack>

        <Stack className={styles.totalBox}>
          <Box>
            <Typography variant='h3'>Pay Now</Typography>
            <Typography>0</Typography>
          </Box>
          <Box>
            <Typography variant="h5">Deposit</Typography>
            <Typography>0</Typography>
          </Box>
          <Box>
            <Typography variant="h5">Rent/Day</Typography>
            <Typography>0</Typography>
          </Box>
        </Stack>

        <Stack direction="row" spacing="2rem">
          <DefaultButton >Approve</DefaultButton>
          <DefaultButton>Rent</DefaultButton>
        </Stack>
      </Box>
    </Dialog>
  </Box>
}

export default RentNFTModal