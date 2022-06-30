import { Box, Stack } from "@mui/material";
import { Container } from "@mui/system";
import { NextPage } from "next";
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
    <div className={styles.leftNav}>
      <Stack spacing="1.33rem">
        <Box className={classNames({ activeNavItem: currentNav === NAV_ITEM_LIST[0] })} onClick={() => setCurrentNav(NAV_ITEM_LIST[0])}>
          <DashboardIcon />{NAV_ITEM_LIST[0]}
        </Box>
        {/* <Box className={classNames({ activeNavItem: currentNav === NAV_ITEM_LIST[1] })} onClick={() => setCurrentNav(NAV_ITEM_LIST[1])}>
          <BallotIcon />{NAV_ITEM_LIST[1]}
        </Box> */}
        {/* <Box className={classNames({ activeNavItem: currentNav === NAV_ITEM_LIST[2] })} onClick={() => setCurrentNav(NAV_ITEM_LIST[2])}>
          <PaidIcon />{NAV_ITEM_LIST[2]}
        </Box> */}
      </Stack>
    </div>
    <div className={styles.contentBox}>
      {currentNav === NAV_ITEM_LIST[0] && <DashboardBox />}
      {/* {currentNav === NAV_ITEM_LIST[1] && <Withdraw />} */}
      {/* {currentNav === NAV_ITEM_LIST[2] && <Payout />} */}
    </div>
  </Container>
}

export default Dashboard