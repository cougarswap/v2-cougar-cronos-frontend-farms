import BigNumber from 'bignumber.js'
import tokenABI from 'config/abi/token.json'
import masterChefABI from 'config/abi/masterchef.json'
import { getTokenAddress, getMasterChefAddress } from 'utils/addressHelpers'
import multicall from 'utils/multicall'
import { BIG_ONE_HUNDRED } from 'utils/bigNumber'
import { getMasterchefContract } from 'utils/contractHelpers'


const fetchTokenPublicData = async () => {
    const calls = [
        {
            address: getTokenAddress(),
            name: 'transferTaxRate',            
        },    
        {
            address: getTokenAddress(),
            name: 'maxTransferAmountRate',            
        },
        {
            address: getTokenAddress(),
            name: 'totalSupply',            
        }
    ]

    const [transferTaxRate, maxTransferAmountRate, totalSupply] = 
        await multicall(tokenABI, calls)    

    const formatedTransferTaxRate = transferTaxRate ?
        new BigNumber(transferTaxRate).div(new BigNumber(10).pow(4)).multipliedBy(new BigNumber(100)) : new BigNumber(0)

    const formatedMaxTransferAmountRate = maxTransferAmountRate ?
        new BigNumber(maxTransferAmountRate).div(new BigNumber(10).pow(4)).multipliedBy(new BigNumber(100)) : new BigNumber(0)

    return {
        transferTaxRate : formatedTransferTaxRate.toNumber(),
        maxTransferAmountRate : formatedMaxTransferAmountRate.toNumber(),
        totalSupply: new BigNumber(totalSupply).toJSON()
    }
}


export const fetchMasterChefPublicData = async () => {
    const calls = [
        {
            address: getMasterChefAddress(),
            name: 'cougarPerBlock',            
        },    
        {
            address: getMasterChefAddress(),
            name: 'startBlock',            
        },                    
    ]

    const [tokenPerBlock, startBlock, lockupBlocks, unlockBlocks, harvestFee] = 
        await multicall(masterChefABI, calls)    

    const formatedTokenPerBlock = new BigNumber(tokenPerBlock).div(new BigNumber(10).pow(18)).toNumber()
    const formatedStartBlock = new BigNumber(startBlock).toNumber()

    return {
        tokenPerBlock: formatedTokenPerBlock,
        startBlock: formatedStartBlock,
    }
}

export default fetchTokenPublicData