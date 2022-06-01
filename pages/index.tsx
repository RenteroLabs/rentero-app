import type { NextPage } from 'next'
import Head from 'next/head'
import Image from 'next/image'
import styles from '../styles/Home.module.scss'
import NFTCard from '../components/NFTCard'
import Link from 'next/link'
import ArrowRightAltRoundedIcon from '@material-ui/icons/ArrowRightAltRounded';
import ScheduleIcon from '@material-ui/icons/Schedule';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { Accordion, AccordionDetails, AccordionSummary, Box, FormControl, MenuItem, Select, SelectChangeEvent, ToggleButton, ToggleButtonGroup, Typography } from '@mui/material'
import { useState } from 'react'

const Home: NextPage = () => {
  const [currentGame, setCurrentGame] = useState<string>('all')
  const [selectedChain, setSelectChain] = useState<string>('')
  const [sortBy, setSortBy] = useState<string>('')

  return (
    <div className={styles.container}>
      <Head>
        <title>Market | Rentero</title>
        <meta name="description" content="Lend and rent your NFTs" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <div className={styles.leftNav}>
        <Accordion sx={{ borderRadius: '1rem 1rem 0rem 0rem', backgroundColor: 'transparent' }} defaultExpanded disableGutters={true}>
          <AccordionSummary expandIcon={<ExpandMoreIcon />} className={styles.accordionHeader}
          >
            <span className={styles.navHeaderIcon}></span>
            Game
          </AccordionSummary>
          <AccordionDetails className={styles.accordionNavList} >
            <ToggleButtonGroup
              exclusive
              fullWidth={true}
              orientation="vertical"
              value={currentGame}
              onChange={(_, val) => setCurrentGame(val)}
              sx={{ textAlign: 'left' }}
            >
              <ToggleButton value="all" >
                <Box>All games</Box>
              </ToggleButton>
              <ToggleButton value="game1">
                <Box><img src='/axie-logo.png' alt='game_logo' />Axie</Box>
              </ToggleButton>
              <ToggleButton value="game2">
                <Box><img src='/stepn-logo.jpeg' alt='game_logo_stepn' />Stepn</Box>
              </ToggleButton>
            </ToggleButtonGroup>
          </AccordionDetails>
        </Accordion>
      </div>
      <div className={styles.contentBox}>
        <section className={styles.topCover}>
          <Box className={styles.topCoverInfo}>
            <Typography variant='h4' className={styles.gameTitle}>Rentero NFT Market</Typography>
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <ScheduleIcon style={{ color: '#48475b', fontSize: "1.8rem" }} />
              <Typography variant="body2" display="block" className={styles.releaseTime}>Released at 22/06/01</Typography>
              <Box className={styles.gameStatus}>Beta</Box>
            </Box>
            <Typography className={styles.tagList}>
              <span>NFT</span>
              <span>Rent</span>
              <span>Lend</span>
            </Typography>
            <Typography className={styles.gameDesc}>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aenean euismod bibendum laoreet. Proin gravida dolor sit amet lacus accumsan et viverra justo commodo. Proin sodales pulvinar sic tempor. Sociis natoque penatibus et magnis dis parturient montes, nascetur...</Typography>
            <Box justifyContent="left" sx={{ display: 'flex', alignItems: 'center', mt: '1rem' }}>
              <span className={styles.websiteBtn}>Website &nbsp;&nbsp;&nbsp; <ArrowRightAltRoundedIcon /></span>
              <span className={styles.discordLink}></span>
              <span className={styles.twitterLink}></span>
              <span className={styles.telegramLink}></span>
              <span className={styles.facebookLink}></span>
            </Box>
          </Box>
        </section>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', marginBottom: '2.67rem' }}>
          <div className={styles.listTitle}>111 Items</div>
          <Box>
            <FormControl sx={{ minWidth: '10rem', mr: "2rem" }}>
              <Select
                // label="Blockchain"
                placeholder='Blockchain'
                value={selectedChain}
                // displayEmpty
                onChange={(e: SelectChangeEvent) => setSelectChain(e.target.value as string)}
                renderValue={(selected) => {
                  console.log(selected)
                  if (!selected) {
                    return <em>Blockchain</em>
                  }
                  // return selected
                }}
              >
                <MenuItem value=""><em>All Chain</em></MenuItem>
                <MenuItem value={"eth"}>Ethereum</MenuItem>
                <MenuItem value={"bsc"}>Binance</MenuItem>
              </Select>
            </FormControl>
            <FormControl sx={{ minWidth: '10rem' }}>
              <Select
                label="Sort By"
                value={sortBy}
                onChange={(e: SelectChangeEvent) => setSortBy(e.target.value as string)}
              >
                <MenuItem value={"price_desc"}>Price From Hight To Low</MenuItem>
                <MenuItem value={"price_asc"}>Price From Low To High</MenuItem>
              </Select>
            </FormControl>

          </Box>
        </Box>
        <div className={styles.nftCardList}>
          <NFTCard />
          <NFTCard />
          <NFTCard />
          <NFTCard />
          <NFTCard />
          <NFTCard />
          <NFTCard />
          <NFTCard />
        </div>
        <div className={styles.showMore}>Show more</div>
      </div>
    </div>
  )
}

export default Home
