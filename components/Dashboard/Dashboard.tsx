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
import { dateFormat, formatAddress } from "../../utils/format"
import { useAccount, useContract, useSigner } from "wagmi"
import TakeOffNFTModal from "./Modals/TakeOffNFT"
import LendConfig from "../LendNFT/SliptModeLendConfig"
import CloseIcon from '@mui/icons-material/Close'
import { ADDRESS_TOKEN_MAP, ZERO_ADDRESS } from "../../constants"
import { GET_MY_LENDING, GET_MY_RENTING } from "../../constants/documentNode"
import { useQuery } from "@apollo/client"
import { LeaseItem } from "../../types"
import { getNFTInfo } from "../../services/market"
import { BigNumber, ethers } from "ethers"

const cx = classNames.bind(styles)

export interface DashboardProps { }

const Dashboard: React.FC<DashboardProps> = (props) => {
  const { } = props
  const isMounted = useIsMounted()
  const { data: signer } = useSigner()
  const { address } = useAccount()
  const [rawToken] = useLocalStorageState<string>('token')
  const [tableType, setTableType] = useState<"RENT" | "LEND">('RENT')

  const [lendDataSource, setLendDataSource] = useState<OrderInfo[]>([])
  const [lendTotal, setLendTotal] = useState<number>(0)
  const [borrowerDataSource, setBorrowerDataSource] = useState<OrderInfo[]>([])
  const [borrowerTotal, setBorrowerTotal] = useState<number>(0)
  const [rentingList, setRentingList] = useState<LeaseItem[]>([])
  const [lendingList, setLendingList] = useState<LeaseItem[]>([])
  const [metaList, setMetaList] = useState<Record<string, any>>({})

  const timestamp = useMemo(() => {
    return (new Date().getTime() / 1000).toFixed()
  }, [])

  const batchRequestMetas = (list: LeaseItem[]) => {
    const requestList = list.map((item: { tokenId: any; nftAddress: any }) => {
      return getNFTInfo({ tokenId: item.tokenId, contractAddress: item.nftAddress })
    })
    Promise.all(requestList).then(results => {
      let metadata: Record<string, any> = {}
      results.forEach(({ data }) => {
        metadata[`${data.contractAddress.toLowerCase()}-${data.tokenId}`] = data
      })
      setMetaList({ ...metaList, ...metadata })
    })
  }

  const { loading: rentLoading, refetch: refetchRenting } = useQuery(GET_MY_RENTING, {
    variables: { renter: address, timestamp },
    onCompleted(data) {
      const list = data?.leases
      setRentingList(list)
      batchRequestMetas(list)
    }
  })

  const { loading: lendLoading, refetch: refetchLending } = useQuery(GET_MY_LENDING, {
    variables: { lender: address },
    onCompleted(data) {
      const list = data?.leases
      setLendingList(list)
      batchRequestMetas(list)
    }
  })

  const isLoading = useMemo(() => {
    return lendLoading || rentLoading
  }, [rentLoading, lendLoading])

  const columns = [
    {
      title: 'NFT',
      dataindex: 'nft',
    }, {
      title: 'Daily Price',
    }, {
      title: "Pay period"
    }, {
      title: 'Deposit',
      dataIndex: 'deposit',
    }, {
      title: 'Expire time',
      dataIndex: 'orderTime',
    }, {
      title: 'Manage'
    }
  ]

  // TODO: dashboard页在调用合约操作之前需判断当前所处网络

  return <Box>
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
      {/* <Paper component="form" className={styles.searchInput}>
        <IconButton>
          <SearchIcon sx={{ color: '#777E90', width: '1.4rem', height: '1.4rem' }} />
        </IconButton>
        <InputBase
          sx={{ flex: 1 }}
          placeholder="Enter NFT Id or Name For Searching"
        />
      </Paper> */}
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
          !isLoading && (tableType === 'RENT' ? rentingList : lendingList).map((item, index) => {
            return <TableRow key={index}>
              <TableCell>
                <Box className={styles.nftBoxCell}>
                  <Box className={styles.boxImage}>
                    <img src={metaList[[item.nftAddress, item.tokenId].join('-')]?.imageUrl} />
                    {item.whitelist !== ZERO_ADDRESS && <span className={styles.whitelistIcon}></span>}
                  </Box>
                  <Stack sx={{ margin: 'auto 1rem' }}>
                    <Typography className={styles.nftCollectionName}>
                      {
                        metaList[[item.nftAddress, item.tokenId].join('-')] && JSON.parse(metaList[[item.nftAddress, item.tokenId].join('-')]?.metadata).name
                      }
                      &nbsp;#{item.tokenId}
                    </Typography>
                    <Typography className={styles.nftAddress}>
                      {tableType === 'LEND' && item.renter === ZERO_ADDRESS
                        ? '-'
                        : formatAddress(tableType === 'RENT' ? item.lender : item.renter, 5)}
                    </Typography>
                  </Stack>
                </Box>
              </TableCell>
              <TableCell >
                <Box className={styles.payCoinCol}>
                  <img src={ADDRESS_TOKEN_MAP[item?.erc20Address]?.logo} />
                  {ethers.utils.formatUnits(BigNumber.from(item?.deposit), ADDRESS_TOKEN_MAP[item?.erc20Address]?.decimal)}
                </Box>
              </TableCell>
              <TableCell>
                {item?.daysPerPeriod}
              </TableCell>
              <TableCell >
                <Box className={styles.payCoinCol}>
                  <img src={ADDRESS_TOKEN_MAP[item?.erc20Address]?.logo} />
                  {ethers.utils.formatUnits(BigNumber.from(item?.rentPerDay), ADDRESS_TOKEN_MAP[item?.erc20Address]?.decimal)}
                </Box>
              </TableCell>
              <TableCell>
                {
                  item?.expires < (Number(new Date) / 1000).toFixed()
                    ? '-'
                    : dateFormat('YYYY-mm-dd', new Date(parseInt(item?.expires) * 1000))
                }
              </TableCell>

              <TableCell align="center">
                {tableType === 'RENT' &&
                  <ReturnNFTModal
                    trigger={<span className={cx({ "returnButton": true })}>Return</span>}
                    tokenId={item.tokenId}
                    nftAddress={item.nftAddress}
                    // TODO: 目前采用刷新页面方式更新最新数据，后续再优化
                    reloadTable={refetchRenting}
                  />}
                {/* {tableType === 'LEND' && <LendOperation item={item} />} */}
                {tableType === 'LEND' &&
                  <WithdrawNFTModal
                    trigger={<span className={cx({ "returnButton": true, })} >Redeem</span>}
                    rentInfo={item}
                    // TODO:
                    reloadTable={refetchLending}
                  />}
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
        && (tableType === 'LEND' && lendingList.length === 0 || tableType === 'RENT' && rentingList.length === 0)
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
        if (tableType === 'LEND') {
          // getLenderList({ token: jwtToken, pageIndex: currentPage })
        } else if (tableType === 'RENT') {
          // getBorrowerList({ token: jwtToken, pageIndex: currentPage })
        }
      }} />
  </Box>
}

export default Dashboard