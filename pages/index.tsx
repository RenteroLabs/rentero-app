import { ReactElement, useEffect, useMemo, useRef, useState } from 'react'
import Head from 'next/head'
import type { NextPage } from 'next'
import ScheduleIcon from '@material-ui/icons/Schedule';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ArrowRightAltRoundedIcon from '@material-ui/icons/ArrowRightAltRounded';
import KeyboardArrowDownOutlinedIcon from '@mui/icons-material/KeyboardArrowDownOutlined';
import { Accordion, AccordionDetails, AccordionSummary, Box, Card, Checkbox, FormControlLabel, IconButton, Menu, MenuItem, MenuList, Skeleton, Stack, ToggleButton, ToggleButtonGroup, Typography, useMediaQuery, useStepperContext } from '@mui/material'
import { useQuery, gql, useLazyQuery } from '@apollo/client'
import NFTCard from '../components/NFTCard'
import styles from '../styles/Home.module.scss'
import { SORT_BY, CHAINTYPE_SUPPORTED } from '../utils/constants'
import { useLocalStorageState, useRequest } from 'ahooks'
import { getGameInfos, getMarketNFTList, getNFTInfo } from '../services/market'
import { dateFormat } from '../utils/format'
import { useIsMounted } from '../hooks'
import SkeletonNFTCard from '../components/NFTCard/SkeletonNFTCard'
import Link from 'next/link';
import Layout2 from '../components/layout2';
import { GET_LEASES, GET_TOTAL_LEASES } from '../constants/documentNode';
import { LeaseItem } from '../types';
import WestIcon from '@mui/icons-material/West';
import FilterAltIcon from '@mui/icons-material/FilterAlt';
import classNames from 'classnames/bind';

const cx = classNames.bind(styles)

