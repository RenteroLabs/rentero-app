
const BaseURL = 'http://ec2-16-163-144-54.ap-east-1.compute.amazonaws.com:8080'


export const getGameInfos = async () => {
  const data = await fetch(`${BaseURL}/home/game/list`, { mode: 'cors' })
  return data.json()
}

export const getMarketNFTList = async ({ pageIndex, pageSize }: any) => {
  const data = await fetch(`${BaseURL}/market/list?pageIndex=${pageIndex}&pageSize=${pageSize}`)
  return data.json()
}