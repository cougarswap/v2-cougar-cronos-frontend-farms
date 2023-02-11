import BigNumber from 'bignumber.js'
import erc20 from 'config/abi/erc20.json'
import masterchefABI from 'config/abi/masterchef.json'
import multicall from 'utils/multicall'
import { getMasterChefAddress } from 'utils/addressHelpers'
import farmsConfig from 'config/constants/farms'
import { BIG_ONE, BIG_TEN, BIG_ZERO } from 'utils/bigNumber'
import { QuoteToken } from '../../config/constants/types'

const CHAIN_ID = process.env.REACT_APP_CHAIN_ID

const fetchFarms = async () => {
  const activeFarms = farmsConfig.filter(_ => _.enabled);

  const data = await Promise.all(
    activeFarms.map(async (farmConfig) => {
      const lpAdress = farmConfig.lpAddresses[CHAIN_ID]
      const calls = [
        // Balance of token in the LP contract
        {
          address: farmConfig.tokenAddresses[CHAIN_ID],
          name: 'balanceOf',
          params: [lpAdress],
        },
        // Balance of quote token on LP contract
        {
          address: farmConfig.quoteTokenAdresses[CHAIN_ID],
          name: 'balanceOf',
          params: [lpAdress],
        },
        // Balance of LP tokens in the master chef contract
        {
          address: farmConfig.isTokenOnly ? farmConfig.tokenAddresses[CHAIN_ID] : lpAdress,
          name: 'balanceOf',
          params: [getMasterChefAddress()],
        },
        // Total supply of LP tokens
        {
          address: lpAdress,
          name: 'totalSupply',
        },
        // Token decimals
        {
          address: farmConfig.tokenAddresses[CHAIN_ID],
          name: 'decimals',
        },
        // Quote token decimals
        {
          address: farmConfig.quoteTokenAdresses[CHAIN_ID],
          name: 'decimals',
        },
      ]

      const  [
        tokenBalanceLP,
        quoteTokenBlanceLP,
        lpTokenBalanceMC,
        lpTotalSupply,
        tokenDecimals,
        quoteTokenDecimals
      ] = await multicall(erc20, calls)    
      

      let tokenAmount;
      let lpTotalInQuoteToken;
      let tokenPriceVsQuote;
      let lpTokenDecimals = 18;

      if (farmConfig.isTokenOnly){
        lpTokenDecimals = tokenDecimals[0];
        tokenAmount = new BigNumber(lpTokenBalanceMC).div(BIG_TEN.pow(tokenDecimals));

        if ((farmConfig.tokenSymbol === QuoteToken.USDC && farmConfig.quoteTokenSymbol === QuoteToken.USDC) ||
          (farmConfig.quoteTokenSymbol === QuoteToken.THREEPOOL)||
          (farmConfig.quoteTokenSymbol === QuoteToken.MULTICHAIN3POOL)||
          (farmConfig.quoteTokenSymbol === QuoteToken.UST3POOL)) {
          tokenPriceVsQuote = BIG_ONE;
        } else{          
          const lpAmountInToken = new BigNumber(tokenBalanceLP).div(BIG_TEN.pow(tokenDecimals));
          const lpAmountInQuoteToken = new BigNumber(quoteTokenBlanceLP).div(BIG_TEN.pow(quoteTokenDecimals));
          tokenPriceVsQuote = new BigNumber(lpAmountInQuoteToken)
            .div(new BigNumber(lpAmountInToken));
        }        

        lpTotalInQuoteToken = tokenAmount.times(tokenPriceVsQuote);
      } else {
        // Ratio in % a LP tokens that are in staking, vs the total number in circulation
        const lpTokenRatio = new BigNumber(lpTokenBalanceMC).div(new BigNumber(lpTotalSupply))

        // Raw amount of token in the LP, including those not staked
        const tokenAmountTotal = new BigNumber(tokenBalanceLP).div(BIG_TEN.pow(tokenDecimals))
        const quoteTokenAmountTotal = new BigNumber(quoteTokenBlanceLP).div(BIG_TEN.pow(quoteTokenDecimals))

        // Amount of token in the LP that are staked in the MC (i.e amount of token * lp ratio)
        const tokenAmountMc = tokenAmountTotal.times(lpTokenRatio)
        const quoteTokenAmountMc = quoteTokenAmountTotal.times(lpTokenRatio)
        
        // Total staked in LP, in quote token value
        lpTotalInQuoteToken = quoteTokenAmountMc.times(new BigNumber(2))

        tokenAmount = tokenAmountMc
        
        tokenPriceVsQuote = quoteTokenAmountTotal.div(tokenAmountTotal)
      }

      const [info, totalAllocPoint, cougarPerBlock] = await multicall(masterchefABI, [
        {
          address: getMasterChefAddress(),
          name: 'poolInfo',
          params: [farmConfig.pid],
        },
        {
          address: getMasterChefAddress(),
          name: 'totalAllocPoint',
        },
        {
          address: getMasterChefAddress(),
          name: 'cougarPerBlock',
        },
      ])

      const allocPoint = new BigNumber(info.allocPoint._hex)
      const poolWeight = totalAllocPoint ? allocPoint.div(new BigNumber(totalAllocPoint)) : BIG_ZERO  

      // const harvestInterval = new BigNumber(info.harvestInterval._hex)      

      return {
        ...farmConfig,
        tokenAmount: tokenAmount.toJSON(),
        // quoteTokenAmount: quoteTokenAmount,
        lpTokenBalanceMC: farmConfig.isTokenOnly ? tokenAmount.toJSON() : new BigNumber(lpTokenBalanceMC).div(new BigNumber(10).pow(18)).toJSON(),
        lpTotalInQuoteToken: lpTotalInQuoteToken.toJSON(),
        tokenPriceVsQuote: tokenPriceVsQuote.toJSON(),
        poolWeight: poolWeight.toNumber(),
        multiplier: `${allocPoint.div(100).toString()}X`,
        depositFeeBP: info.depositFeeBP,
        harvestInterval: 0,
        cougarPerBlock: new BigNumber(cougarPerBlock).toNumber(),
        lpTokenDecimals,
      }
    }),
  )
  
  return data
}

export default fetchFarms
