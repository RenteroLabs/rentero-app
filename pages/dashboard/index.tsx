import { Box, Stack } from "@mui/material";
import { Container } from "@mui/system";
import { NextPage } from "next";
import Head from 'next/head';
import styles from '../../styles/dashboard.module.scss'
import DashboardIcon from '@mui/icons-material/Dashboard';
import BallotIcon from '@mui/icons-material/Ballot';
import PaidIcon from '@mui/icons-material/Paid';
import { useState } from "react";
import classNames from "classnames";
import DashboardBox from '../../components/Dashboard/Dashboard'
import Withdraw from "../../components/Dashboard/Withdraw";
import Payout from "../../components/Dashboard/Payout";

const NAV_ITEM_LIST = [
  'Dashboard',
  "Withdraw",
  "Payouts",
]

const Dashboard: NextPage = () => {
  const [currentNav, setCurrentNav] = useState<string>(NAV_ITEM_LIST[0])

  return <Container className={styles.mainBox}>
    <Head>
      <title>Dashboard | Rentero</title>
      <meta name="description" content="Manage your lend & rent NFTs and incomes" />
    </Head>

    <div className={styles.contentBox}>
      {currentNav === NAV_ITEM_LIST[0] && <DashboardBox />}
      {/* {currentNav === NAV_ITEM_LIST[1] && <Withdraw />} */}
      {/* {currentNav === NAV_ITEM_LIST[2] && <Payout />} */}
    </div>
  </Container>
}

export default Dashboard