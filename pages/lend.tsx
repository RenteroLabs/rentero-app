import React from "react";
import type { NextPage } from 'next'
import Link from "next/link";
import Container from "@mui/material/Container";
import Box from '@mui/material/Box'
import { Grid, Typography } from "@mui/material";
import styles from '../styles/lend.module.scss'
import IntegrationCard from "../components/IntegrationCard";
import Footer from "../components/Footer";

const Lend: NextPage = () => {
  return <Container maxWidth={false} >
    <Box textAlign="center" sx={{ minHeight: "41.33rem", overflow: 'hidden' }}>
      <Typography variant="h2" className={styles.title}>
        Both reliable and profitable<br />
        <span className={styles.highLight}>game NFTs renting </span>
        platform
      </Typography>
      <Typography className={styles.subTitle}>
        Make the best use of your NFTs, earn a great share of players' earnings and withdraw at anytime.
      </Typography>
      <div className={styles.lendButton}>Lend NFTs</div>
    </Box>
    <Box textAlign="center" className={styles.overview}>
      <Typography variant="h3" className={styles.overviewTitle}>Overview</Typography>
      <Grid container spacing="2.5rem" justifyContent="center" rowSpacing="1rem">
        <Grid item xs={12} sm={6} md={3} >
          <Box className={styles.overviewCard_1}>
            <Typography variant="h4">10000+</Typography>
            <Typography>Members</Typography>
          </Box>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Box className={styles.overviewCard_2}>
            <Typography variant="h4">10%+</Typography>
            <Typography>Variable APY</Typography>
          </Box>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Box className={styles.overviewCard_3}>
            <Typography variant="h4">$119080</Typography>
            <Typography>Total earnings</Typography>
          </Box>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Box className={styles.overviewCard_4}>
            <Typography variant="h4">2953</Typography>
            <Typography>NFTs in pool</Typography>
          </Box>
        </Grid>
      </Grid>
    </Box>
    <Box textAlign="center" className={styles.procedure}>
      <Typography variant="h2">Procedure</Typography>
      <Box className={styles.stepList}>
        <div className={styles.stepCard}>
          <span className="stepIcon"></span>
          <div>
            <h4 >Create your account</h4>
            <p>After you create your account, you'll get access to our service</p>
          </div>
        </div>
        <div></div>
        <div className={styles.stepCard}>
          <span className="stepIcon"></span>
          <div>
            <h4 >Choose the portfolio</h4>
            <p>Choose the portfolio you want to invest</p>
          </div>
        </div>
        <div></div>
        <div className={styles.stepCard}>
          <span className="stepIcon"></span>
          <div>
            <h4 >Pay for it</h4>
            <p>After paying for the portfolio,you'll start to get earnings</p>
          </div>
        </div>
      </Box>
    </Box>
    <Box className={styles.integration}>
      <Typography variant="h2">Integrations</Typography>
      <Grid container justifyContent="center" spacing="4.67rem" >
        <Grid item>
          <IntegrationCard />
        </Grid>
        <Grid item>
          <IntegrationCard />
        </Grid>
        <Grid item>
          <IntegrationCard />
        </Grid>
      </Grid>
    </Box>
    <Footer />
  </Container>
}

export default Lend