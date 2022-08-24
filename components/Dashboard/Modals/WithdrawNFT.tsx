import { Alert, Box, Stack, Typography } from '@mui/material'
import React, { useMemo, useState } from 'react'
import { erc20ABI, useAccount, useContract, useSigner, useWaitForTransaction } from 'wagmi'
import classNames from 'classnames/bind';
import { INSTALLMENT_MARKET, INSTALLMENT_MARKET_ABI, Ropsten_WrapNFT, Ropsten_WrapNFT_ABI } from '../../../constants/contractABI'
import AppDialog from '../../Dialog'
import styles from './modal.module.scss'
import DefaultButton from '../../Buttons/DefaultButton';
import { LeaseItem } from '../../../types';
import { BigNumber, ethers, utils } from 'ethers';
import TxLoadingDialog from '../../TxLoadingDialog';
import { ADDRESS_TOKEN_MAP, ONEDAY } from '../../../constants';
import { dateFormat } from '../../../utils/format';

const cx = classNames.bind(styles)
interface WithdrawNFTModalProps {
  trigger: React.ReactElement,
  rentInfo: LeaseItem;
  reloadTable: () => any;
}

const WithdrawNFTModal: React.FC<WithdrawNFTModalProps> = (props) => {
  const { trigger, rentInfo, reloadTable } = props
  const [hiddenDialog, setHiddenDialog] = useState<boolean>(false)
  const [txError, setTxError] = useState<string | undefined>()
  const [buttonLoading, setButtonLoading] = useState<boolean>(false)

  const [isApproved, setIsApproved] = useState<boolean>(false)
  const [alreadyApproved, setAlreadyApproved] = useState<boolean>(false)

  const [showTxDialog, setShowTxDialog] = useState<boolean>(false)

  const { data: signer } = useSigner()

  // 计算一个周期内还未使用消耗的天数费用
  const unUsedDaysInPeriod = useMemo(() => {
    const currentTime = Math.round(Number(new Date()) / 1000)
    console.log(parseInt(rentInfo.expires) ,currentTime)
    if (!rentInfo.expires || parseInt(rentInfo.expires) < currentTime) return 0

    const days = (parseInt(rentInfo.expires) - currentTime) / ONEDAY
    console.log(days)
  }, [rentInfo])

  const contractMarket = useContract({
    addressOrName: INSTALLMENT_MARKET,
    contractInterface: INSTALLMENT_MARKET_ABI,
    signerOrProvider: signer
  })

  // 授权 ERC20 token 合约
  const contractERC20 = useContract({
    addressOrName: rentInfo.erc20Address,
    contractInterface: erc20ABI,
    signerOrProvider: signer
  })

  const [approveTxHash, setApproveTxHash] = useState<string | undefined>()
  useWaitForTransaction({
    hash: approveTxHash,
    onSuccess: () => {
      setIsApproved(true)
    },
    onSettled: () => {
      setShowTxDialog(false)
      setApproveTxHash('')
      setButtonLoading(false)
    }
  })

  const [redeemTxHash, setRedeemTxHash] = useState<string | undefined>()
  useWaitForTransaction({
    hash: redeemTxHash,
    onSuccess: () => {
      // 关闭租借弹窗
      setHiddenDialog(true)
      // 刷新页面数据
      reloadTable()
    },
    onSettled: () => {
      setShowTxDialog(false)
      setButtonLoading(false)
      setRedeemTxHash('')
    }
  })

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

  const redeemNFT = async () => {
    if (buttonLoading) return
    setButtonLoading(true)
    setTxError('')
    setShowTxDialog(true)
    try {
      const { hash } = await contractMarket.reclaim(rentInfo.nftAddress, parseInt(rentInfo.tokenId))
      setRedeemTxHash(hash)
    } catch (err: any) {
      setTxError(err.message)
      setButtonLoading(false)
      setShowTxDialog(false)
    }
  }

  return <AppDialog
    trigger={trigger}
    title="Redeeming NFT"
    hiddenDialog={hiddenDialog}
  >
    <Box className={styles.redeemNFTBox}>
      <Stack className={styles.redeemInfo} spacing="1.33rem">
        <Box >
          <Box>Original Expiry Time</Box>
          <Box>{dateFormat("YYYY-mm-dd HH:MM", new Date(parseInt(rentInfo.expires) * 1000)) }</Box>
        </Box>
        {/* <Box>
          <Box>Total Amount</Box>
          <Box></Box>
        </Box> */}
      </Stack>
      <Box className={styles.stackLine}></Box>
      <Stack className={styles.payDetail} spacing="1.33rem">
        <Box>
          <Box className={styles.totalLabelValue}>Total  liquidated damages</Box>
          <Box></Box>
        </Box>
        <Box>
          <Box>Unrealized Amount</Box>
          <Box></Box>
        </Box>
        <Box>
          <Box>Compensation To Renter</Box>
          <Box>
            <img src={ADDRESS_TOKEN_MAP[rentInfo?.erc20Address]?.logo} />
            {utils.formatUnits(BigNumber.from(rentInfo?.deposit), ADDRESS_TOKEN_MAP[rentInfo?.erc20Address]?.decimal)}
          </Box>
        </Box>
      </Stack>
      {txError &&
        <Alert
          variant="outlined"
          severity="error"
          sx={{ m: '1rem auto' }}
          onClose={() => setTxError('')}
          className="alertTxErrorMsg"
        >{txError}</Alert>}

      <Stack direction="row" spacing="2rem">
        {!alreadyApproved && <DefaultButton
          className={cx({ 'baseButton': true, 'disableButton': isApproved })}
          loading={buttonLoading && !isApproved}
          onClick={() => handleApproveERC20()}
        >
          {isApproved ? 'Approved' : 'Approve'}
        </DefaultButton>}
        <DefaultButton
          className={cx({ 'baseButton': true, 'disableButton': !isApproved && !alreadyApproved })}
          loading={buttonLoading && (isApproved || alreadyApproved)}
          onClick={() => {
            if (isApproved || alreadyApproved) {
              redeemNFT()
            }
          }}
        >
          Redeem
        </DefaultButton>
      </Stack>
    </Box>
    <TxLoadingDialog showTxDialog={showTxDialog} txHash={approveTxHash || redeemTxHash || ''} />
  </AppDialog>
}

export default WithdrawNFTModal