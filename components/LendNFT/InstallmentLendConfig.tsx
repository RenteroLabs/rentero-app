import { Alert, Box, Button, InputBase, MenuItem, Select, SelectChangeEvent, Stack, Switch, TextField, ToggleButton, ToggleButtonGroup, Typography } from '@mui/material'
import InputNumber from 'rc-input-number'
import React, { useEffect, useMemo, useState } from 'react'
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';
import styles from './style.module.scss'
import DefaultButton from '../Buttons/DefaultButton';
import { UserLendConfigInfo } from './ChooseNFTModal';
import classNames from 'classnames/bind'
import { erc721ABI, useAccount, useContract, useSigner, useWaitForTransaction } from 'wagmi';
import { INSTALLMENT_MARKET, INSTALLMENT_MARKET_ABI, Ropsten_721_AXE_NFT } from '../../constants/contractABI';
import { DEPOSIT_DAYS, MAX_RENTABLE_DAYS, MIN_RENTABLE_DAYS, SUPPORT_TOKENS, TOKEN_LIST, ZERO_ADDRESS } from '../../constants';
import { ethers, utils } from 'ethers';

const cx = classNames.bind(styles)
interface LendConfigProps {
  nftInfo: Record<string, any>;
  configType?: '@add' | '@modify';
  setUserLendConfigInfo?: (info: UserLendConfigInfo) => any;
}

/**
 * 分期支付出借配置
 * @param props 
 * @returns 
 */
