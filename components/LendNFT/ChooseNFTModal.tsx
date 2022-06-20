import { Alert, Box, Button, Divider, Grid, Stack, Step, StepContent, StepLabel, Stepper, Typography } from '@mui/material'
import React, { useEffect, useMemo, useState } from 'react'
import { erc721ABI, useAccount, useContract, useContractRead, useNetwork, useSigner } from 'wagmi'
import { createAlchemyWeb3 } from "@alch/alchemy-web3";
import { Ropsten_WrapNFT, Ropsten_WrapNFT_ABI, Rss3WhitePaper, Rss3WhitePaperABI } from '../../constants/contractABI'
import AppDialog from '../Dialog'
import NFTCard from '../IntegrationCard/NFTCard'
import styles from './style.module.scss'
import { ALCHEMY_ETHEREUM_URL, ALCHEMY_POLYGON_URL, ALCHEMY_ROPSTEN_URL } from '../../constants';
import LendNFTStepModal from './LendNFTStepModal';
import LoadingButton from '@mui/lab/LoadingButton';
import SendIcon from '@mui/icons-material/Send';
import SaveIcon from '@mui/icons-material/Save';
import PageviewIcon from '@mui/icons-material/Pageview';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import { Send } from '@material-ui/icons';

interface ChooseNFTModalProps {
  trigger: React.ReactElement
  gameName: string
  gameNFTCollection: string
}

const formatNFTdata = (nftList: any[]) => {
  return nftList.map((item) => ({
    nftName: item.title,
    nftImage: item.media?.[0]?.gateway || 'https://tva1.sinaimg.cn/large/e6c9d24egy1h3esgombq6j20m80m83yv.jpg',
    nftNumber: parseInt(item.id.tokenId),
  }))
}

