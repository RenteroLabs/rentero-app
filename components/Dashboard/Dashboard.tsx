import { Box, Card, Chip, CircularProgress, IconButton, InputBase, Pagination, Paper, Stack, Table, TableBody, TableCell, TableFooter, TableHead, TableRow, ToggleButton, ToggleButtonGroup, Typography } from "@mui/material"
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
import { web3GetNFTMetadata } from "../../services/web3NFT"
import { Ropsten_721_AXE_NFT } from "../../constants/contractABI"
import { dateFormat, formatAddress } from "../../utils/format"

const cx = classNames.bind(styles)

export interface DashboardProps {

}

const Dashboard: React.FC<DashboardProps> = (props) => {
  const { } = props
  const isMounted = useIsMounted()
  const [jwtToken] = useLocalStorageState<string>('token')
  const [tableType, setTableType] = useState<"RENT" | "LEND">('RENT')

  const [lendDataSource, setLendDataSource] = useState<OrderInfo[]>([])
  const [lendTotal, setLendTotal] = useState<number>(0)
  const [borrowerDataSource, setBorrowerDataSource] = useState<OrderInfo[]>([])
  const [borrowerTotal, setBorrowerTotal] = useState<number>(0)
  const [overview, setOverview] = useState<Record<string, any>>({})

  const [metadata, setMetaData] = useState<Record<number, any>>({})

  const { run: getLenderList, loading: lenderListLoading } = useRequest(lenderList, {
    manual: true,
    onSuccess: async ({ data }) => {
      console.log(data)
      setLendDataSource(data.pageContent)
      setLendTotal(Math.ceil((data.totalRemain || 0) / 10))

      // 获取 NFT metadata 数据
      const metarequests = data.pageContent.map((item: any) => {
        return web3GetNFTMetadata({
          contractAddress: Ropsten_721_AXE_NFT || item.wrapNftAddress,
          tokenId: item.nftUid,
          tokenType: 'erc721'
        })
      })
      const result = await Promise.all(metarequests)
      let newMetaList: Record<number, any> = {}
      result.forEach((item: any, index: number) => {
        newMetaList[parseInt(data.pageContent[index].skuId)] = item
      })
      setMetaData({ ...metadata, ...newMetaList })
    }
  })

  const { run: getBorrowerList, loading: borrowerListLoading } = useRequest(borrowerList, {
    manual: true,
    onSuccess: ({ data }) => {
      console.log(data)
      setBorrowerDataSource(data.pageContent)
      setBorrowerTotal(Math.ceil((data.totalRemain || 0) / 10))
    }
  })

  const { run: getOverview } = useRequest(overviewData, {
    manual: true,
    onSuccess: ({ data }) => {
      console.log(data)
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
      dataIndex: 'orderId'
    }, {
      title: 'NFT',
      dataindex: 'nft',
    }, {
      title: 'Total Earning',
      dataIndex: 'totalInComeValue'
    }, {
      title: 'Ratio',
      dataIndex: 'lenderEarnRatio',
    }, {
      title: 'Game Name',
      dataIndex: 'gameName',
    }, {
      title: 'Time',
      dataIndex: 'orderTime',
    }, {
      title: 'Status',
      dataIndex: 'status'
    }, {
      title: 'Manage'
    }
  ]

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
        <Box>{overview.totalDeposit}</Box>
      </Card>
      <Card variant="outlined">
        <Box>Total Income </Box>
        <Box>{overview.borrowInCome + overview.lendInCome}</Box>
      </Card>
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
          <SearchIcon sx={{ color: '#777E90' }} />
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
              <TableCell>{item.orderId}</TableCell>
              <TableCell>
                <Box className={styles.nftBoxCell}>
                  <img src={metadata[item.skuId]?.media[0]?.gateway} />
                  <Stack sx={{ margin: 'auto 1rem' }}>
                    <Typography className={styles.nftCollectionName}>{metadata[item.skuId]?.title} &nbsp;#{metadata[item.skuId]?.id.tokenId}</Typography>
                    <Typography className={styles.nftAddress}>{formatAddress(tableType === 'RENT' ? item.lenderAddress : item.borrowAddress, 5)}</Typography>
                  </Stack>
                </Box>
              </TableCell>
              <TableCell>{item.totalInComeValue}</TableCell>
              <TableCell>{item.lenderEarnRatio}%</TableCell>
              <TableCell>AXE</TableCell>
              <TableCell>{dateFormat('YYYY-mm-dd HH:MM:SS', new Date(item.orderTime))}</TableCell>
              <TableCell>{item.status}</TableCell>
              <TableCell align="center">
                {tableType === 'RENT' &&
                  (item.status === 'Doing' ?
                    <ReturnNFTModal
                      trigger={<span className={cx({ "returnButton": true, "returnButton_disable": item.status !== 'Doing' })}>Return</span>}
                      orderId={item.orderId}
                    /> :
                    <span className={cx({ "returnButton": true, "returnButton_disable": true })}>Return</span>)}
                {tableType === 'LEND' &&
                  (item.status === 'Doing' ?
                    <WithdrawNFTModal
                      trigger={<span className={cx({ "returnButton": true, "returnButton_disable": item.status !== 'Doing' })}>Withdraw</span>}
                      orderId={item.orderId}
                    /> :
                    <span className={cx({ "returnButton": true, "returnButton_disable": true })}>Withdraw</span>)}
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