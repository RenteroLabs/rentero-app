import { Accordion, AccordionDetails, AccordionSummary, Box, Stack, Typography, Alert, Dialog, DialogTitle, IconButton } from '@mui/material'
import React, { useEffect, useMemo, useState } from 'react'
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import DoneIcon from '@mui/icons-material/Done';
import AppDialog from '../Dialog'
import styles from './rentModal.module.scss'
import { erc20ABI, etherscanBlockExplorers, useAccount, useContract, useNetwork, useSigner, useWaitForTransaction } from 'wagmi';
import { INSTALLMENT_MARKET, INSTALLMENT_MARKET_ABI, Ropsten_721_AXE_NFT, ROPSTEN_MARKET, ROPSTEN_MARKET_ABI } from '../../constants/contractABI';
import { LoadingButton } from '@mui/lab';
import OpenInNewIcon from '@mui/icons-material/OpenInNew';
import CloseIcon from '@mui/icons-material/Close';
import DefaultButton from '../Buttons/DefaultButton';
import InputNumber from 'rc-input-number'
import { MAX_RENTABLE_DAYS, MIN_RENTABLE_DAYS, SUPPORT_TOKENS } from '../../constants';
import { ethers, BigNumber, utils } from 'ethers';
import classNames from "classnames/bind"

const cx = classNames.bind(styles)

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
  const [isApproved, setIsApproved] = useState<boolean>(false)
  const [alreadyApproved, setAlreadyApproved] = useState<boolean>(false)


  const [approveTxHash, setApproveTxHash] = useState<string | undefined>()
  const { } = useWaitForTransaction({
    hash: approveTxHash,
    onSuccess: () => {
      setIsApproved(true)
    },
    onSettled: () => setButtonLoading(false)
  })

  const [rentTxHash, setRentTxHash] = useState<string | undefined>()
  const { } = useWaitForTransaction({
    hash: rentTxHash,
    onSuccess: () => { },
    onSettled: () => setButtonLoading(false)
  })

  const blockscanUrl = useMemo(() => {
    return `${chain?.blockExplorers?.default.url}/tx/${txHash}`
  }, [txHash, chain])


  const contractMarket = useContract({
    addressOrName: INSTALLMENT_MARKET,
    contractInterface: INSTALLMENT_MARKET_ABI,
    signerOrProvider: signer
  })

  // 授权 ERC20 token 合约
  const contractERC20 = useContract({
    addressOrName: SUPPORT_TOKENS['weth'],
    contractInterface: erc20ABI,
    signerOrProvider: signer
  })

  useEffect(() => {
    (async () => {
      const data = await contractERC20.allowance(address, INSTALLMENT_MARKET)
      const approvedToken = BigNumber.from(data)
      const neeedToken = utils.parseEther('3')
      if (approvedToken.gte(neeedToken)) {
        setAlreadyApproved(true)
      }
      console.log(data, alreadyApproved)
    })();
  }, [])

  const handleApproveERC20 = async () => {
    setTxError('')

    setButtonLoading(true)
    try {
      const { hash } = await contractERC20.approve(INSTALLMENT_MARKET, ethers.utils.parseEther('1'))
      setTxHash(hash)
      setApproveTxHash(hash)
    } catch (err: any) {
      setTxError(err.message)
    }
  }

  const handleRentNFT = async () => {
    setTxError('')
    // 用户不能租借自己出租的 NFT
    if (baseInfo.lenderAddress === address?.toLowerCase()) {
      setTxError('Users cannot rent NFTs they own')
      return
    }

    setButtonLoading(true)
    try {
      const { hash } = await contractMarket.rent('0x80b4a4Da97d676Ee139badA2bF757B7f5AFD0644', 1, rentDay)
      setTxHash(hash)
      setRentTxHash(hash)
    } catch (err: any) {
      setTxError(err.message)
    }
  }

  return <Box>
    <Box sx={{ width: '100%' }} onClick={() => setVisibile(true)}>{trigger}</Box>
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
                min={MIN_RENTABLE_DAYS}
                max={MAX_RENTABLE_DAYS}
                value={rentDay}
                onChange={(val: number) => {
                  if (!val || val > MAX_RENTABLE_DAYS || val < MIN_RENTABLE_DAYS) {
                    return
                  }
                  setRentDay(val)
                }}
                className={styles.rentDayInput}
                formatter={(val: any) => {
                  if (!val || val > MAX_RENTABLE_DAYS || val < MIN_RENTABLE_DAYS) {
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

        {txError && <Alert variant="outlined" severity="error" sx={{ mb: '2rem' }}>{txError}</Alert>}

        <Stack direction="row" spacing="2rem">
          {!alreadyApproved && <DefaultButton
            className={cx({ 'baseButton': true, 'disableButton': isApproved })}
            loading={buttonLoading && !isApproved}
            onClick={() => {
              handleApproveERC20()
            }}

          >
            {
              isApproved ? 'Approved' : 'Approve'
            }
          </DefaultButton>}
          <DefaultButton
            className={cx({ 'baseButton': true, 'disableButton': !isApproved && !alreadyApproved })}
            onClick={async () => {
              if (isApproved) {
                handleRentNFT()
              }
            }}
          >
            Rent
          </DefaultButton>
        </Stack>
      </Box>
    </Dialog>
  </Box>
}

export default RentNFTModal