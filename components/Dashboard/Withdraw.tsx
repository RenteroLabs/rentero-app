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
    title: 'Token',
    dataIndex: 'token',
  }, {
    title: 'Game/Blockchain',
    dataIndex: 'game',
  }, {
    title: 'Amount',
    dataIndex: 'amount',
  }, {
    title: 'Operate'
  }
]

const operateRecordColumns = [
  {
    title: 'Token',
    dataIndex: 'token'
  }, {
    title: 'Game',
    dataindex: 'game',
  }, {
    title: 'NFT',
    dataIndex: 'nft',
  }, {
    title: 'Operation',
    dataIndex: 'operation',
  }, {
    title: 'Change',
    dataIndex: 'change',
  }, {
    title: 'Time',
    dataIndex: 'time',
  }
]

const dataSource = [
  {
    token: 'SLP',
    amount: '100',
    game: 'Axie',
  }, {
    token: 'ABC',
    amount: '122',
    game: 'Game'
  }
]

const operationDataSource = [
  {
    token: 'SLP',
    game: 'Axieinfinity',
    nft: '#9527',
    operation: 'withdraw',
    change: '-100',
    time: '2022-02-30 12:59:59'
  }, {
    token: 'SLP',
    game: 'Axieinfinity',
    nft: '',
    operation: 'withdraw',
    change: '-100',
    time: ''
  }, {
    token: 'SLP',
    game: 'Axieinfinity',
    nft: '',
    operation: 'withdraw',
    change: '-100',
    time: ''
  }
]

const Withdraw: React.FC<WithdrawProps> = (props) => {
  const { } = props
  const isMounted = useIsMounted()

  return <div>
    <Box className={styles.tableSearch}>
      <Typography className={styles.tableTitle}>Total Assets</Typography>
      {/* <Paper component="form" className={styles.searchInput}>
        <IconButton>
          <SearchIcon sx={{ color: '#777E90' }} />
        </IconButton>
        <InputBase
          sx={{ flex: 1 }}
          placeholder="Enter NFT Id or Name For Searching"
        />
      </Paper> */}
    </Box>
    {/* 钱包提现 List */}
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
              <TableCell>{item.token}</TableCell>
              <TableCell>{item.game}</TableCell>
              <TableCell>{item.amount}</TableCell>
              <TableCell align="center">
                <WithdrawEarningModal
                  trigger={<span className={cx({ "returnButton": true, "returnButton_disable": index === 1 })}>Withdraw</span>}
                />
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
    {/* <Pagination count={3} className={styles.pagination} onChange={(_, currentPage: number) => {
      console.log(currentPage)
    }} /> */}

    <Box className={styles.operationBox}>
      <Box className={styles.operationHeader}>
        <Typography className={styles.tableTitle}>Value Change Record</Typography>
      </Box>
      <Table
        className={styles.tableBox}
        sx={{ borderTopRightRadius: '0px !important', borderTopLeftRadius: '0px !important'}}>
        <TableHead className={styles.recordBoxHeader} >
          <TableRow>
            {operateRecordColumns.map((item, index) => {
              return <TableCell key={index} align={index === columns.length - 1 ? 'center' : 'left'}>{item.title}</TableCell>
            })}
          </TableRow>
        </TableHead>
        <TableBody className={styles.tableBody}>
          {
            operationDataSource.map((item, index) => {
              return <TableRow key={index}>
                <TableCell>{item.token}</TableCell>
                <TableCell>{item.game}</TableCell>
                <TableCell>{item.nft}</TableCell>
                <TableCell>{item.operation}</TableCell>
                <TableCell>{item.change}</TableCell>
                <TableCell>{item.time}</TableCell>
              </TableRow>
            })
          }
        </TableBody>
      </Table>
    </Box>
  </div>
}

export default Withdraw