const Home: NextPage<{ gamesInfo: Record<string, any>[] }> = ({ gamesInfo }) => {
  const isMounted = useIsMounted()
  const [currentGame, setCurrentGame] = useState<number>(0)

  const minMobileWidth = useMediaQuery("(max-width: 600px)")
  const [showLeftBar, setShowLeftBar] = useState<boolean>(true)

  const chainTypeRef = useRef<HTMLElement>()
  const sortTypeRef = useRef<HTMLElement>()
  const [chainTypeShow, setChainTypeShow] = useState<boolean>(false)
  const [sortTypeShow, setSortTypeShow] = useState<boolean>(false)
  const [selectedChain, setSelectedChain] = useState<number>(0)
  const [selectedSortBy, setSelectedSortBy] = useState<number>(0)

  const [currentPage, setCurrentPage] = useState<number>(1)
  const [pageSize, setPageSize] = useState<number>(12)
  const [leasesList, setLeasesList] = useState<LeaseItem[]>([])
  const [NFTList, setNFTList] = useState<Record<string, any>[]>([])
  // const [trialZoneList, setTrialZoneList] = useState<Record<string, any>[]>([])
  const [NFTTotal, setNFTTotal] = useState<number>(0)

  const [isWhitelistOnly, setIsWhitelistOnly] = useState<boolean>(false)
  const [whitelistNums, setWhitelistNums] = useState<number>(0)
  const [whitelistLists, setWhitelistLists] = useState<Record<string, any>[]>([])

  const currentGameInfo = useMemo(() => {
    return gamesInfo[currentGame] || {}
  }, [currentGame, gamesInfo])

  useQuery(GET_TOTAL_LEASES, {
    variables: { id: "all" },
    onCompleted({ summary }) {
      setNFTTotal(summary.leaseCount)
    }
  })

  const { loading: isLeasesLoading, refetch: getLeasesList } = useQuery(GET_LEASES, {
    variables: {
      pageSize: pageSize,
      skip: (currentPage - 1) * pageSize
    },
    onCompleted(data) {
      setLeasesList(currentPage === 1 ? data.leases : [...leasesList, ...data.leases])
    }
  })

  const handelGetMoreList = () => {
    setCurrentPage(currentPage + 1)
    getLeasesList()
  }

  const handleCheckWhitelist = (_: any, checked: boolean) => {
    if (checked) {
      setIsWhitelistOnly(true)
      setNFTTotal(whitelistNums)
      setNFTList([...whitelistLists])
    } else {
      setIsWhitelistOnly(false)
      setCurrentPage(1)
      setNFTList([])
      // fetchNFTList({ pageIndex: 1, pageSize: 12 });
    }
  }

  return (
    <div className={styles.container}>
      <Head>
        <title>Market | Rentero</title>
        <meta name="description" content="Lend and rent your NFTs" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <div className={showLeftBar ? styles.leftNav : styles.leftNavMin}>
        <Stack className={styles.leftGameList}>
          <Box className={showLeftBar ? styles.sidebarController : styles.sidebarControllerMin}>
            <IconButton onClick={() => setShowLeftBar(!showLeftBar)}>
              {
                showLeftBar ?
                  <WestIcon fontSize="inherit" /> :
                  <FilterAltIcon fontSize="large" />
              }
            </IconButton>
          </Box>
          <Box
            className={cx({
              'gameItem': true,
              'activeItem': currentGame == 0
            })}
            onClick={() => setCurrentGame(0)}
          >
            <img src='/rentero_logo_big.png' alt='rentero' />
            {showLeftBar && <Typography>All Game</Typography>}
          </Box>
          <Box className={cx({
            'gameItem': true,
            'activeItem': currentGame == 1
          })}
            onClick={() => setCurrentGame(1)}
          >
            <img src='/axie-logo.png' alt='game_logo' />
            {showLeftBar && <Typography>Axie</Typography>}
          </Box>
          <Box className={cx({
            'gameItem': true,
            'activeItem': currentGame == 2
          })}
            onClick={() => setCurrentGame(2)}
          >
            <img src='/stepn-logo.jpeg' alt='game_logo_stepn' />
            {showLeftBar && <Typography>Stepn</Typography>}
          </Box>
        </Stack>
      </div>
      <div className={styles.contentBox}>
        <section className={styles.topCover}>
          <img src="./rentero_top_banner.png" className={styles.topCoverImage} />
          <img src='./rentero_logo_big.png' className={styles.topLogo} />

          <Box className={styles.topCoverInfo}>
            <Stack
              direction={minMobileWidth ? 'column' : 'row'}
              spacing={minMobileWidth ? '1.5rem' : '2rem'}
              sx={{ justifyContent: 'space-between' }}>
              <Typography variant='h4' className={styles.gameTitle}>
                {currentGameInfo.gameName}
              </Typography>
              {minMobileWidth &&
                <Typography className={styles.gameDesc}>
                  {currentGameInfo.gameDesc}
                </Typography>}
              <Box className={styles.linkList}>
                <a href={currentGameInfo.gameHomeUrl} target="_blank" rel="noreferrer">
                  <span className={styles.websiteBtn}>
                    Website &nbsp;&nbsp;&nbsp;
                    <ArrowRightAltRoundedIcon style={{ width: '18px', height: '18px', color: 'white' }} />
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
            </Stack>
            {!minMobileWidth && <Typography className={styles.gameDesc}>{currentGameInfo.gameDesc}</Typography>}
          </Box>
        </section>

        {/* <Box className={styles.trialZone}>
          <Box className={styles.headerTitle}>
            <Typography className={styles.titleText}>
              Trial Zone
              <img src='/fire.png' />
            </Typography>
            <Typography className={styles.moreLink}>
              <Link href="/trial">See All&nbsp; &gt;</Link>
            </Typography>
          </Box>
          <Box className={styles.trialNFTListBox}>
            <Box className={styles.trialNFTList}>
              {isTrialLoading && <Box>
                <Box className={styles.nftCardList}>
                  <SkeletonNFTCard />
                  <SkeletonNFTCard />
                  <SkeletonNFTCard />
                  <SkeletonNFTCard />
                </Box>
              </Box>}
              {
                trialZoneList.map((item, index) => {
                  return <NFTCard nftInfo={item} key={index} mode="@trial" />
                })
              }
            </Box>
          </Box>
        </Box> */}

        <Box className={styles.cardListBox}>
          <Box className={styles.listTitleBox} >
            <div className={styles.listTitle}>
              {NFTTotal} Items &nbsp;
              {/* <span onClick={() => fetchNFTList({ pageIndex: 1, pageSize: 12 })}><AutorenewIcon /></span> */}
            </div>
            <Box className={styles.sortList}>
              {/* {whitelistNums > 0 && <FormControlLabel
              control={<Checkbox
                disableRipple
                onChange={handleCheckWhitelist}
                sx={{
                  '& .MuiSvgIcon-root': { fontSize: 24 },
                  '&.Mui-checked': { color: '#5adcfe' }
                }}
              />}
              label={<>
                <Box component="span" className={styles.whitelistForUser}>
                  Whitelist Only For Me
                </Box>
                <Box component="span" className={styles.whitelistNum}>{whitelistNums}</Box>
              </>}
            />} */}
              {/* <Box
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
            </Menu> */}
              {/* <Box
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
            </Menu>*/}
            </Box>
          </Box>
          <div className={styles.nftCardList}>
            {
              leasesList?.map((item, index) => {
                return <NFTCard nftInfo={item} key={index} />
              })
            }
            {
              isLeasesLoading && <>
                <SkeletonNFTCard />
                <SkeletonNFTCard />
                <SkeletonNFTCard />
                <SkeletonNFTCard />
                <SkeletonNFTCard />
                <SkeletonNFTCard />
                <SkeletonNFTCard />
                <SkeletonNFTCard />
              </>
            }
          </div>
          {isMounted && !isWhitelistOnly && !isLeasesLoading &&
            currentPage * pageSize < NFTTotal &&
            <div className={styles.showMore}>
              <span onClick={handelGetMoreList}>Show more</span>
            </div>}
        </Box>
      </div>
    </div >
  )
}

// SSG 在构建 build 时获取各游戏介绍信息
export async function getStaticProps() {
  const data = await getGameInfos()
  return {
    props: {
      gamesInfo: data.data || {}
    }
  }
}


// Home.getLayout = function getLayout(page: ReactElement) {
//   return (
//     <Layout2>{page}</Layout2>
//   )
// }
export default Home
