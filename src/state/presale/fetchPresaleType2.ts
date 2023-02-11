import BigNumber from 'bignumber.js'
import { SerializedBigNumber } from 'state/types'
import presaleAPI from 'config/abi/presaleType2.json'
import multicall from 'utils/multicall'

type PublicPresaleData = {
    totalOnSale?: SerializedBigNumber
    startingTimeStamp?: string
    closingTimeStamp?: string
    claimTimeStamp?: string
    firstHarvestTimestamp?: string    
    totalCakeSold?: SerializedBigNumber
    totalCakeLeft?: SerializedBigNumber
    usdcPerCake?: number
    isSaleActive?: boolean
    isClaimActive?: boolean
    timePerPercent?: number
    purchaseLimit?: number
    isWhiteListActive?: boolean
    BuyTokenPerCGS?: number
}

const fetchPublicPresaleData = async(presaleType2Address: string): Promise<PublicPresaleData> => {
    const presaleAddress = presaleType2Address
    const calls = [
        {
            address: presaleAddress,
            name: 'COUGAR_HARDCAP',
        },
        {
            address: presaleAddress,
            name: 'startingTimeStamp'            
        },
        {
            address: presaleAddress,
            name: 'firstHarvestTimestamp'            
        },
        {
            address: presaleAddress,
            name: 'totalCougarSold'            
        },        
        {
            address: presaleAddress,
            name: 'isSaleActive'            
        },
        {
            address: presaleAddress,
            name: 'isClaimActive'            
        },
        {
            address: presaleAddress,
            name: 'maxBuyPerUser'   
        },  
        {
            address: presaleAddress,
            name: 'BuyTokenPerCGS'   
        },    
    ]        

    const [totalCakeOnSale, 
        startingTimeStamp, 
        firstHarvestTimestamp, 
        totalCakeSold,         
        isSaleActive, 
        isClaimActive,
        maxBuyPerUser,
        BuyTokenPerCGS] =
        await multicall(presaleAPI, calls);

    const totalOnSale = new BigNumber(totalCakeOnSale)
        .dividedBy(new BigNumber(10).pow(6))

    const totalCakeLeft = new BigNumber(totalOnSale)
        .multipliedBy(new BigNumber(10).pow(6)) // presale amount uses 6 decimals
        .minus(new BigNumber(totalCakeSold.toString()));
    
    const purchaseLimit = new BigNumber(maxBuyPerUser.toString())
        .dividedBy(new BigNumber(10).pow(6))
    return {
        totalOnSale: totalOnSale.toJSON(),
        startingTimeStamp: startingTimeStamp.toString(), 
        firstHarvestTimestamp: firstHarvestTimestamp.toString(),
        totalCakeSold: totalCakeSold.toString(),
        totalCakeLeft: totalCakeLeft.toJSON(),              
        isSaleActive: isSaleActive.toString() === 'true',
        isClaimActive: isClaimActive.toString() === 'true',  
        purchaseLimit: purchaseLimit.toNumber(),
        isWhiteListActive: false,
        BuyTokenPerCGS: BuyTokenPerCGS.toString()
    }
}

export default fetchPublicPresaleData