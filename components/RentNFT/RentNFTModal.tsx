import { Box, Stack, Typography, Alert, Dialog, DialogTitle, IconButton } from '@mui/material'
import React, { useEffect, useMemo, useState } from 'react'
import styles from './rentModal.module.scss'
import { erc20ABI, useAccount, useContract, useSigner, useWaitForTransaction } from 'wagmi';
import { INSTALLMENT_MARKET, INSTALLMENT_MARKET_ABI } from '../../constants/contractABI';
import CloseIcon from '@mui/icons-material/Close';
import DefaultButton from '../Buttons/DefaultButton';
import InputNumber from 'rc-input-number'
import { ADDRESS_TOKEN_MAP } from '../../constants';
import { ethers, BigNumber, utils } from 'ethers';
import classNames from "classnames/bind"
import { LeaseItem } from '../../types';
import TxLoadingDialog from '../TxLoadingDialog';

const cx = classNames.bind(styles)

interface RentNFTModalProps {
  trigger: React.ReactElement,
  rentInfo: LeaseItem,
  reloadInfo: () => any;
}

const RentNFTModal: React.FC<RentNFTModalProps> = (props) => {
  const { trigger, rentInfo, reloadInfo } = props
  const [visibile, setVisibile] = useState<boolean>(false)

  const [txError, setTxError] = useState<string>('')
  const [buttonLoading, setButtonLoading] = useState<boolean>(false)
  const { address } = useAccount()
  const { data: signer } = useSigner()

  const [rentDay, setRentDay] = useState<number>()
  const [isApproved, setIsApproved] = useState<boolean>(false)
  const [alreadyApproved, setAlreadyApproved] = useState<boolean>(false)

  const [showTxDialog, setShowTxDialog] = useState<boolean>(false)

  const [approveTxHash, setApproveTxHash] = useState<string | undefined>()
  useWaitForTransaction({
    hash: approveTxHash,
    onSuccess: () => setIsApproved(true),
    onSettled: () => {
      setButtonLoading(false)
      setShowTxDialog(false)
      setApproveTxHash('')
    }
  })

  const [rentTxHash, setRentTxHash] = useState<string | undefined>()
  useWaitForTransaction({
    hash: rentTxHash,
    onSuccess: () => {
      // 关闭租借弹窗
      setVisibile(false)
      // 刷新页面数据
      reloadInfo()
    },
    onSettled: () => {
      setButtonLoading(false)
      setShowTxDialog(false)
      setRentTxHash('')
    }
  })

  const contractMarket = useContract({
    addressOrName: INSTALLMENT_MARKET,
    contractInterface: INSTALLMENT_MARKET_ABI,
    signerOrProvider: signer
  })

  const contractERC20 = useContract({
    addressOrName: rentInfo.erc20Address,
    contractInterface: erc20ABI,
    signerOrProvider: signer
  })

  useEffect(() => {
    (async () => {
      if (address && rentInfo) {
        // TODO: 调用 allowance 方法前需处于正确网络中, 不然执行该合约调用会报错

        // 判断是否已经 approveForAll ERC20 token
        const approveToken = await contractERC20.allowance(address, INSTALLMENT_MARKET)

        // 已授权的金额是否大于最大可支付金额 （此次定价授权金额是否会对其他订单的授权金额产生影响）

        // 此处暂时设置一个 较大值(MaxInt256) 进行判断 
        const compareAmount = ethers.constants.MaxInt256
        if (ethers.BigNumber.from(approveToken).gte(compareAmount)) {
          setAlreadyApproved(true)
        }
      }
    })();
  }, [rentInfo])

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
    setShowTxDialog(true)
    try {
      const { hash } = await contractERC20.approve(INSTALLMENT_MARKET, ethers.constants.MaxUint256)
      setApproveTxHash(hash)
    } catch (err: any) {
      setTxError(err.message)
      setButtonLoading(false)
      setShowTxDialog(false)
    }
  }

  const handleRentNFT = async () => {
    // TODO: 判断是否是当前 NFT 所属网络

    // 用户不能租借自己出租的 NFT
    if (rentInfo?.lender === address?.toLowerCase()) {
      setTxError('Users cannot rent NFTs they own')
      return
    }

    setTxError('')
    setButtonLoading(true)
    setShowTxDialog(true)

    try {
      const { hash } = await contractMarket.rent(rentInfo?.nftAddress, rentInfo?.tokenId, rentDay)
      setRentTxHash(hash)
    } catch (err: any) {
      setTxError(err.message)
      setButtonLoading(false)
      setShowTxDialog(false)
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
              {rentInfo && parseFloat(firstTotalPay)}
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

        {txError && <Alert
          variant="outlined"
          severity="error"
          sx={{ mb: '2rem' }}
          className="alertTxErrorMsg"
          onClose={() => setTxError('')}
        >{txError}</Alert>}

        <Stack direction="row" spacing="2rem">
          {!alreadyApproved && <DefaultButton
            className={cx({ 'baseButton': true, 'disableButton': isApproved })}
            loading={buttonLoading && !isApproved}
            onClick={() => {
              handleApproveERC20()
            }}
          >
            {isApproved ? 'Approved' : 'Approve'}
          </DefaultButton>}
          <DefaultButton
            className={cx({ 'baseButton': true, 'disableButton': !isApproved && !alreadyApproved })}
            loading={buttonLoading && (isApproved || alreadyApproved)}
            onClick={() => {
              if (isApproved || alreadyApproved) {
                handleRentNFT()
              }
            }}
          >
            Rent
          </DefaultButton>
        </Stack>
      </Box>
    </Dialog>

    <TxLoadingDialog showTxDialog={showTxDialog} txHash={rentTxHash || approveTxHash || ''} />
  </Box>
}

export default RentNFTModal