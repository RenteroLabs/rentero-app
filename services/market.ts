
import { BaseURL } from '../constants'

export const getGameInfos = async () => {
  const data = await fetch(`${BaseURL}/home/game/list`, { mode: 'cors' })
  return data.json()
}

export const getMarketNFTList = async ({ pageIndex, pageSize }: any) => {
  const data = await fetch(`${BaseURL}/market/list?pageIndex=${pageIndex}&pageSize=${pageSize}`)
  return data.json()
}

export const getNFTDetail = async ({ skuId }: any) => {
  const data = await fetch(`${BaseURL}/market/detail?skuId=${skuId}`)
  return data.json()
}