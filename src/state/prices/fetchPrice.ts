import multicall from "utils/multicall";
import erc20 from 'config/abi/erc20.json'
import uniswapTokenAbi from 'config/abi/uni_v2_lp.json'
import BigNumber from "bignumber.js";
import { BIG_TEN, BIG_ZERO } from "utils/bigNumber";
import { stableCoins } from "config";
import farmTokens from 'config/constants/farm-tokens'
import { TokenPrice } from "state/types";

export const fetchLPQuote = async (lpAddress: string, quotePrice: number, quoteSymbol?: string) => {
    const lpCalls = [
        {
          address: lpAddress,
          name: 'token0',
        },
        {
          address: lpAddress,
          name: 'token1',
        },
        {
            address: lpAddress,
            name: 'totalSupply',
        },
        {
            address: lpAddress,
            name: 'decimals',
        },
    ];

    const [token0Addr, token1Addr, lpTotalSupply, lpDecimals] = await multicall(uniswapTokenAbi, lpCalls);
    
    const balanceCalls = [
        // Balance & Decimals of token in the LP contract
        {
            address: token0Addr[0],
            name: 'balanceOf',
            params: [lpAddress],
        },
        {
            address: token0Addr[0],
            name: 'decimals',
        },
        {
            address: token0Addr[0],
            name: 'symbol',
        },
        // Balance of quote token on LP contract
        {
            address: token1Addr[0],
            name: 'balanceOf',
            params: [lpAddress],
        },
        {
            address: token1Addr[0],
            name: 'decimals',
        },
        {
            address: token1Addr[0],
            name: 'symbol',
        },        
    ];

    const [token0Bal, token0Dec, token0Sym, token1Bal, token1Dec, token1Sym] = await multicall(erc20, balanceCalls)            

    const _token0Bal = new BigNumber(token0Bal).div(BIG_TEN.pow(token0Dec));
    const _token1Bal = new BigNumber(token1Bal).div(BIG_TEN.pow(token1Dec));
    const _lpBal = new BigNumber(lpTotalSupply).div(BIG_TEN.pow(lpDecimals));

    const token1InToken0 = _token1Bal.gt(0) && _token0Bal.gt(0) ? new BigNumber(_token1Bal).div(_token0Bal) : BIG_ZERO;  
    const token0InToken1 = _token0Bal.gt(0) && _token1Bal.gt(0) ? new BigNumber(_token0Bal).div(_token1Bal) : BIG_ZERO;
    const lpInToken0 = _token0Bal.gt(0) && _lpBal.gt(0) ? new BigNumber(_token0Bal).times(2).div(_lpBal) : BIG_ZERO;
    const lpInToken1 = _token1Bal.gt(0) && _lpBal.gt(0) ? new BigNumber(_token1Bal).times(2).div(_lpBal) : BIG_ZERO;

    const lpSymbol = `${token0Sym}-${token1Sym}`;

    const isQuoteTokenAndToken0Same = quoteSymbol ? quoteSymbol === token0Sym[0] : stableCoins.findIndex((c) => c === token0Sym[0]) > -1

    const tokenPriceData : TokenPrice = {
        symbol: isQuoteTokenAndToken0Same ? token1Sym[0] : token0Sym[0],
        address: isQuoteTokenAndToken0Same ? token1Addr[0] : token0Addr[0],
        price: isQuoteTokenAndToken0Same ? token0InToken1.times(quotePrice).toNumber() : token1InToken0.times(quotePrice).toNumber()
    }

    const lpPriceData : TokenPrice = {
        symbol: lpSymbol,
        address: lpAddress,
        price: isQuoteTokenAndToken0Same ? lpInToken0.times(quotePrice).toNumber() : lpInToken1.times(quotePrice).toNumber()
    }

    return [tokenPriceData, lpPriceData];
}

export const fetchPlatformUsdPrice = async() => fetchLPQuote(farmTokens.wMaticUsdc, 1);
export const fetchTokenUsdPrice = async() => fetchLPQuote(farmTokens.cgsUsdc, 1);
export const fetchCgsMaticPrice = async(quotePrice: number) => fetchLPQuote(farmTokens.cgsMatic, quotePrice, 'WMATIC'); 