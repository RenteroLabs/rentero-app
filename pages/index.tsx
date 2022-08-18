import { ReactElement, useEffect, useMemo, useRef, useState } from 'react'
import Head from 'next/head'
import type { NextPage } from 'next'
import ScheduleIcon from '@material-ui/icons/Schedule';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ArrowRightAltRoundedIcon from '@material-ui/icons/ArrowRightAltRounded';
import KeyboardArrowDownOutlinedIcon from '@mui/icons-material/KeyboardArrowDownOutlined';
import { Accordion, AccordionDetails, AccordionSummary, Box, Card, Checkbox, FormControlLabel, Menu, MenuItem, MenuList, Skeleton, ToggleButton, ToggleButtonGroup, Typography, useMediaQuery, useStepperContext } from '@mui/material'
import { useQuery, gql, useLazyQuery } from '@apollo/client'
import NFTCard from '../components/NFTCard'
import styles from '../styles/Home.module.scss'
import { SORT_BY, CHAINTYPE_SUPPORTED } from '../utils/constants'
import { useLocalStorageState, useRequest } from 'ahooks'
import { getGameInfos, getMarketNFTList } from '../services/market'
import { dateFormat } from '../utils/format'
import { useIsMounted } from '../hooks'
import SkeletonNFTCard from '../components/NFTCard/SkeletonNFTCard'
import Link from 'next/link';
import Layout2 from '../components/layout2';
import { GET_LEASES } from '../constants/documentNode';
import { LeaseItem } from '../types';

