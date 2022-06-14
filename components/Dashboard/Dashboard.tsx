import { Box, Chip, IconButton, InputBase, Pagination, Paper, Table, TableBody, TableCell, TableFooter, TableHead, TableRow, ToggleButton, ToggleButtonGroup, Typography } from "@mui/material"
import styles from './index.module.scss'
import classNames from "classnames/bind"
import NotFound from '../../public/table_not_found.svg'
import Image from "next/image"
import { useIsMounted } from "../../hooks"
import SearchIcon from '@mui/icons-material/Search';
import { useState } from "react"

const cx = classNames.bind(styles)

export interface DashboardProps {

}

const Dashboard: React.FC<DashboardProps> = (props) => {
  const { } = props
  const isMounted = useIsMounted()
  const [tableType, setTableType] = useState<"RENT" | "LEND">('RENT')

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
            return <TableCell align={index === columns.length - 1 ? 'center' : 'left'}>{item.title}</TableCell>
          })}
        </TableRow>
      </TableHead>
      <TableBody className={styles.tableBody}>
        {
          dataSource.map((item, index) => {
            return <TableRow>
              <TableCell>{item.id}</TableCell>
              <TableCell>{item.nftImageUrl}</TableCell>
              <TableCell>{item.totalEarning}</TableCell>
              <TableCell>{item.ratio}</TableCell>
              <TableCell>{item.gameName}</TableCell>
              <TableCell>{item.time}</TableCell>
              <TableCell>{item.status}</TableCell>
              <TableCell align="center">
                <span className={cx({ "returnButton": true, "returnButton_disable": index === 0 })}>Return</span>
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
    <Pagination count={5} className={styles.pagination} onChange={(_, currentPage: number) => {
      console.log(currentPage)
    }} />
  </div>
}

export default Dashboard