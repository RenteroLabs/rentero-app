import { useEffect, useMemo, useRef, useState } from 'react'
import Link from 'next/link'
import Head from 'next/head'
import Image from 'next/image'
import type { NextPage } from 'next'
import ScheduleIcon from '@material-ui/icons/Schedule';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ArrowRightAltRoundedIcon from '@material-ui/icons/ArrowRightAltRounded';
import KeyboardArrowDownOutlinedIcon from '@mui/icons-material/KeyboardArrowDownOutlined';
import { Accordion, AccordionDetails, AccordionSummary, Box, Menu, MenuItem, ToggleButton, ToggleButtonGroup, Typography } from '@mui/material'
import NFTCard from '../components/NFTCard'
import styles from '../styles/Home.module.scss'
import { SORT_BY, CHAINTYPE_SUPPORTED } from '../utils/constants'
import { useRequest } from 'ahooks'
import { getGameInfos } from '../services/market'
import { dateFormat } from '../utils/format'

const Home: NextPage<{ gamesInfo: Record<string, any>[] }> = ({ gamesInfo }) => {
  const [currentGame, setCurrentGame] = useState<string>("0")

  const chainTypeRef = useRef<HTMLElement>()
  const sortTypeRef = useRef<HTMLElement>()
  const [chainTypeShow, setChainTypeShow] = useState<boolean>(false)
  const [sortTypeShow, setSortTypeShow] = useState<boolean>(false)
  const [selectedChain, setSelectedChain] = useState<number>(0)
  const [selectedSortBy, setSelectedSortBy] = useState<number>(0)


  const currentGameInfo = useMemo(() => {
    return gamesInfo[parseInt(currentGame)] || {}
  }, [currentGame, gamesInfo])

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
              onChange={(_, val) => {
                if (val) { setCurrentGame(val) }
              }}
              sx={{ textAlign: 'left' }}
            >
              <ToggleButton value="0" >
                <Box>All games</Box>
              </ToggleButton>
              <ToggleButton value="1">
                <Box><img src='/axie-logo.png' alt='game_logo' />Axie</Box>
              </ToggleButton>
              <ToggleButton value="2">
                <Box><img src='/stepn-logo.jpeg' alt='game_logo_stepn' />Stepn</Box>
              </ToggleButton>
            </ToggleButtonGroup>
          </AccordionDetails>
        </Accordion>
      </div>
      <div className={styles.contentBox}>
        <section className={styles.topCover}>
          <Box className={styles.topCoverInfo}>
            <Typography variant='h4' className={styles.gameTitle}>
              {currentGameInfo.gameName}
            </Typography>
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <ScheduleIcon style={{ color: '#48475b', fontSize: "1.8rem" }} />
              <Typography variant="body2" display="block" className={styles.releaseTime}>
                Released at {dateFormat("YYYY-mm-dd", new Date(currentGameInfo.releaseTime))}
              </Typography>
              <Box className={styles.gameStatus}>Beta</Box>
            </Box>
            <Typography className={styles.tagList}>
              <span>NFT</span>
              <span>Rent</span>
              <span>Lend</span>
            </Typography>
            <Typography className={styles.gameDesc}>{currentGameInfo.gameDesc}</Typography>
            <Box justifyContent="left" sx={{ display: 'flex', alignItems: 'center', mt: '1rem' }} >
              <a href={currentGameInfo.gameHomeUrl} target="_blank" rel="noreferrer">
                <span className={styles.websiteBtn}>
                  Website &nbsp;&nbsp;&nbsp; <ArrowRightAltRoundedIcon />
                </span>
              </a>
              {
                currentGameInfo.discordUrl &&
                <a href={currentGameInfo.discordUrl} target="_blank" rel="noreferrer">
                  <span className={styles.discordLink}></span>
                </a>
              }
              {
                currentGameInfo.twitterUrl &&
                <a href={currentGameInfo.twitterUrl} target="_blank" rel="noreferrer">
                  <span className={styles.twitterLink}></span>
                </a>
              }
              {
                currentGameInfo.telegramUrl &&
                <a href={currentGameInfo.telegramUrl} target="_blank" rel="noreferrer">
                  <span className={styles.telegramLink}></span>
                </a>
              }
              {
                currentGameInfo.facebookUrl &&
                <a href={currentGameInfo.facebookUrl} target="_blank" rel="noreferrer">
                  <span className={styles.facebookLink}></span>
                </a>
              }
            </Box>
          </Box>
        </section>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', marginBottom: '2.67rem' }}>
          <div className={styles.listTitle}>111 Items</div>
          <Box className={styles.sortList}>
            <Box
              ref={chainTypeRef}
              onClick={() => setChainTypeShow(true)}
            >
              {CHAINTYPE_SUPPORTED[selectedChain]}
              <KeyboardArrowDownOutlinedIcon />
            </Box>
            <Menu
              anchorEl={chainTypeRef.current}
              open={chainTypeShow}
              onClose={() => setChainTypeShow(false)}
            >
              {CHAINTYPE_SUPPORTED.map((item, index) =>
                <MenuItem
                  key={index}
                  onClick={() => {
                    setChainTypeShow(false)
                    setSelectedChain(index)
                  }}>
                  {item}
                </MenuItem>)}
            </Menu>
            <Box
              ref={sortTypeRef}
              onClick={() => setSortTypeShow(true)}
            >
              {SORT_BY[selectedSortBy]}
              <KeyboardArrowDownOutlinedIcon />
            </Box>
            <Menu
              anchorEl={sortTypeRef.current}
              open={sortTypeShow}
              onClose={() => setSortTypeShow(false)}
            >
              {SORT_BY.map((item, index) =>
                <MenuItem
                  key={index}
                  onClick={() => {
                    setSortTypeShow(false)
                    setSelectedSortBy(index)
                  }}
                >
                  {item}
                </MenuItem>
              )}
            </Menu>
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
        <div className={styles.showMore}><span>Show more</span></div>
      </div>
    </div >
  )
}

// SSG 在构建 build 时获取各游戏介绍信息
export async function getStaticProps() {
  const data = await getGameInfos()
  return {
    props: {
      gamesInfo: data.data
    }
  }
}

export default Home