const ChooseNFTModal: React.FC<ChooseNFTModalProps> = (props) => {
  const { trigger, gameName, gameNFTCollection } = props
  const [selectedNFT, setSelectedNFT] = useState<string>('')
  const [hiddenModal, setHiddenModal] = useState<boolean>(false)
  const { activeChain } = useNetwork()
  const { data: account } = useAccount()
  const { data: signer } = useSigner()
  const [NFTList, setNFTList] = useState<any[]>([])

  const [isChooseNFT, setIsChooseNFT] = useState<boolean>(true)
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [errorMessage, setErrorMessage] = useState<string>('')
  const [activeStep, setActiveStep] = useState<number>(0)

  const contract721 = useContract({
    addressOrName: gameNFTCollection,
    contractInterface: erc721ABI,
    signerOrProvider: signer
  })

  const contractWrap = useContract({
    addressOrName: Ropsten_WrapNFT,
    contractInterface: Ropsten_WrapNFT_ABI,
    signerOrProvider: signer
  })


  const Web3 = useMemo(() => {
    let archemyUrl
    switch (activeChain?.id) {
      case 1: archemyUrl = ALCHEMY_ETHEREUM_URL; break;
      case 3: archemyUrl = ALCHEMY_ROPSTEN_URL; break;
      case 137: archemyUrl = ALCHEMY_POLYGON_URL; break;
      default: return;
    }
    return createAlchemyWeb3(archemyUrl)
  }, [activeChain])

  useEffect(() => {
    (async () => {
      if (!Web3 || !account) {
        setNFTList([])
      } else {
        // https://docs.alchemy.com/alchemy/enhanced-apis/nft-api/getnfts
        const nft = await Web3.alchemy.getNfts({
          owner: account.address,
          contractAddresses: [gameNFTCollection]
        })
        setNFTList(formatNFTdata(nft.ownedNfts))
        console.log(nft)
      }
    })()
  }, [Web3, account])


  const handleApproveErc721 = async () => {
    setErrorMessage('')
    if (isLoading) return
    setIsLoading(true)

    try {
      await contract721.approve(Ropsten_WrapNFT, parseInt(selectedNFT))
      setActiveStep(activeStep + 1)
    } catch (err) {
      setErrorMessage(err.message)
    }
    setIsLoading(false)
  }

  const handleStakeNFT = async () => {
    setErrorMessage('')
    if (isLoading) return
    setIsLoading(true)

    try {
      await contractWrap.stake(parseInt(selectedNFT))
      setActiveStep(activeStep + 1)
    } catch (err) {
      setErrorMessage(err.message)
    }
    setIsLoading(false)
  }

  const handleApproveWrapNFT = async () => {
    setErrorMessage('')
    if (isLoading) return
    setIsLoading(true)

    try {
      await contractWrap.approve(Ropsten_WrapNFT, parseInt(selectedNFT))
      setActiveStep(activeStep + 1)
    } catch (err) {
      setErrorMessage(err.message)
    }
    setIsLoading(false)
  }

  return <AppDialog
    trigger={trigger}
    title="Choose NFT to deposit"
    hiddenDialog={hiddenModal}
  >
    {isChooseNFT && <Box maxWidth="95rem" minWidth="65rem">
      <Grid
        container
        rowSpacing="2.67rem"
        columnSpacing="2.5rem"
        sx={{ p: '3.33rem', maxHeight: '46.66rem', overflowY: 'scroll' }} >
        <Grid item xs={12}>
          <Typography variant="h3" sx={{ fontSize: '2rem', lineHeight: '2.67rem' }} >{gameName}</Typography>
        </Grid>
        {
          NFTList && NFTList.map((item, index) => <Grid key={index} item xs="auto">
            <NFTCard {...item} selectedNFT={selectedNFT} setSelectedNFT={setSelectedNFT} />
          </Grid>)
        }
        {
          NFTList.length === 0 && <Stack sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', margin: 'auto' }}>
            <PageviewIcon sx={{ fontSize: '8rem' }} />
            <Typography sx={{ opacity: 0.8, textAlign: 'center', margin: '1rem auto' }}>
              No {gameName} NFT found in current wallet address
            </Typography>
          </Stack>
        }
      </Grid>
    </Box>}
    {isChooseNFT && <Box>
      {selectedNFT && <Typography className={styles.selectedMessage}>#{selectedNFT} have been selected</Typography>}
      <Stack direction="row" justifyContent="center" spacing="3.33rem" mb="1.33rem" mt="1.33rem">
        <Box className={styles.defaultButton} onClick={() => setHiddenModal(true)}>Cancel</Box>
        {/* <LendNFTStepModal trigger={} /> */}
        <Box className={styles.primaryButton} onClick={() => setIsChooseNFT(false)}>Confirm</Box>
      </Stack>
    </Box>}

    {
      !isChooseNFT && <Box className={styles.lendStep} width="65rem">
        <Box className={styles.lendStepTitle}>
          <Button startIcon={<ChevronLeftIcon />} onClick={() => setIsChooseNFT(true)}>Back</Button>
          <Typography>Current Lending NFT #{selectedNFT} to Market</Typography>
        </Box>
        <Divider sx={{ mb: '1rem' }} />
        {errorMessage && <Alert variant="outlined" severity="error">{errorMessage}</Alert>}
        <Stepper
          orientation="vertical"
          activeStep={activeStep}
        >
          <Step key="Approve 721 NFT">
            <StepLabel>
              Approve Your Game ERC721 NFT
            </StepLabel>
            <StepContent>
              <LoadingButton
                loading={isLoading}
                variant="contained"
                onClick={handleApproveErc721}
              >
                Approve
              </LoadingButton>
            </StepContent>
          </Step>
          <Step key="Stake ERC721 NFT & Receive WrapNFT">
            <StepLabel>
              Stake ERC721 NFT & Receive Your WrapNFT
            </StepLabel>
            <StepContent>
              <Typography>Stake your game NFT and receive a new WrapNFT, WrapNFT is to withdraw the credentials of your original NFT, don't lose it!</Typography>
              <LoadingButton
                loading={isLoading}
                variant="contained"
                onClick={handleStakeNFT}
                endIcon={<Send />}
                loadingPosition="end"
                sx={{ mt: '1rem' }}
              >
                Stake
              </LoadingButton>
            </StepContent>
          </Step>
          <Step key="Approve WrapNFT">
            <StepLabel>
              Approve WrapNFT
            </StepLabel>
            <StepContent >
              <LoadingButton
                loading={isLoading}
                variant="contained"
                onClick={handleApproveWrapNFT}
              >
                Approve
              </LoadingButton>
            </StepContent>
          </Step>
        </Stepper>
      </Box>
    }
  </AppDialog>
}

export default ChooseNFTModal