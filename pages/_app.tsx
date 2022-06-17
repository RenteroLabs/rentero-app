import '../styles/globals.css'
import type { AppProps } from 'next/app'
import Layout from '../components/layout'
import { ThemeProvider, StyledEngineProvider } from '@mui/material/styles'
import CssBaseline from '@mui/material/CssBaseline'
import AppTheme from '../theme'
import Head from 'next/head'

import { WagmiConfig, configureChains, createClient, defaultChains, chain } from 'wagmi'
import { infuraProvider } from 'wagmi/providers/infura'
import { publicProvider } from 'wagmi/providers/public'
import { MetaMaskConnector } from 'wagmi/connectors/metaMask'
import { WalletConnectConnector } from 'wagmi/connectors/walletConnect'
import { SUPPORT_CHAINS } from '../constants'

const infuraId = process.env.NEXT_PUBLIC_INFURA_ID
const { chains, provider, webSocketProvider } = configureChains(SUPPORT_CHAINS, [
  infuraProvider({ infuraId }),
  publicProvider()
])

const client = createClient({
  autoConnect: true,
  connectors: [
    new MetaMaskConnector({
      chains,
    }),
    new WalletConnectConnector({
      chains,
      options: {
        qrcode: true
      }
    })
  ],
  provider,
  webSocketProvider
})

function MyApp({ Component, pageProps }: AppProps) {
  return <ThemeProvider theme={AppTheme}>
    <StyledEngineProvider injectFirst>
      <Head>
        <meta name="viewport" content="initial-scale=1, width=device-width" />
      </Head>
      <CssBaseline />
      <WagmiConfig client={client}>
        <Layout>
          <Component {...pageProps} />
        </Layout>
      </WagmiConfig>
    </StyledEngineProvider>
  </ThemeProvider>
}

export default MyApp
