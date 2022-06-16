import { Box, Chip, IconButton, InputBase, Pagination, Paper, Table, TableBody, TableCell, TableFooter, TableHead, TableRow, ToggleButton, ToggleButtonGroup, Typography } from '@mui/material'
import { useState } from 'react'
import SearchIcon from '@mui/icons-material/Search';
import styles from './index.module.scss'
import classNames from 'classnames/bind';
import NotFound from '../../public/table_not_found.svg'
import { useIsMounted } from '../../hooks';
import WithdrawEarningModal from './Modals/WithdrawEarning';
import Image from 'next/image';

const cx = classNames.bind(styles)

export interface WithdrawProps {

}
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
    title: 'Manage'
  }
]

const nftColumns = [
  {
    title: 'ID',
    dataIndex: 'id'
  }, {
    title: 'NFT',
    dataindex: 'nft',
  }, {
    title: 'Address',
    dataIndex: 'address',
  }, {
    title: 'Game Name',
    dataIndex: 'gameName',
  }, {
    title: 'Status',
    dataIndex: 'status',
  }, {
    title: 'Time',
    dataIndex: 'time',
  }
]

const dataSource = [
  {
    id: 231,
    nftImageUrl: '',
    nftName: '',
    nftOwnerAddress: '',
    totalEarning: '',
    ratio: '',
    gameName: '',
    time: '',
  }, {
    id: 243,
    nftImageUrl: '',
    nftName: '',
    nftOwnerAddress: '',
    totalEarning: '',
    ratio: '',
    gameName: '',
    time: '',
  }, {
    id: 261,
    nftImageUrl: '',
    nftName: '',
    nftOwnerAddress: '',
    totalEarning: '',
    ratio: '',
    gameName: '',
    time: '',
  },
]

const Withdraw: React.FC<WithdrawProps> = (props) => {
  const { } = props
  const isMounted = useIsMounted()
  const [tableType, setTableType] = useState<"EARNING" | "NFT">("EARNING")

  return <div>
    <Box className={styles.tableSearch}>
      <Typography className={styles.tableTitle}>Withdraw</Typography>
      {/* <Box className={styles.toggleBtnGroup}>
        <div onClick={() => setTableType('EARNING')}>
          <Chip
            label="Earnings"
            variant="outlined"
            className={cx({ 'activeButton': tableType === 'EARNING' })}
          />
        </div>
        <div onClick={() => setTableType("NFT")}>
          <Chip
            label="NFTs"
            variant="outlined"
            className={cx({ 'activeButton': tableType === "NFT" })}
          />
        </div>
      </Box> */}
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
        {tableType === 'EARNING' && <TableRow>
          {columns.map((item, index) => {
            return <TableCell key={index} align={index === columns.length - 1 ? 'center' : 'left'}>{item.title}</TableCell>
          })}
        </TableRow>}
        {tableType === 'NFT' && <TableRow>
          {nftColumns.map((item, index) => <TableCell key={index} >{item.title}</TableCell>)}
        </TableRow>}
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
              {tableType === 'EARNING' && <TableCell align="center">
                <WithdrawEarningModal
                  trigger={<span className={cx({ "returnButton": true, "returnButton_disable": index === 1 })}>Withdraw</span>}
                />
              </TableCell>}
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
    <Pagination count={3} className={styles.pagination} onChange={(_, currentPage: number) => {
      console.log(currentPage)
    }} />
  </div>
}

export default Withdraw