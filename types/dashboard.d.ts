borrowAddress: "0x66567071d55a9fbe6b3944172592961c1c414075"
borrowerEarnRatio: 70
currencyKind: "ETH"
expectedInCome: 0
lenderAddress: "0x66567071d55a9fbe6b3944172592961c1c414075"
lenderEarnRatio: 20
minGain: 100
newIncomeTime: null
newIncomeValue: 0
nftUid: 101
orderId: 10000
orderTime: 1656068000
propertyUrl: "this is url "
skuId: 10000
status: "Cancel"
totalInComeValue: 0
wrapNftAddress: "0x9b01041815b301b728ed2b10a39ccb19f14cd4b2"


export interface OrderInfo {
  borrowAddress: string,
  borrowerEarnRatio: number,
  currencyKind: string,
  expectedInCome: number,
  lenderAddress: string,
  lenderEarnRatio: number,
  minGain: number,
  newIncomeTime: string | number,
  newIncomeValue: number,
  nftUid: number,
  orderId: number,
  orderTime: number,
  propertyUrl: string,
  skuId: number,
  status: 'Cancel' | 'Doing' | 'BCancel' | 'LCancel',
  totalInComeValue: number,
  wrapNftAddress: string,
  gameName: string;
  imageUrl: string;
  whiteAddress: string;
  metadata: string;
}