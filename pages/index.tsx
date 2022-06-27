import { useEffect, useMemo, useRef, useState } from 'react'
import Link from 'next/link'
import Head from 'next/head'
import Image from 'next/image'
import type { NextPage } from 'next'
import ScheduleIcon from '@material-ui/icons/Schedule';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ArrowRightAltRoundedIcon from '@material-ui/icons/ArrowRightAltRounded';
import KeyboardArrowDownOutlinedIcon from '@mui/icons-material/KeyboardArrowDownOutlined';
import { Accordion, AccordionDetails, AccordionSummary, Box, Card, Menu, MenuItem, MenuList, Skeleton, ToggleButton, ToggleButtonGroup, Typography, useStepperContext } from '@mui/material'
import NFTCard from '../components/NFTCard'
import styles from '../styles/Home.module.scss'
import { SORT_BY, CHAINTYPE_SUPPORTED } from '../utils/constants'
import { useRequest } from 'ahooks'
import { getGameInfos, getMarketNFTList } from '../services/market'
import { dateFormat } from '../utils/format'
import { useAlchemyService, useIsMounted } from '../hooks'
import { Ropsten_721_AXE_NFT } from '../constants/contractABI'
import SkeletonNFTCard from '../components/NFTCard/SkeletonNFTCard'
import { web3GetNFTMetadata } from '../services/web3NFT'
import AutorenewIcon from '@mui/icons-material/Autorenew';

const Home: NextPage<{ gamesInfo: Record<string, any>[] }> = ({ gamesInfo }) => {
  const isMounted = useIsMounted()
  const [currentGame, setCurrentGame] = useState<string>("0")

  const chainTypeRef = useRef<HTMLElement>()
  const sortTypeRef = useRef<HTMLElement>()
  const [chainTypeShow, setChainTypeShow] = useState<boolean>(false)
  const [sortTypeShow, setSortTypeShow] = useState<boolean>(false)
  const [selectedChain, setSelectedChain] = useState<number>(0)
  const [selectedSortBy, setSelectedSortBy] = useState<number>(0)

  const [currentPage, setCurrentPage] = useState<number>(1)
  const [NFTList, setNFTList] = useState<Record<string, any>[]>([])
  const [NFTTotal, setNFTTotal] = useState<number>(0)
  const [NFTMetadataList, setNFTMetadataList] = useState<Record<number, any>>({})

  // const Web3 = useAlchemyService()

  const currentGameInfo = useMemo(() => {
    return gamesInfo[parseInt(currentGame)] || {}
  }, [currentGame, gamesInfo])

  const { run: fetchNFTList, loading } = useRequest(getMarketNFTList, {
    manual: true,
    onSuccess: async ({ data }) => {
      const { totalRemain, pageContent } = data
      setNFTList(pageContent)
      setNFTTotal(totalRemain)

      // let metalist: Record<number, any> = {}
      // // 获取 MarketList 中每个 NFT 的 metadata 数据
      // pageContent.forEach(async (item: any) => {
      //   const result = await Web3?.alchemy.getNftMetadata({
      //     // 此处在此直接请求 ERC721 合约地址
      //     contractAddress: Ropsten_721_AXE_NFT || item.wrapNftAddress,
      //     tokenId: item.nftUid,
      //     tokenType: 'erc721'
      //   })
      //   metalist[parseInt(item.skuId)] = result
      // });

      const metarequests = pageContent.map((item: any) => {
        // return Web3?.alchemy.getNftMetadata({
        //   // 此处在此直接请求 ERC721 合约地址
        //   contractAddress: Ropsten_721_AXE_NFT || item.wrapNftAddress,
        //   tokenId: item.nftUid,
        //   tokenType: 'erc721'
        // })
        return web3GetNFTMetadata({
          contractAddress: Ropsten_721_AXE_NFT || item.wrapNftAddress,
          tokenId: item.nftUid,
          tokenType: 'erc721'
        })
      })
      const result = await Promise.all(metarequests)
      let newMetaList: Record<number, any> = {}
      result.forEach((item: any, index: number) => {
        newMetaList[parseInt(pageContent[index].skuId)] = item
      })

      setNFTMetadataList({ ...NFTMetadataList, ...newMetaList })
    }
  })

  useEffect(() => {
    fetchNFTList({ pageIndex: 1, pageSize: 10 })
  }, [])

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
                if (val == 0) { setCurrentGame(val) }
              }}
              sx={{ textAlign: 'left' }}
            >
              <ToggleButton value="0" >
                <Box>All games</Box>
              </ToggleButton>
              <ToggleButton value="1" sx={{ cursor: 'not-allowed' }}>
                <Box><img src='/axie-logo.png' alt='game_logo' />Axie</Box>
              </ToggleButton>
              <ToggleButton value="2" sx={{ cursor: 'not-allowed' }}>
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
              <ScheduleIcon style={{ color: '#48475b', width: '22px', height: '22px' }} />
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
            </Box>
          </Box>
        </section>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', marginBottom: '2.67rem' }}>
          <div className={styles.listTitle}>{NFTTotal} Items &nbsp;<span onClick={() => fetchNFTList({ pageIndex: 1, pageSize: 10 })}><AutorenewIcon /></span></div>
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

        {/* 骨架图 */}
        {loading && <Box>
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
        <div className={styles.nftCardList}>
          {
            !loading && NFTList.map((item, index) => {
              return <NFTCard nftInfo={item} metadata={NFTMetadataList[parseInt(item.skuId)]} key={index} />
            })
          }
        </div>
        {((10 * currentPage) < NFTTotal) && isMounted && <div className={styles.showMore}><span>Show more</span></div>}
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
