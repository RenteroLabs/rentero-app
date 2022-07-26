import { Alert, Box, Button, Card, Chip, CircularProgress, Dialog, DialogContent, DialogTitle, IconButton, InputBase, Pagination, Paper, Slide, SlideProps, Snackbar, Stack, Table, TableBody, TableCell, TableFooter, TableHead, TableRow, ToggleButton, ToggleButtonGroup, Typography } from "@mui/material"
import styles from './index.module.scss'
import classNames from "classnames/bind"
import NotFound from '../../public/table_not_found.svg'
import Image from "next/image"
import { useIsMounted } from "../../hooks"
import SearchIcon from '@mui/icons-material/Search';
import { useEffect, useMemo, useState } from "react"
import ReturnNFTModal from "./Modals/ReturnNFT"
import WithdrawNFTModal from "./Modals/WithdrawNFT"
import { useLocalStorageState, useRequest } from "ahooks"
import { borrowerList, lenderList, overviewData } from "../../services/dashboard"
import { OrderInfo } from "../../types/dashboard"
import { Ropsten_721_AXE_NFT, ROPSTEN_ACCOUNT_ABI, ROPSTEN_ACCOUNT, Ropsten_WrapNFT, Ropsten_WrapNFT_ABI } from "../../constants/contractABI"
import { dateFormat, formatAddress } from "../../utils/format"
import { useContract, useSigner } from "wagmi"
import { LoadingButton } from "@mui/lab"
import TakeOffNFTModal from "./Modals/TakeOffNFT"
import LendConfig from "../LendNFT/SliptModeLendConfig"
import CloseIcon from '@mui/icons-material/Close'
import { ZERO_ADDRESS } from "../../constants"

const cx = classNames.bind(styles)

const LendOperation: React.FC<{ item: OrderInfo }> = ({ item }) => {
  const [showModal, setShowModal] = useState<boolean>(false)

  let redeemButton
  switch (item.status) {
    case 'BCancel':
    case 'LCancel':
      redeemButton = (item.itemStatus === 'Renting' ?
        <span className={cx({ "returnButton": true, "returnButton_disable": true })}>Withdraw</span>
        : <WithdrawNFTModal
          trigger={<span className={cx({ "returnButton": true, })} >Withdraw</span>}
          nftUid={item.nftUid}
        />)
      break;
    case 'Doing':
    default:
      redeemButton = <TakeOffNFTModal
        trigger={<span className={cx({
          "returnButton": true,
          "returnButton_disable": item.status && item.status !== 'Doing'
        })}>TakeOff</span>}
        orderId={item.orderId}
      />; break;

  }

  return <Box sx={{ display: 'flex', alignItems: 'center' }}>
    <Box
      className={`${styles.returnButton} ${item.status && styles.returnButton_disable}`}
      onClick={() => {
        if (!item.status) {
          setShowModal(true)
        }
      }}>
      Edit</Box>
    {redeemButton}

    <Dialog open={showModal} className={styles.container}>
      <DialogTitle className={styles.dialogTitle}>
        <Box className={styles.emptyBox}></Box>
        Update Lend NFT Config
        <IconButton
          aria-label="close"
          onClick={() => setShowModal(false)}
          sx={{ color: (theme) => theme.palette.grey[500] }}
        >
          <CloseIcon />
        </IconButton>
      </DialogTitle>
      <DialogContent className={styles.dialogContent}>
        <LendConfig />
      </DialogContent>
    </Dialog>
  </Box>
}

export interface DashboardProps {

}

