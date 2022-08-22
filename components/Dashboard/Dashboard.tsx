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
import { ROPSTEN_ACCOUNT_ABI, ROPSTEN_ACCOUNT, Ropsten_WrapNFT, Ropsten_WrapNFT_ABI } from "../../constants/contractABI"
import { dateFormat, formatAddress } from "../../utils/format"
import { useAccount, useContract, useSigner } from "wagmi"
import { LoadingButton } from "@mui/lab"
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

  const { run: fetchNFTInfo } = useRequest(getNFTInfo, {
    manual: true,
    onSuccess: ({ data }) => {
      console.log(data)
      setMetaList({
        ...metaList,
        [`${data.contractAddress.toLowerCase()}-${data.tokenId}`]: data
      })
    }
  })

  const { loading: rentLoading } = useQuery(GET_MY_RENTING, {
    variables: { renter: address },
    onCompleted(data) {
      data = {
        "leases": [
          {
            "id": "0x26aa590dd520cec0f6638f59ebd4e93f9287448b-11",
            "minRentalDays": "5",
            "lender": "0xbeaa278db721b34e61721c1f8edab25c069bae8d",
            "nftAddress": "0x26aa590dd520cec0f6638f59ebd4e93f9287448b",
            "maxRentalDays": "30",
            "status": "lending",
            "rentPerDay": "1000000",
            "renter": null,
            "whitelist": "0x0000000000000000000000000000000000000000",
            "tokenId": "11",
            "expires": null,
            "erc20Address": "0xdac17f958d2ee523a2206206994597c13d831ec7",
            "deposit": "1000000",
            "daysPerPeriod": 5,
          },
          {
            "id": "0x26aa590dd520cec0f6638f59ebd4e93f9287448b-14",
            "minRentalDays": "1",
            "lender": "0x431b4ca18e269fc7e1f5af49b9f4e2af683f6207",
            "nftAddress": "0x26aa590dd520cec0f6638f59ebd4e93f9287448b",
            "maxRentalDays": "100",
            "status": "renting",
            "rentPerDay": "10000000000000000",
            "renter": "0xbeaa278db721b34e61721c1f8edab25c069bae8d",
            "whitelist": "0x0000000000000000000000000000000000000000",
            "tokenId": "14",
            "expires": "1661168964",
            "erc20Address": "0x1a007dbef79c0786d75c5d27f851f37990d7c1d0",
            "deposit": "10000000000000000",
            "daysPerPeriod": 3,
          },
          {
            "id": "0x26aa590dd520cec0f6638f59ebd4e93f9287448b-16",
            "minRentalDays": "1",
            "lender": "0x576687d59d191a9b20110fb3e126dbf27d8e42e0",
            "nftAddress": "0x26aa590dd520cec0f6638f59ebd4e93f9287448b",
            "maxRentalDays": "90",
            "status": "lending",
            "rentPerDay": "1000000000000000",
            "renter": null,
            "whitelist": "0x0000000000000000000000000000000000000000",
            "tokenId": "16",
            "expires": null,
            "erc20Address": "0x1a007dbef79c0786d75c5d27f851f37990d7c1d0",
            "deposit": "1000000000000000",
            "daysPerPeriod": 3,
          },
          {
            "id": "0x26aa590dd520cec0f6638f59ebd4e93f9287448b-17",
            "minRentalDays": "1",
            "lender": "0x576687d59d191a9b20110fb3e126dbf27d8e42e0",
            "nftAddress": "0x26aa590dd520cec0f6638f59ebd4e93f9287448b",
            "maxRentalDays": "120",
            "status": "lending",
            "rentPerDay": "120000",
            "renter": null,
            "whitelist": "0x0000000000000000000000000000000000000000",
            "tokenId": "17",
            "expires": null,
            "erc20Address": "0xdac17f958d2ee523a2206206994597c13d831ec7",
            "deposit": "120000",
            "daysPerPeriod": 3,
          },
          {
            "id": "0x26aa590dd520cec0f6638f59ebd4e93f9287448b-18",
            "minRentalDays": "1",
            "lender": "0x431b4ca18e269fc7e1f5af49b9f4e2af683f6207",
            "nftAddress": "0x26aa590dd520cec0f6638f59ebd4e93f9287448b",
            "maxRentalDays": "100",
            "status": "renting",
            "rentPerDay": "20000000000000000",
            "renter": "0x576687d59d191a9b20110fb3e126dbf27d8e42e0",
            "whitelist": "0x0000000000000000000000000000000000000000",
            "tokenId": "18",
            "expires": "1661079528",
            "erc20Address": "0x1a007dbef79c0786d75c5d27f851f37990d7c1d0",
            "deposit": "20000000000000000",
            "daysPerPeriod": 10,
          },
        ]
      }
      setRentingList(data.leases)
      data?.leases?.forEach((item: { tokenId: any; nftAddress: any }) => {
        fetchNFTInfo({ tokenId: item.tokenId, contractAddress: item.nftAddress })
      })
    }
  })

  const { loading: lendLoading } = useQuery(GET_MY_LENDING, {
    variables: { lender: address },
    onCompleted(data) {
      setLendingList(data.leases)
      data?.leases?.forEach((item: { tokenId: any; nftAddress: any }) => {
        fetchNFTInfo({ tokenId: item.tokenId, contractAddress: item.nftAddress })
      })
    }
  })

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

  // 赎回 NFT
  const withdrawNFT = async (nftUid: number) => {
    try {
      await contractWrap.redeem(nftUid)
    } catch (err: any) {
      console.error(err.message)
    }
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
                        console.log(metaList[[item.nftAddress, item.tokenId].join('-')])
                      }
                      {
                        metaList[[item.nftAddress, item.tokenId].join('-')] && JSON.parse(metaList[[item.nftAddress, item.tokenId].join('-')]?.metadata).name
                      }
                      &nbsp;#{item.tokenId}
                    </Typography>
                    <Typography className={styles.nftAddress}>
                      {formatAddress(tableType === 'RENT' ? item.lender : item.renter, 5)}
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
                {dateFormat('YYYY-mm-dd', new Date(parseInt(item?.expires) * 1000))}
              </TableCell>

              <TableCell align="center">
                {tableType === 'RENT' &&
                  <ReturnNFTModal
                    trigger={<span className={cx({ "returnButton": true })}>Return</span>}
                    orderId={item.tokenId}
                  />}
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
        if (tableType === 'LEND') {
          // getLenderList({ token: jwtToken, pageIndex: currentPage })
        } else if (tableType === 'RENT') {
          // getBorrowerList({ token: jwtToken, pageIndex: currentPage })
        }
      }} />
  </Box>
}

export default Dashboard