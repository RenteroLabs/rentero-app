
import { BaseURL } from '../constants'
import qs from 'qs'

export const getGameInfos = async () => {
  const data = await fetch(`${BaseURL}/home/game/list`, { mode: 'cors' })
  return data.json()
}

interface NFTListParams {
  pageIndex: number,
  pageSize?: number,
  whiteAddress?: boolean
  mode?: 'FreeTrial' | 'Dividend',
  token?: any;
}
export const getMarketNFTList = async (params: NFTListParams) => {
  const { token, ...restParams } = params
  const headerToken = {
    sessionToken: token
  }
  const data = await fetch(`${BaseURL}/market/list?${qs.stringify(restParams)}`, {
    headers: token ? headerToken : {}
  })
  return data.json()
}

export const getNFTDetail = async ({ skuId }: any) => {
  const data = await fetch(`${BaseURL}/market/detail?skuId=${skuId}`)
  return data.json()
}