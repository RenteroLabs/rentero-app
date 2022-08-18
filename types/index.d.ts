
export interface GameItem {
  gameName: string;
  gameDesc: string;
  gameLogo: string;
  gameCover: string;
  gameStatus: 0 | 1 | 2; // 0：正常集成中，1：Coming soon
  gameNFTCollection: string; // 游戏 NFT Collection 合约地址
  chainId: 1 | 3 | 137
}

export interface LeaseItem {
  deposit: string;
  daysPerPeriod: string;
  erc20Address: string;
  expires: string;
  id: string;
  lender: string;
  maxRentalPeriods: string;
  minRentalPeriods: string;
  nftAddress: string;
  rentPerDay: string;
  renter: string;
  status: string;
  tokenId: string;
  whitelist: string;
}

export interface TokenInfo {
  name: string;
  address: string;
  logo: string;
  decimal: number
}