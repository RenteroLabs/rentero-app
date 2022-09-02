import { ApolloClient, InMemoryCache } from '@apollo/client'

// thegraph service address
const RINKEBY_THEGRAPH = 'https://rinkeby.rentero.io/subgraphs/name/john-rentero/rentero-market'
const BSC_TEST_THEGRAPH = 'https://bsc-testnet.rentero.io/subgraphs/name/john-rentero/rentero-market'

const rinkebyGraph = new ApolloClient({
  uri: RINKEBY_THEGRAPH,
  cache: new InMemoryCache()
})

const bsctestGraph = new ApolloClient({
  uri: BSC_TEST_THEGRAPH,
  cache: new InMemoryCache()
})

export {
  rinkebyGraph,
  bsctestGraph
}