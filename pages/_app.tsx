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
import { ROPSTEN_THEGRAPH, SUPPORT_CHAINS } from '../constants'
import { NextPage } from 'next/types'
import type { ReactElement, ReactNode } from 'react'
import Layout2 from '../components/layout2'
import { ApolloClient, ApolloProvider, InMemoryCache } from '@apollo/client'

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

const graphql = new ApolloClient({
  uri: ROPSTEN_THEGRAPH,
  cache: new InMemoryCache()
})

export type NextPageWithLayout = NextPage & {
  getLayout?: (page: ReactElement) => ReactNode
}

type AppPropsWithLayout = AppProps & {
  Component: NextPageWithLayout
}

function MyApp({ Component, pageProps }: AppPropsWithLayout) {

  // const getLayout = Component.getLayout

  return <ThemeProvider theme={AppTheme}>
    <StyledEngineProvider injectFirst>
      <Head>
        <meta name="viewport" content="initial-scale=1, width=device-width" />
      </Head>
      <CssBaseline />
      <WagmiConfig client={client}>
        <ApolloProvider client={graphql}>
          {/* {getLayout ?
          getLayout(<Component {...pageProps} />) :
          <Layout><Component {...pageProps} /></Layout>} */}
          <Layout2><Component {...pageProps} /></Layout2>
        </ApolloProvider>
      </WagmiConfig>
    </StyledEngineProvider>
  </ThemeProvider>
}

export default MyApp