const Home: NextPage<{ gamesInfo: Record<string, any>[] }> = ({ gamesInfo }) => {
  const isMounted = useIsMounted()
  const [rawToken] = useLocalStorageState<string>('token')
  const [currentGame, setCurrentGame] = useState<string>("0")

  const minMobileWidth = useMediaQuery("(max-width: 600px)")

  const chainTypeRef = useRef<HTMLElement>()
  const sortTypeRef = useRef<HTMLElement>()
  const [chainTypeShow, setChainTypeShow] = useState<boolean>(false)
  const [sortTypeShow, setSortTypeShow] = useState<boolean>(false)
  const [selectedChain, setSelectedChain] = useState<number>(0)
  const [selectedSortBy, setSelectedSortBy] = useState<number>(0)

  const [currentPage, setCurrentPage] = useState<number>(1)
  const [pageSize, setPageSize] = useState<number>(20)
  const [leasesList, setLeasesList] = useState<LeaseItem[]>([])
  const [NFTList, setNFTList] = useState<Record<string, any>[]>([])
  // const [trialZoneList, setTrialZoneList] = useState<Record<string, any>[]>([])
  const [NFTTotal, setNFTTotal] = useState<number>(0)

  const [isWhitelistOnly, setIsWhitelistOnly] = useState<boolean>(false)
  const [whitelistNums, setWhitelistNums] = useState<number>(0)
  const [whitelistLists, setWhitelistLists] = useState<Record<string, any>[]>([])

  const currentGameInfo = useMemo(() => {
    return gamesInfo[parseInt(currentGame)] || {}
  }, [currentGame, gamesInfo])

  // market list
  // const { run: fetchNFTList, loading } = useRequest(getMarketNFTList, {
  //   manual: true,
  //   onSuccess: async ({ data }) => {
  //     const { totalRemain, pageContent = [] } = data || {}
  //     setNFTList([...NFTList, ...pageContent])
  //     setNFTTotal(totalRemain)
  //   }
  // })

  // 白名单 NFT 数据
  // const { run: fetchWhitelistNFT } = useRequest(getMarketNFTList, {
  //   manual: true,
  //   onSuccess: ({ data }) => {
  //     const { totalRemain, pageContent } = data || {}
  //     setWhitelistNums(totalRemain || 0)
  //     setWhitelistLists(pageContent || [])
  //   }
  // })

  // 试玩 NFT 数据
  // const { run: fetchTrialList, loading: isTrialLoading } = useRequest(getMarketNFTList, {
  //   manual: true,
  //   onSuccess: ({ data }) => {
  //     const { pageContent = [] } = data || {}
  //     setTrialZoneList([...pageContent.splice(0, 4)])
  //   }
  // })

  const [getLeasesList, { loading: isLeasesLoading }] = useLazyQuery(GET_LEASES, {
    variables: {
      pageSize: pageSize,
      skip: (currentPage - 1) * pageSize
    },
    onCompleted(data) {
      console.log(data)

      setLeasesList(currentPage === 1 ? data.leases : [...leasesList, ...data.leases])
    }
  })

  const jwtToken = useMemo(() => {
    if (!rawToken) return ''
    return rawToken.split('*')[1]
  }, [rawToken])

  useEffect(() => {
    getLeasesList()

    // fetchNFTList({ pageIndex: 1, pageSize: 12 });
    // fetchWhitelistNFT({ pageIndex: 1, token: jwtToken, whiteAddress: true });
    // fetchTrialList({ pageIndex: 1, pageSize: 4, mode: 'FreeTrial' });
  }, [currentPage])

  const handelGetMoreList = async () => {
    // fetchNFTList({ pageIndex: currentPage + 1, pageSize: 12 })

    setCurrentPage(currentPage + 1)
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

      <div className={styles.leftNav}>
        <Accordion sx={{ borderRadius: '1rem 1rem 0rem 0rem', backgroundColor: 'transparent' }} defaultExpanded disableGutters={true}>
          <AccordionSummary expandIcon={<ExpandMoreIcon sx={{ width: '18px', height: '18px' }} />} className={styles.accordionHeader}
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
                if (val == 0) { setCurrentGame(val) }
              }}
              sx={{ textAlign: 'left' }}
            >
              <ToggleButton value="0" >
                <Box>All games</Box>
              </ToggleButton>
              {/* <ToggleButton value="1" sx={{ cursor: 'not-allowed' }}>
                <Box><img src='/axie-logo.png' alt='game_logo' />Axie</Box>
              </ToggleButton>
              <ToggleButton value="2" sx={{ cursor: 'not-allowed' }}>
                <Box><img src='/stepn-logo.jpeg' alt='game_logo_stepn' />Stepn</Box>
              </ToggleButton> */}
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
            {currentGame !== '-1' && <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <ScheduleIcon style={{ color: '#48475b', width: '22px', height: '22px' }} />
              <Typography variant="body2" display="block" className={styles.releaseTime}>
                Released at {dateFormat("YYYY-mm-dd", new Date(currentGameInfo.releaseTime))}
              </Typography>
              <Box className={styles.gameStatus}>Beta</Box>
            </Box>}
            {currentGame !== '-1' && <Typography className={styles.tagList}>
              <span>NFT</span>
              <span>Rent</span>
              <span>Lend</span>
            </Typography>}
            <Typography className={styles.gameDesc}>{currentGameInfo.gameDesc}</Typography>
            {currentGame !== '-1' && <Box justifyContent="left" sx={{ display: 'flex', alignItems: 'center', mt: '1rem' }} >
              <a href={currentGameInfo.gameHomeUrl} target="_blank" rel="noreferrer">
                <span className={styles.websiteBtn}>
                  Website &nbsp;&nbsp;&nbsp; <ArrowRightAltRoundedIcon style={{ width: '18px', height: '18px', color: 'white' }} />
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
            </Box>}
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
        </div>

        {/* 骨架图 */}
        {isLeasesLoading && <Box>
          <Box className={styles.nftCardList}>
            <SkeletonNFTCard />
            <SkeletonNFTCard />
            <SkeletonNFTCard />
            <SkeletonNFTCard />
          </Box>
          <Box className={styles.nftCardList}>
            <SkeletonNFTCard />
            <SkeletonNFTCard />
            <SkeletonNFTCard />
            <SkeletonNFTCard />
          </Box>
        </Box>}

        {isMounted && !isWhitelistOnly &&
          <div className={styles.showMore}>
            <span onClick={handelGetMoreList}>Show more</span>
          </div>}
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
