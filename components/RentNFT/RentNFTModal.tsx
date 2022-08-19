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
import { ADDRESS_TOKEN_MAP, MAX_RENTABLE_DAYS, MIN_RENTABLE_DAYS, SUPPORT_TOKENS, TOKEN_LIST } from '../../constants';
import { ethers, BigNumber, utils } from 'ethers';
import classNames from "classnames/bind"
import { LeaseItem } from '../../types';

const cx = classNames.bind(styles)

interface RentNFTModalProps {
  trigger: React.ReactElement,
  rentInfo: LeaseItem,
  reloadInfo: () => any;
}

const RentNFTModal: React.FC<RentNFTModalProps> = (props) => {
  const { trigger, rentInfo, reloadInfo } = props
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
    addressOrName: TOKEN_LIST['WETH'].address,
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
    })();
  }, [])

  const [
    dailyPrice,
    totalPay,
    deposit,
    firstPay,
    firstTotalPay
  ]: any[] = useMemo(() => {
    if (!rentInfo) return []
    const dailyPrice = utils.formatUnits(BigNumber.from(rentInfo?.rentPerDay), ADDRESS_TOKEN_MAP[rentInfo?.erc20Address]?.decimal)
    const deposit = utils.formatUnits(BigNumber.from(rentInfo?.deposit), ADDRESS_TOKEN_MAP[rentInfo?.erc20Address]?.decimal)

    const totalPay = rentDay ? rentDay * parseFloat(dailyPrice) : 0
    const firstPay = parseFloat(dailyPrice) * parseInt(rentInfo?.daysPerPeriod)
    const firstTotalPay = parseFloat(deposit) + firstPay

    return [
      dailyPrice,
      totalPay,
      deposit,
      firstPay,
      firstTotalPay
    ]
  }, [rentDay, rentInfo])

  const handleApproveERC20 = async () => {
    setTxError('')

    setButtonLoading(true)
    try {
      const { hash } = await contractERC20.approve(INSTALLMENT_MARKET, ethers.constants.MaxUint256)
      setTxHash(hash)
      setApproveTxHash(hash)
    } catch (err: any) {
      setTxError(err.message)
      setButtonLoading(false)
    }
  }

  const handleRentNFT = async () => {
    setTxError('')
    // 用户不能租借自己出租的 NFT
    if (rentInfo?.lender === address?.toLowerCase()) {
      setTxError('Users cannot rent NFTs they own')
      return
    }

    setButtonLoading(true)
    try {
      const { hash } = await contractMarket.rent(rentInfo.nftAddress, rentInfo.tokenId, rentDay)
      setTxHash(hash)
      setRentTxHash(hash)
    } catch (err: any) {
      setTxError(err.message)
      setButtonLoading(false)
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
        <Typography>Renting #{rentInfo?.tokenId}</Typography>
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
            <Box className={styles.rentDayBox}>
              <InputNumber
                min={parseInt(rentInfo?.minRentalDays)}
                max={parseInt(rentInfo?.maxRentalDays)}
                placeholder={`Min ${rentInfo?.minRentalDays} - Max ${rentInfo?.maxRentalDays} Days`}
                value={rentDay}
                onChange={(val: number) => {
                  if (!val || val > parseInt(rentInfo?.maxRentalDays) || val < parseInt(rentInfo?.minRentalDays)) {
                    return
                  }
                  setRentDay(val)
                }}
                className={styles.rentDayInput}
                formatter={(val: any) => {
                  if (!val) return ''
                  return parseInt(val) as unknown as string
                }}
              />
              <Box className={styles.rentDayType}>Days</Box>
            </Box>
          </Box>
          <Box>
            <Typography variant="h5">Daily Price</Typography>
            <Typography className={styles.payListItemP}>
              <img src={ADDRESS_TOKEN_MAP[rentInfo?.erc20Address]?.logo} />
              {dailyPrice}
            </Typography>
          </Box>
          <Box>
            <Typography variant="h5">Total Amount</Typography>
            <Typography className={styles.payListItemP}>
              <img src={ADDRESS_TOKEN_MAP[rentInfo?.erc20Address]?.logo} />
              {totalPay}
            </Typography>
          </Box>
        </Stack>

        <Stack className={styles.totalBox}>
          <Box>
            <Typography variant='h3'>Pay Now</Typography>
            <Typography className={styles.payListItemP}>
              <img src={ADDRESS_TOKEN_MAP[rentInfo?.erc20Address]?.logo} />
              {rentInfo && firstTotalPay}
            </Typography>
          </Box>
          <Box>
            <Typography variant="h5">Deposit</Typography>
            <Typography className={styles.payListItemP}>
              <img src={ADDRESS_TOKEN_MAP[rentInfo?.erc20Address]?.logo} />
              {rentInfo && deposit}
            </Typography>
          </Box>
          <Box>
            <Typography variant="h5">Pay daily (First Payment)</Typography>
            <Typography className={styles.payListItemP}>
              <img src={ADDRESS_TOKEN_MAP[rentInfo?.erc20Address]?.logo} />
              {rentInfo && firstPay}
            </Typography>
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