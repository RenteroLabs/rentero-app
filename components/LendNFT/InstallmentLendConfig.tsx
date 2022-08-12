import { Alert, Box, Button, InputBase, Stack, TextField, ToggleButton, ToggleButtonGroup, Typography } from '@mui/material'
import InputNumber from 'rc-input-number'
import React, { useMemo, useState } from 'react'
import ArrowDropUpIcon from '@mui/icons-material/ArrowDropUp';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';
import styles from './style.module.scss'
import DefaultButton from '../Buttons/DefaultButton';
import { UserLendConfigInfo } from './ChooseNFTModal';
import classNames from 'classnames/bind'
import { erc721ABI, useContract, useSigner, useWaitForTransaction } from 'wagmi';
import { INSTALLMENT_MARKET, INSTALLMENT_MARKET_ABI } from '../../constants/contractABI';
import { SUPPORT_TOKENS, ZERO_ADDRESS } from '../../constants';
import { ethers } from 'ethers';

const cx = classNames.bind(styles)

interface LendConfigProps {
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
    configType = '@add' } = props

  const [whitelist, setWhitelist] = useState<string>('')
  const [isErrorFormatAddress, setIsErrorFormatAddress] = useState<boolean>(false)

  const { data: signer } = useSigner()

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
    addressOrName: '0x80b4a4Da97d676Ee139badA2bF757B7f5AFD0644',
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
    return true
  }, [isErrorFormatAddress])


  // 出借 NFT
  const handleLendNFT = async () => {
    setErrorMessage('')
    if (isLoading) return
    setIsLoading(true)

    try {
      const { hash } = await RenteroMarket.lend(
        "0x80b4a4Da97d676Ee139badA2bF757B7f5AFD0644",
        1, // nft id
        SUPPORT_TOKENS['weth'],
        ZERO_ADDRESS,
        ethers.utils.parseEther('1'),
        ethers.utils.parseEther('2'),
        1,
        3,
        90
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
      const { hash } = await contractERC721.approve(INSTALLMENT_MARKET, parseInt(selectedNFT))
      // const { hash } = await contractERC721.setApprovalForAll(INSTALLMENT_MARKET, true)

      // 等待交易被打包上链
      setApproveTxHash(hash)
    } catch (err: any) {
      setErrorMessage(err?.message)
      setIsLoading(false)
    }
  }


  return <Box className={styles.installmentBox} component="form">
    <Stack className={styles.formItems}>
      <Box>

      </Box>
      <Box>
      </Box>
      <Box>

      </Box>
      <Box >

      </Box>
    </Stack>

    {errorMessage && <Alert variant="outlined" severity="error">{errorMessage}</Alert>}

    <Stack direction="row" spacing="2rem" className={styles.buttonAsset}>
      <DefaultButton className={styles.baseContractButton}>Approve</DefaultButton>
      <DefaultButton className={styles.baseContractButton}>Lend</DefaultButton>
    </Stack>

  </Box>
}

export default InstallmentLendConfig