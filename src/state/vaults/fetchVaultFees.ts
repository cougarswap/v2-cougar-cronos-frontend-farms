import { getTimelockControllerRewardsDistributorAddress } from "utils/addressHelpers"
import timelockControllerRewardDistributorAbi from 'config/abi/timelockControllerRewardDistributor.json'
import multicall from "utils/multicall"
import BigNumber from "bignumber.js"
import { BIG_TEN_THOUSAND } from "utils/bigNumber"

const fetchVaultFeesData = async () => {
    const calls = [        
        {
            address: getTimelockControllerRewardsDistributorAddress(),
            name: 'beneficiaryAddresses',            
            params: [0]
        },
        {
            address: getTimelockControllerRewardsDistributorAddress(),
            name: 'beneficiaryRewardFactors',    
            params: [0]        
        },
        {
            address: getTimelockControllerRewardsDistributorAddress(),
            name: 'beneficiaryAddresses',            
            params: [1]
        },
        {
            address: getTimelockControllerRewardsDistributorAddress(),
            name: 'beneficiaryRewardFactors',    
            params: [1]        
        },
        {
            address: getTimelockControllerRewardsDistributorAddress(),
            name: 'beneficiaryAddresses',            
            params: [2]
        },
        {
            address: getTimelockControllerRewardsDistributorAddress(),
            name: 'beneficiaryRewardFactors',    
            params: [2]        
        },
    ]

    const [devAddress, devPercent, feeAddress, feePercent, buybackAddress, buybackPercent] = 
        await multicall(timelockControllerRewardDistributorAbi, calls)    
   
    // const totalPercent = new BigNumber(devPercent).plus(new BigNumber(feePercent)).plus(new BigNumber(buybackPercent))

    return {
        devFee: new BigNumber(devPercent).dividedBy(BIG_TEN_THOUSAND).toNumber(),
        platformFee: new BigNumber(feePercent).dividedBy(BIG_TEN_THOUSAND).toNumber(),
        buybackFee: new BigNumber(buybackPercent).dividedBy(BIG_TEN_THOUSAND).toNumber(),
    }
}

export default fetchVaultFeesData