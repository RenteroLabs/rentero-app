import { Box, Card, Chip, IconButton, InputBase, Pagination, Paper, Stack, Table, TableBody, TableCell, TableFooter, TableHead, TableRow, ToggleButton, ToggleButtonGroup, Typography, useStepperContext } from "@mui/material"
import styles from './index.module.scss'
import classNames from "classnames/bind"
import NotFound from '../../public/table_not_found.svg'
import Image from "next/image"
import { useIsMounted } from "../../hooks"
import SearchIcon from '@mui/icons-material/Search';
import { useEffect, useState } from "react"
import ReturnNFTModal from "./Modals/ReturnNFT"
import WithdrawNFTModal from "./Modals/WithdrawNFT"
import { useLocalStorageState, useRequest } from "ahooks"
import { borrowerList, lenderList, overviewData } from "../../services/dashboard"

const cx = classNames.bind(styles)

export interface DashboardProps {

}

const Dashboard: React.FC<DashboardProps> = (props) => {
  const { } = props
  const isMounted = useIsMounted()
  const [jwtToken] = useLocalStorageState<string>('token')
  const [tableType, setTableType] = useState<"RENT" | "LEND">('RENT')

  const [lendDataSource, setLendDataSource] = useState<Record<string, any>[]>([])
  const [lendTotal, setLendTotal] = useState<number>(0)
  const [borrowerDataSource, setBorrowerDataSource] = useState<Record<string, any>>([])
  const [borrowerTotal, setBorrowerTotal] = useState<number>(0)
  const [overview, setOverview] = useState<Record<string, any>>({})

  const { run: getLenderList } = useRequest(lenderList, {
    manual: true,
    onSuccess: ({ data }) => {
      console.log(data)
      setLendDataSource(data.pageContent)
      setLendTotal(Math.round((data.totalRemain || 0) / 10))
    }
  })

  const { run: getBorrowerList } = useRequest(borrowerList, {
    manual: true,
    onSuccess: ({ data }) => {
      console.log(data)
      setBorrowerDataSource(data.pageContent)
      setBorrowerTotal(Math.round((data.totalRemain || 0) / 10))
    }
  })

  const { run: getOverview } = useRequest(overviewData, {
    manual: true,
    onSuccess: ({ data }) => {
      console.log(data)
      setOverview(data)
    }
  })

  useEffect(() => {
    getLenderList(jwtToken)
    getBorrowerList(jwtToken)
    getOverview(jwtToken)
  }, [])


  const columns = [
    {
      title: 'ID',
      dataIndex: 'id'
    }, {
      title: 'NFT',
      dataindex: 'nft',
    }, {
      title: 'Total Earning',
      dataIndex: 'totalEarning'
    }, {
      title: 'Ratio',
      dataIndex: 'radio',
    }, {
      title: 'Game Name',
      dataIndex: 'gameName',
    }, {
      title: 'Time',
      dataIndex: 'time',
    }, {
      title: 'Status',
      dataIndex: 'status'
    }, {
      title: 'Manage'
    }
  ]

  const dataSource = [
    {
      id: 23,
      nftImageUrl: '',
      nftName: '',
      nftOwnerAddress: '',
      totalEarning: '',
      ratio: '',
      gameName: '',
      time: '',
      status: '',
    }, {
      id: 24,
      nftImageUrl: '',
      nftName: '',
      nftOwnerAddress: '',
      totalEarning: '',
      ratio: '',
      gameName: '',
      time: '',
      status: '',
    }, {
      id: 25,
      nftImageUrl: '',
      nftName: '',
      nftOwnerAddress: '',
      totalEarning: '',
      ratio: '',
      gameName: '',
      time: '',
      status: '',
    }, {
      id: 26,
      nftImageUrl: '',
      nftName: '',
      nftOwnerAddress: '',
      totalEarning: '',
      ratio: '',
      gameName: '',
      time: '',
      status: '',
    },
  ]


  return <div>
    <Stack direction="row" className={styles.overviewBox}>
      <Card variant="outlined">Rent Count {overview?.borrowCount}</Card>
      <Card variant="outlined">Lend Count</Card>
      <Card variant="outlined">Total Deposit</Card>
      <Card variant="outlined">Total Income</Card>
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
          dataSource.map((item, index) => {
            return <TableRow key={index}>
              <TableCell>{item.id}</TableCell>
              <TableCell>{item.nftImageUrl}</TableCell>
              <TableCell>{item.totalEarning}</TableCell>
              <TableCell>{item.ratio}</TableCell>
              <TableCell>{item.gameName}</TableCell>
              <TableCell>{item.time}</TableCell>
              <TableCell>{item.status}</TableCell>
              <TableCell align="center">
                {tableType === 'RENT' && <ReturnNFTModal
                  trigger={<span className={cx({ "returnButton": true, "returnButton_disable": index === 0 })}>Return</span>} />}
                {tableType === 'LEND' && <WithdrawNFTModal
                  trigger={<span className={cx({ "returnButton": true, "returnButton_disable": index === 0 })}>Withdraw</span>} />}
              </TableCell>
            </TableRow>
          })
        }
      </TableBody>
      {
        dataSource.length === 0 && isMounted && <TableFooter className={styles.tableFooter}>
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
      count={lendTotal}
      onChange={(_, currentPage: number) => {
        console.log(currentPage)
      }} />
  </div>
}

export default Dashboard