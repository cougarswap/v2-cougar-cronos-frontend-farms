import BigNumber from 'bignumber.js/bignumber'
import { BIG_FIVE_HUNDRED, BIG_NINE, BIG_TEN } from 'utils/bigNumber'

BigNumber.config({
  EXPONENTIAL_AT: 1000,
  DECIMAL_PLACES: 80,
})

export const BSC_BLOCK_TIME = 2.1 // poly AVERAGE_BLOCK_TIME_IN_SECSS

export const BASE_BSC_SCAN_URLS = 'https://polygonscan.com/'
export const BASE_STELLA_SWAP_URL = 'https://polygondex.cougarswap.io/#/'
export const BASE_SOLARFLARE_SWAP_URL = 'https://solarflare.io/'
export const BASE_BEAM_SWAP_URL = 'https://polygondex.cougarswap.io/#/'
export const BASE_CONVERGENCE_SWAP_URL = 'https://convx.conv.finance/'
export const BASE_MMF_URL = 'https://mm.finance/'
export const BASE_BLOCK_COUNTDOWN = 'https://polygonscan.com/'


export const BASE_COUGAR_SWAP_URL = 'https://polygondex.cougarswap.io/#/'

export const CAKE_PER_BLOCK = new BigNumber(50)
export const BLOCKS_PER_DAY = new BigNumber((60 / BSC_BLOCK_TIME) * 60 * 24)
export const BLOCKS_PER_YEAR = new BigNumber((60 / BSC_BLOCK_TIME) * 60 * 24 * 365)
export const CAKE_POOL_PID = 1
export const START_FARMING_BLOCK = 0
export const gasPrice = BIG_FIVE_HUNDRED.times(BIG_TEN.pow(BIG_NINE)).toString()

export const DEAD_ADDRESS = '0x000000000000000000000000000000000000dEaD'
export const DEFAULT_TOKEN_DECIMAL = BIG_TEN.pow(18)

export const stableCoins = [
  'USDT.e',
  'gfUSDT',
  'fUSDT',
  'USDT',
  'DAI.e',
  'gDAI',
  'DAI',
  'USDC.e',
  'gUSDC',
  'USDC',
  'MIM',
];
