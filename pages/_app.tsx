import '../styles/globals.css'
import type { AppProps } from 'next/app'
import Layout from '../components/layout'
import { ThemeProvider } from '@mui/material/styles'
import CssBaseline from '@mui/material/CssBaseline'
import AppTheme from '../theme'

function MyApp({ Component, pageProps }: AppProps) {
  return <ThemeProvider theme={AppTheme}>
    <CssBaseline />
    <Layout>
      <Component {...pageProps} />
    </Layout>
  </ThemeProvider>
}

export default MyApp