const Dashboard: React.FC<DashboardProps> = (props) => {
  const { } = props
  const isMounted = useIsMounted()
  const { data: signer } = useSigner()
  const [rawToken] = useLocalStorageState<string>('token')
  const [tableType, setTableType] = useState<"RENT" | "LEND">('RENT')

  const [lendDataSource, setLendDataSource] = useState<OrderInfo[]>([])
  const [lendTotal, setLendTotal] = useState<number>(0)
  const [borrowerDataSource, setBorrowerDataSource] = useState<OrderInfo[]>([])
  const [borrowerTotal, setBorrowerTotal] = useState<number>(0)
  const [overview, setOverview] = useState<Record<string, any>>({})

  const [metadata, setMetaData] = useState<Record<number, any>>({})

  const [withdrawLoading, setWithdrawLoading] = useState<boolean>(false)
  const [errorMessage, setErrorMessage] = useState<string | null>()
  const [showSnackbar, setShowSnackbar] = useState<boolean>(false)

  const jwtToken = useMemo(() => {
    if (!rawToken) return ''
    return rawToken.split('*')[1]
  }, [rawToken])

  const contractWrap = useContract({
    addressOrName: Ropsten_WrapNFT,
    contractInterface: Ropsten_WrapNFT_ABI,
    signerOrProvider: signer
  })

  const contractAccount = useContract({
    addressOrName: ROPSTEN_ACCOUNT,
    contractInterface: ROPSTEN_ACCOUNT_ABI,
    signerOrProvider: signer
  })

  const { run: getLenderList, loading: lenderListLoading } = useRequest(lenderList, {
    manual: true,
    onSuccess: async ({ data }) => {
      setLendDataSource(data?.pageContent || [])
      setLendTotal(Math.ceil((data?.totalRemain || 0) / 10))

      let newMetaList: Record<number, any> = {}
      data?.pageContent.forEach((item: OrderInfo, index: number) => {
        try {
          newMetaList[parseInt(data.pageContent[index].skuId)] = JSON.parse(item.metadata)
        } catch (err: any) {
          console.error(err.message)
        }
      })
      setMetaData({ ...metadata, ...newMetaList })
    }
  })

  const { run: getBorrowerList, loading: borrowerListLoading } = useRequest(borrowerList, {
    manual: true,
    onSuccess: async ({ data }) => {
      setBorrowerDataSource(data.pageContent)
      setBorrowerTotal(Math.ceil((data.totalRemain || 0) / 10))

      let newMetaList: Record<number, any> = {}
      data.pageContent.forEach((item: OrderInfo, index: number) => {
        try {
          newMetaList[parseInt(data.pageContent[index].skuId)] = JSON.parse(item.metadata)
        } catch (err: any) {
          console.error(err.message)
        }
      })
      setMetaData({ ...metadata, ...newMetaList })
    }
  })

  const { run: getOverview } = useRequest(overviewData, {
    manual: true,
    onSuccess: ({ data }) => {
      setOverview(data)
    }
  })

  const isLoading = useMemo(() => {
    return lenderListLoading || borrowerListLoading
  }, [lenderListLoading, borrowerListLoading])

  useEffect(() => {
    getLenderList({ token: jwtToken, pageIndex: 1 })
    getBorrowerList({ token: jwtToken, pageIndex: 1 })
    getOverview(jwtToken)
  }, [])

  const columns = [
    {
      title: 'ID',
      dataIndex: 'skuId'
    }, {
      title: 'NFT',
      dataindex: 'nft',
    }, {
      title: 'Total Earning',
      dataIndex: 'totalInComeValue'
    }, {
      title: 'Type',
      dataIndex: 'mode',
    }, {
      title: 'Ratio',
      dataIndex: 'lenderEarnRatio',
    }, {
      title: 'Game Name',
      dataIndex: 'gameName',
    }, {
      title: 'Order Time',
      dataIndex: 'orderTime',
    }, {
      title: 'Status',
      dataIndex: 'status'
    }, {
      title: 'Manage'
    }
  ]

  // 赎回 NFT
  const withdrawNFT = async (nftUid: number) => {
    try {
      await contractWrap.redeem(nftUid)
    } catch (err: any) {
      console.error(err.message)
    }
  }

  // 提取收益
  const withdrawEarning = async () => {
    setWithdrawLoading(true)
    setErrorMessage(undefined)
    try {
      await contractAccount.withdrawToken(0)
    } catch (err: any) {
      setErrorMessage(err.message)
      setShowSnackbar(true)
    }
    setWithdrawLoading(false)
  }

  // TODO: dashboard页在调用合约操作之前需判断当前所处网络

  const lendingStatus = (item: OrderInfo) => {
    if (tableType === 'RENT') {
      switch (item.status) {
        case 'Doing': return <span className={styles.rentingStatus}>Renting</span>
        case "BCancel": return <span className={styles.returningStatus}>Returning</span>
        case "LCancel": return <span className={styles.returningStatus}>Redeeming</span>
        default: return <span>{item.status}</span>
      }
    }

    if (item.itemStatus === "Active" && !item.status) {
      return <span className={styles.listingStatus}>Listing</span>
    }
    if (item.itemStatus === 'Renting') {
      switch (item.status) {
        case 'Doing': return <span className={styles.lendingStatus}>Lending</span>
        case 'BCancel':
        case "LCancel":
        case 'Cancel':
          return <span className={styles.removingStatus}>Removing</span>
      }
    }
    if (item.itemStatus === 'TakeDown') {
      return <span className={styles.removedStatus}>Removed</span>
    }
  }

  const showRentType = (mode: string) => {
    switch (mode) {
      case 'Dividend': return 'Slipt';
      case 'FreeTrial': return 'Trial';
      default: return '-';
    }
  }

  return <div>
    <Stack direction="row" className={styles.overviewBox}>
      <Card variant="outlined">
        <Box>Rent Count </Box>
        <Box>{overview?.borrowCount}</Box>
      </Card>
      <Card variant="outlined">
        <Box>Lend Count</Box>
        <Box>{overview.lendCount}</Box>
      </Card>
      <Card variant="outlined">
        <Box>Total Deposit</Box>
        <Box>{'0' || overview.totalDeposit}</Box>
      </Card>
      <Card variant="outlined">
        <Box>Total Income </Box>
        <Box>{overview.borrowInCome + overview.lendInCome}</Box>
        <LoadingButton
          loading={withdrawLoading}
          variant="outlined"
          color="success"
          size="small"
          onClick={withdrawEarning}
        >Withdraw</LoadingButton>
      </Card>
      <Snackbar
        open={showSnackbar}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'right'
        }}
        autoHideDuration={7000}
        TransitionComponent={(props: SlideProps) => <Slide {...props} direction="up" />}
        onClose={() => setShowSnackbar(false)}>
        <Alert severity="error" sx={{ width: '100%' }}>
          {errorMessage}
        </Alert>
      </Snackbar>
    </Stack>

    <Box className={styles.tableSearch}>
      <Box className={styles.toggleBtnGroup}>
        <div onClick={() => setTableType('RENT')}>
          <Chip
            label="My Renting"
            variant="outlined"
            className={cx({ 'activeButton': tableType === 'RENT' })}
          />
        </div>
        <div onClick={() => setTableType('LEND')}>
          <Chip
            label="My Lending"
            variant="outlined"
            className={cx({ 'activeButton': tableType === 'LEND' })}
          />
        </div>
      </Box>
      <Paper component="form" className={styles.searchInput}>
        <IconButton>
          <SearchIcon sx={{ color: '#777E90', width: '1.4rem', height: '1.4rem' }} />
        </IconButton>
        <InputBase
          sx={{ flex: 1 }}
          placeholder="Enter NFT Id or Name For Searching"
        />
      </Paper>
    </Box>
    <Table className={styles.tableBox}>
      <TableHead className={styles.tableHeader}>
        <TableRow>
          {columns.map((item, index) => {
            return <TableCell key={index} align={index === columns.length - 1 ? 'center' : 'left'}>{item.title}</TableCell>
          })}
        </TableRow>
      </TableHead>
      <TableBody className={styles.tableBody}>
        {
          !isLoading && (tableType === 'RENT' ? borrowerDataSource : lendDataSource).map((item, index) => {
            return <TableRow key={index}>
              <TableCell>{item.skuId}</TableCell>
              <TableCell>
                <Box className={styles.nftBoxCell}>
                  <Box className={styles.boxImage}>
                    <img src={item.imageUrl} />
                    {item.whiteAddress !== ZERO_ADDRESS && <span className={styles.whitelistIcon}></span>}
                  </Box>
                  <Stack sx={{ margin: 'auto 1rem' }}>
                    <Typography className={styles.nftCollectionName}>{metadata[item.skuId]?.name} &nbsp;#{item.nftUid}</Typography>
                    <Typography className={styles.nftAddress}>{formatAddress(tableType === 'RENT' ? item.lenderAddress : item.borrowAddress, 5)}</Typography>
                  </Stack>
                </Box>
              </TableCell>
              <TableCell>{item.totalInComeValue || 0}</TableCell>
              <TableCell>{showRentType(item.mode)}</TableCell>
              <TableCell>{item.lenderEarnRatio}%</TableCell>
              <TableCell>{item.gameName}</TableCell>
              <TableCell>{item.orderTime ? dateFormat('YYYY-mm-dd HH:MM:SS', new Date(item.orderTime * 1000)) : '-'}</TableCell>
              <TableCell>{lendingStatus(item)}</TableCell>
              <TableCell align="center">
                {tableType === 'RENT' &&
                  (item.status === 'Doing' ?
                    <ReturnNFTModal
                      trigger={<span className={cx({ "returnButton": true, "returnButton_disable": item.status !== 'Doing' })}>Return</span>}
                      orderId={item.orderId}
                    /> :
                    <span className={cx({ "returnButton": true, "returnButton_disable": true })}>Return</span>)}
                {tableType === 'LEND' && <LendOperation item={item} />}
              </TableCell>
            </TableRow>
          })
        }
      </TableBody>
      {
        isLoading &&
        <TableFooter className={styles.tableFooter}>
          <TableRow>
            <TableCell colSpan={12}>
              <CircularProgress />
            </TableCell>
          </TableRow>
        </TableFooter>
      }
      {
        !isLoading
        && isMounted
        && (tableType === 'LEND' && lendDataSource.length === 0 || tableType === 'RENT' && borrowerDataSource.length === 0)
        && <TableFooter className={styles.tableFooter}>
          <TableRow>
            <TableCell colSpan={12}>
              <Image src={NotFound} />
              <Typography>Nothing Found</Typography>
            </TableCell>
          </TableRow>
        </TableFooter>
      }
    </Table>

    <Pagination
      className={styles.pagination}
      count={tableType === 'LEND' ? lendTotal : borrowerTotal}
      onChange={(_, currentPage: number) => {
        console.log(currentPage)
        if (tableType === 'LEND') {
          getLenderList({ token: jwtToken, pageIndex: currentPage })
        } else if (tableType === 'RENT') {
          getBorrowerList({ token: jwtToken, pageIndex: currentPage })
        }
      }} />
  </div>
}

export default Dashboard