import { Box, Button, InputBase, Stack, TextField, ToggleButton, ToggleButtonGroup, Typography } from '@mui/material'
import InputNumber from 'rc-input-number'
import React, { useMemo, useState } from 'react'
import ArrowDropUpIcon from '@mui/icons-material/ArrowDropUp';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';

import styles from './style.module.scss'
import DefaultButton from '../Buttons/DefaultButton';
import { UserLendConfigInfo } from './ChooseNFTModal';

interface LendConfigProps {
  setNextStep: () => any;
  setUserLendConfigInfo: (info: UserLendConfigInfo) => any;
}

const LendConfig: React.FC<LendConfigProps> = (props) => {
  const { setNextStep, setUserLendConfigInfo } = props

  const [ratioType, setRatioType] = useState<number>(30)
  const [customRatio, setCustomRatio] = useState<number | undefined>()
  const [securityMoney, setSecurityMoney] = useState<number | string>("")

  const isReady = useMemo(() => {
    console.log(customRatio)
    console.log(securityMoney)
    if (ratioType === -1 && (!customRatio && customRatio != 0)) {
      return false
    }
    if (!securityMoney && securityMoney !== 0) {
      return false
    }
    return true
  }, [customRatio, ratioType, securityMoney])

  const handleNextStep = () => {
    if (isReady) {
      setNextStep()
      setUserLendConfigInfo({
        borrowerRatio: ratioType !== -1 ? ratioType : customRatio,
        securityMoney: parseFloat(securityMoney as string)
      })
    }
  }

  return <Box className={styles.stepConfig} component="form">
    <Stack className={styles.formItems}>
      <Box>
        <Typography className={styles.formLabel}>Share Ratio To Renter&nbsp;<span>*</span></Typography>
        <ToggleButtonGroup
          value={ratioType}
          exclusive
          sx={{ width: '41.67rem' }}
          onChange={(_, newRatio: number) => {
            newRatio && setRatioType(newRatio)
          }}
        >
          <ToggleButton value={30} className={styles.ratioButton} >30%</ToggleButton>
          <ToggleButton value={40} className={styles.ratioButton} >40%</ToggleButton>
          <ToggleButton value={50} className={styles.ratioButton} >50%</ToggleButton>
          <ToggleButton value={-1} className={styles.ratioButton} disableRipple sx={{ width: '14.67rem !important' }}>
            <InputNumber
              min={0}
              max={100}
              value={customRatio}
              placeholder="Customize Ratio"
              onChange={(val: number) => {
                if (!val || val > 100 || val < 0) {
                  return
                }
                setCustomRatio(val)
              }}
              className={styles.customRatio}
              formatter={(val: any) => {
                if (!val || val > 100 || val < 0) {
                  return ''
                }
                return `${val}%`
              }}
              upHandler={<ArrowDropUpIcon />}
              downHandler={<ArrowDropDownIcon />}
            />
          </ToggleButton>
        </ToggleButtonGroup>
      </Box>
      <Box>
        <Typography className={styles.formLabel}>Security Money&nbsp;<span>*</span></Typography>
        <Box className={styles.formItem} sx={{ width: '41.67rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <InputNumber
            min={0}
            className={styles.securityInput}
            onChange={(val: number) => setSecurityMoney(val)}
          />
          <Box>ETH</Box>
        </Box>
      </Box>
      <Box>
        <Typography className={styles.formLabel}>Whitelist</Typography>
        <Box className={styles.formItem} sx={{ width: '41.67rem' }}>
          <InputBase sx={{ width: '100%', height: '2rem' }} />
        </Box>
      </Box>
      <Box sx={{ marginTop: '1rem !important' }}>
        <Typography className={styles.formLabel}></Typography>
        <Typography className={styles.tipInfo}>* Specify the address to use. Check that the address is filled in correctly.</Typography>
      </Box>
    </Stack>

    <DefaultButton
      sx={{ margin: '2.67rem auto' }}
      className={`${!isReady ? styles.noDoneButton : null}`}
      onClick={handleNextStep}
    >
      Confirm and Next
    </DefaultButton>
  </Box>
}

export default LendConfig