const InstallmentLendConfig: React.FC<LendConfigProps> = (props) => {
  const { setUserLendConfigInfo = (info: UserLendConfigInfo) => { },
    configType = '@add', nftInfo } = props

  const [whitelist, setWhitelist] = useState<string>('')
  const [isErrorFormatAddress, setIsErrorFormatAddress] = useState<boolean>(false)
  const [lendDailyPrice, setLendDailyPrice] = useState<number>()
  const [minDuration, setMinDuration] = useState<number>(MIN_RENTABLE_DAYS)
  const [maxDuration, setMaxDuration] = useState<number>(365)
  const [paymentCoinType, setPaymentCoinType] = useState<string>(TOKEN_LIST['USDT'].name)
  const [payPeriod, setPayPeriod] = useState<number>(1)
  const [isNeedDeposit, setNeedDeposit] = useState<boolean>(true)
  const [isShowMoreOptions, setShowMoreOption] = useState<boolean>(false)

  const { data: signer } = useSigner()
  const { address } = useAccount()

  const [isApproved, setIsApproved] = useState<boolean>(false)
  const [alreadyApproved, setAlreadyApproved] = useState<boolean>(false)

  const [errorMessage, setErrorMessage] = useState<string>('')
  const [isLoading, setIsLoading] = useState<boolean>(false)

  const [approveTxHash, setApproveTxHash] = useState<string | undefined>()
  const { isLoading: approveLoading } = useWaitForTransaction({
    hash: approveTxHash,
    onSuccess: () => { setIsApproved(true) },
    onSettled: () => setIsLoading(false)
  })

  const [listMarketTxHash, setListMarketTxHash] = useState<string | undefined>()
  const { isLoading: listMarketLoading } = useWaitForTransaction({
    hash: listMarketTxHash,
    onSuccess: () => { },
    onSettled: () => setIsLoading(false)
  })

  // 授权 ERC721 NFT 合约
  const contractERC721 = useContract({
    addressOrName: Ropsten_721_AXE_NFT,
    contractInterface: erc721ABI,
    signerOrProvider: signer
  })

  // 新版 Rentero Market 合约
  const RenteroMarket = useContract({
    addressOrName: INSTALLMENT_MARKET,
    contractInterface: INSTALLMENT_MARKET_ABI,
    signerOrProvider: signer
  })

  const isReady = useMemo(() => {
    if (isErrorFormatAddress) return false
    if (!lendDailyPrice) return
    return true
  }, [isErrorFormatAddress])

  useEffect(() => {
    (async () => {
      const result = await contractERC721.isApprovedForAll(address, INSTALLMENT_MARKET)
      if (result) {
        setAlreadyApproved(true)
      }
    })();
  }, [])

  // 出借 NFT
  const handleLendNFT = async () => {
    if (isLoading || (!isApproved && !alreadyApproved) || !isReady) return
    setErrorMessage('')
    setIsLoading(true)

    const rentDailyPrice = utils.parseUnits(lendDailyPrice?.toString() || '', TOKEN_LIST[paymentCoinType].decimal)

    try {
      const { hash } = await RenteroMarket.lend(
        nftInfo.nftAddress,  // NFT address
        nftInfo.nftId, // NFT id
        TOKEN_LIST[paymentCoinType].address, // pay token address
        whitelist || ZERO_ADDRESS, // whitelist address
        rentDailyPrice.mul(DEPOSIT_DAYS), // deposit
        rentDailyPrice, // daily rent price
        payPeriod, // pay period
        minDuration, // min rent day
        maxDuration // max rent day
      )
      // 等待交易被打包上链
      setApproveTxHash(hash)
    } catch (err: any) {
      setErrorMessage(err?.message)
      setIsLoading(false)
    }
  }

  // 授权指定 ERC721 NFT
  const handleApproveErc721 = async () => {
    setErrorMessage('')
    if (isLoading) return
    setIsLoading(true)

    try {
      const { hash } = await contractERC721.setApprovalForAll(INSTALLMENT_MARKET, true)

      // 等待交易被打包上链
      setApproveTxHash(hash)
    } catch (err: any) {
      setErrorMessage(err?.message)
      setIsLoading(false)
    }
  }

  return <Box className={styles.installmentBox} component="form">
    <Stack className={styles.lendForm}>
      <Box className={styles.lendFormItem}>
        <Typography>Rent / Each Payment</Typography>
        <Stack direction="row" spacing="1.33rem" className={styles.rentDailyPrice}>
          <Box className={styles.rentFormValueBox}>
            <Box>
              <InputNumber
                min={0.0001}
                value={lendDailyPrice}
                onChange={(val) => {
                  if (val >= 0.0001) { setLendDailyPrice(val) }
                }}
              />
            </Box>
          </Box>
          <Select
            className={`${styles.payCoinType} ${styles.formValueBox}`}
            value={paymentCoinType}
            onChange={(event: SelectChangeEvent) => setPaymentCoinType(event.target.value as string)}
          >
            {
              SUPPORT_TOKENS[1].map(item =>
                <MenuItem value={item?.name} className={styles.coinTypeItem} key={item.address}>
                  <img src={item?.logo} alt={`${item.name}_LOGO`} />
                  {item.name}
                </MenuItem>)
            }
          </Select>
        </Stack>
      </Box>

      <Box className={styles.lendFormItem}>
        <Typography>Duration</Typography>
        <Stack direction="row" spacing="1.33rem" sx={{ maxWidth: '40rem' }}>
          <Box className={styles.durationValueBox}>
            <Typography>Min</Typography>
            <InputNumber
              min={MIN_RENTABLE_DAYS}
              max={MAX_RENTABLE_DAYS}
              value={minDuration}
              placeholder="Min"
              onChange={(val) => {
                if (val >= MIN_RENTABLE_DAYS && val <= maxDuration && Number.isInteger(val)) {
                  setMinDuration(val)
                }
              }}
            />
          </Box>
          <Box className={styles.durationValueBox}>
            <Typography>Max</Typography>
            <InputNumber
              min={MIN_RENTABLE_DAYS}
              max={MAX_RENTABLE_DAYS}
              value={maxDuration}
              placeholder="Max"
              onChange={(val) => {
                if (val <= MAX_RENTABLE_DAYS && val >= minDuration && Number.isInteger(val)) {
                  setMaxDuration(val)
                }
              }}
            />
          </Box>
        </Stack>
      </Box>

      <Box className={styles.lendFormItemBox}>
        <Typography>Time Between Payment</Typography>
        <Box className={styles.billingCycle}>
          <InputNumber
            min={1}
            max={365}
            value={payPeriod}
            onChange={(val) => {
              if (val >= 1 && val <= 365 && Number.isInteger(val)) {
                setPayPeriod(val)
              }
            }}
          />
          <Typography>Days</Typography>
        </Box>
      </Box>

      {
        isShowMoreOptions &&
        <>
          <Box className={styles.lendFormItemBox}>
            <Typography>Whitelist</Typography>
            <Box>
              <InputBase
                sx={{ width: '100%', height: '2rem' }}
                value={whitelist}
                placeholder="Please Input Wallet Address..."
                onChange={(e: any) => {
                  const newVal = e.target.value
                  setWhitelist(newVal)
                  if (newVal && !ethers.utils.isAddress(newVal)) {
                    setIsErrorFormatAddress(true)
                  } else {
                    setIsErrorFormatAddress(false)
                  }
                }}
              />
            </Box>
            {isErrorFormatAddress && <Typography className={styles.errorFormat}><ErrorOutlineIcon />&nbsp; Error format address</Typography>}
          </Box>
          <Box className={styles.renetDeposit}>
            <Typography>
              <span>Renter pays deposit</span>
              <Switch checked={isNeedDeposit} onChange={(_, checked: boolean) => setNeedDeposit(checked)} />
            </Typography>
            <Box>* The deposit amount is one cycle rent. It will compensate You  when the Renter defaults.</Box>
          </Box>
        </>
      }
      <Box className={styles.moreOptions}>
        {
          isShowMoreOptions ?
            <span onClick={() => setShowMoreOption(false)}>Fewer Options <KeyboardArrowUpIcon /></span>
            : <span onClick={() => setShowMoreOption(true)}>More Options <KeyboardArrowDownIcon /></span>
        }
      </Box>
      <Box className={styles.serviceFee}>
        <Typography>Service fee</Typography>
        <Typography variant="h5">5%</Typography>
      </Box>

      {errorMessage &&
        <Alert
          variant="outlined"
          severity="error"
          onClose={() => setErrorMessage('')}
          sx={{
            width: '40rem !important',
            minWidth: 'unset !important',
            marginTop: '2rem',
            wordBreak: 'break-word'
          }}
        >{errorMessage}</Alert>}
    </Stack>

    <Stack direction="row" spacing="2rem" className={styles.buttonAsset}>
      {!alreadyApproved && <DefaultButton
        className={cx({
          baseContractButton: true,
          disableButton: isApproved
        })}
        onClick={handleApproveErc721}
      >Approve</DefaultButton>}
      <DefaultButton
        className={cx({
          baseContractButton: true,
          disableButton: !isApproved && !alreadyApproved
        })}
        onClick={handleLendNFT}
      >Lend</DefaultButton>
    </Stack>
  </Box>
}

export default InstallmentLendConfig