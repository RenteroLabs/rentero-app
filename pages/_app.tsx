import '../styles/globals.css'
import type { AppProps } from 'next/app'
import Layout from '../components/layout'
import { ThemeProvider, StyledEngineProvider } from '@mui/material/styles'
import CssBaseline from '@mui/material/CssBaseline'
import AppTheme from '../theme'

function MyApp({ Component, pageProps }: AppProps) {
  return <ThemeProvider theme={AppTheme}>
    <StyledEngineProvider injectFirst>
      <CssBaseline />
      <Layout>
        <Component {...pageProps} />
      </Layout>
    </StyledEngineProvider>
  </ThemeProvider>
}

export default MyApp
