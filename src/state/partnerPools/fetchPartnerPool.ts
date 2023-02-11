import BigNumber from 'bignumber.js';
import partnerPoolsConfig from 'config/constants/partnerPools'
import { BIG_ZERO } from 'utils/bigNumber';
import multicall from 'utils/multicall';
import erc20 from 'config/abi/erc20.json';
import { getBalanceNumber } from 'utils/formatBalance';
import { getPartnerMasterchefAbi } from 'utils/abiHelper';

const fetchPartnerPools = async () => {
    const activePartnerPools = partnerPoolsConfig.filter(_ => !_.isFinished);

    const data = await Promise.all(
        activePartnerPools.map(async (poolConfig) => {
            const lpAddress = poolConfig.stakingToken.token.address
            const calls = [
                {
                    address: lpAddress,
                    name: 'balanceOf',
                    params: [poolConfig.masterchefAddress]
                },
                {
                    address: lpAddress,
                    name: 'totalSupply'
                }
            ]

            const [
                lpTokenBalanMC, 
                lpTotalSupply
            ] = await multicall(erc20, calls)

            let lpInToken0 = ''
            let lpInToken1 = ''
            if (!poolConfig.stakingToken.isTokenOnly) {
                const lpCalls = [
                    {
                        address: poolConfig.stakingToken.token0.address,
                        name: 'balanceOf',
                        params: [lpAddress]
                    },
                    {
                        address: poolConfig.stakingToken.token1.address,
                        name: 'balanceOf',
                        params: [lpAddress]
                    }
                ]

                const [
                    lpInToken0Call, 
                    lpInToken1Call
                ] = await multicall(erc20, lpCalls)

                lpInToken0 = new BigNumber(lpInToken0Call).toJSON()
                lpInToken1 =  new BigNumber(lpInToken1Call).toJSON()
            }


            const partnerMasterchef = getPartnerMasterchefAbi(poolConfig.earningToken.symbol)

            const [info, totalAllocPoint, tokenPerBlock, startAt] = await multicall(partnerMasterchef, [    
                {
                    address: poolConfig.masterchefAddress,
                    name: 'poolInfo',
                    params: [poolConfig.poolId],
                },          
                {
                    address: poolConfig.masterchefAddress,
                    name: 'totalAllocPoint',                    
                },
                {
                    address: poolConfig.masterchefAddress,
                    name: poolConfig.tokenPerBlockFunction,
                },
                {
                    address: poolConfig.masterchefAddress,
                    name: poolConfig.startFunction,
                },
            ])

            const allocPoint = new BigNumber(info.allocPoint._hex)
            const poolWeight = totalAllocPoint ? allocPoint.div(new BigNumber(totalAllocPoint)) : BIG_ZERO  
            
            return {
                ...poolConfig, 
                totalStaked: new BigNumber(lpTokenBalanMC).toJSON(),
                totalSupply: new BigNumber(lpTotalSupply).toJSON(),
                allocPoint: allocPoint.toNumber(),
                totalAllocPoint: new BigNumber(totalAllocPoint).toNumber(),
                poolWeight: poolWeight.toNumber(),
                startAt: parseInt(startAt),
                tokenPerBlock: getBalanceNumber(new BigNumber(tokenPerBlock), 
                poolConfig.earningToken.decimals),
                lpInToken0,
                lpInToken1
            }
        })
    )

    return data
}

export default fetchPartnerPools