
export interface GameItem {
  gameName: string;
  gameDesc: string;
  gameLogo: string;
  gameCover: string;
  gameStatus: 0 | 1 | 2; // 0：正常集成中，1：Coming soon
  gameNFTCollection: string; // 游戏 NFT Collection 合约地址
  chainId: 1 | 3 | 137
}