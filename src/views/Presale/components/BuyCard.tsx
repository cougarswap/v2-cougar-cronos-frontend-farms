import React, { useEffect, useCallback, useState, useMemo } from 'react'
import { useDispatch } from 'react-redux'
import { CardBody, CardFooter, Button, Text, AutoRenewIcon } from '@pancakeswap-libs/uikit'
import Card from 'components/layout/Card'
import styled from 'styled-components'
import BigNumber from 'bignumber.js'
import { BIG_ZERO } from 'utils/bigNumber'
import useI18n from 'hooks/useI18n'
import { useUsdcContract } from 'hooks/useContract'
import UnlockButton from 'components/UnlockButton'
import { getBalanceAmount, getBalanceNumber } from 'utils/formatBalance'
import { fetchUserPresaleAllowanceDataAsync } from 'state/actions';
import { PresaleOption, SerializedBigNumber } from 'state/types'
import useRefresh from 'hooks/useRefresh';
import Flex from 'components/layout/Flex'
import { useWeb3React } from '@web3-react/core'
import BuyAction from './BuyAction'
import ClaimAction from './ClaimAction'
import useApprovePresale from '../hooks/useApprovePresale'
import { usePresalePublicData } from '../hooks/usePresalePublicData'
import { usePresaleUserData, usePresaleUserTokenData } from '../hooks/usePresaleUserData'
import BuyOptionStats from './BuyOptionStats'

interface BuyCardProps {  
    option: PresaleOption
}

const BuyCardContainer =styled(Flex)`
    flex: 1 1 0%;
`
const PresaleBuyStyledCard = styled(Card)`
    width: 100%;
    max-width: 100%;
    border-radius: 8px;
    padding: 24px;
    margin: 0;    
    background: #ffffff;
`

const CustomButton = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  grid-gap: 5px;
  ${({ theme }) => theme.mediaQueries.nav} {
    grid-gap: 20px;
  }
`
const currentTimestampInMiliseconds = () => Math.round(new Date().getTime()/1000)

const BuyCard: React.FC<BuyCardProps> = ({option}) => {    
    const {
        userAllowance: userAllowanceAsString,
        cakeUnclaimed: tokensUnclaimedAsString,
        cakeLastClaimed: cakeLastClaimedAsString
    } = usePresaleUserData(option);
        
    const presalePublicData = usePresalePublicData(option);

    const {
        usdcBalance: usdcBalanceAsString,
        cakeBalance: tokenBalanceAsString,
    } = usePresaleUserTokenData()

    const t = useI18n()
    const { fastRefresh } = useRefresh()
    const { account } = useWeb3React()
    const dispatch = useDispatch()
    const [requestedApproval, setRequestedApproval] = useState(false)
    const [currentTimeStamp, setCurrentTimeStamp] = useState(0)

    useEffect(() => {
        setCurrentTimeStamp(currentTimestampInMiliseconds());
    }, [dispatch, fastRefresh])

    const userAllowance = new BigNumber(userAllowanceAsString)    
    const usdcBalance = new BigNumber(usdcBalanceAsString)
    const tokenBalance = new BigNumber(tokenBalanceAsString)    
    const allowanceBigNumber = getBalanceAmount(userAllowance)

    const cakeLastClaimed = Number(cakeLastClaimedAsString) 
    const isApproved = account && userAllowanceAsString && allowanceBigNumber.isGreaterThan(0)

    const usdcContract = useUsdcContract()
    const { onApprove } = useApprovePresale(usdcContract, option)

    const handleApprove = useCallback(async () => {
        try {
            setRequestedApproval(true)
            await onApprove()
            dispatch(fetchUserPresaleAllowanceDataAsync(account, option))
            setRequestedApproval(false)
        } catch (e) {
            console.error(e)
            setRequestedApproval(false)
        }
    }, [onApprove, dispatch, account, option])

    const tokensUnclaimed = useMemo(() => {
        return tokensUnclaimedAsString ? new BigNumber(tokensUnclaimedAsString) : BIG_ZERO; 
    }, [tokensUnclaimedAsString])
    
    const tokensLeft = getBalanceAmount(new BigNumber(presalePublicData.totalCakeLeft), 6) // presale uses 6 decimals
    const claimTimestamp = Number(presalePublicData.firstHarvestTimestamp);
    const startingTimestamp = Number(presalePublicData.startingTimeStamp);
    const timePerPercent = presalePublicData.timePerPercent;    

    const isSaleActive = presalePublicData.isSaleActive 
        && currentTimeStamp > 0
        && startingTimestamp > 0
        && currentTimeStamp > startingTimestamp;
    const isClaimActive = presalePublicData.isClaimActive && tokensUnclaimed.gt(0);            

    const renderApprovalOrBuyButton = () => {
        return isApproved ? (
            <BuyAction                 
                usdcBalance={usdcBalance} 
                tokenBalance={tokenBalance} 
                tokensUnclaimed={tokensUnclaimed} 
                usdcPerCake={presalePublicData.usdcPerCake}
                purchaseLimit={presalePublicData.purchaseLimit}
                tokensLeft={tokensLeft}
                option={option}
                isSaleActive={isSaleActive} />
        ) : (
            <Button mt="8px" fullWidth 
                isLoading={requestedApproval}
                endIcon={requestedApproval ? <AutoRenewIcon spin color="currentColor" /> : null}    
                disabled={requestedApproval}
                onClick={handleApprove}>
                { requestedApproval ? t(999, 'Approving') : t(999, 'Approve To Buy')}
            </Button>
        )
    }

    const renderClaimButton = () => {
        return <ClaimAction 
            isClaimActive={isClaimActive} 
            option={option}
            percentToClaim={percentToClaim}
            />
    }    

    const tokenName = "CGS"
    const [percentToClaim, setPercentToClaim] = useState(0)
    const [tokensToClaim, setTokenToClaim] =useState(0)       

    useEffect(() => {
        let actualLastClaimed;

        if (cakeLastClaimed !== 0) {
            actualLastClaimed = cakeLastClaimed;
        }
        else if (claimTimestamp !== 0) {
            actualLastClaimed = claimTimestamp;
        }
        else {
            actualLastClaimed = null;
        }
        
        setPercentToClaim(actualLastClaimed ? 
            Math.min(Math.floor((Math.round(Date.now() / 1000) - actualLastClaimed) / timePerPercent), 100) : 0)
    }, [cakeLastClaimed, claimTimestamp, timePerPercent])
    
    useEffect(() => {
        setTokenToClaim(percentToClaim * getBalanceNumber(tokensUnclaimed, 6) / 100) // presale uses 6 decimals
    }, [percentToClaim, tokensUnclaimed])

    const maxTokenCanBuy = useMemo(() => {
        const tokenHasBought = getBalanceNumber(tokensUnclaimed, 6)
        const maxCanBuy = presalePublicData.purchaseLimit - tokenHasBought
        const totalTokenLeft = tokensLeft.toNumber()
        return totalTokenLeft < maxCanBuy ? totalTokenLeft : maxCanBuy
    },[presalePublicData.purchaseLimit, tokensUnclaimed, tokensLeft])

    return (
        <BuyCardContainer>
            <PresaleBuyStyledCard>
                <CardBody style={{padding: "10px 24px 24px"}}>
                    <Text color="#22398c">BUY CGS</Text>
                </CardBody>
                <CardFooter style={{borderTop: "1px solid #d18181"}} padding={['12px', '12px', '12px', null, '24px']}>                                    
                    <BuyOptionStats 
                        maxTokenCanBuy={maxTokenCanBuy}                        
                        tokensUnclaimed={getBalanceNumber(tokensUnclaimed, 6)} 
                        percentToClaim={percentToClaim}/>
                    <CustomButton>
                        {!account ? <UnlockButton mt="8px" fullWidth /> : renderApprovalOrBuyButton()}
                        {!account ? <UnlockButton mt="8px" fullWidth /> : renderClaimButton()}
                    </CustomButton>
                </CardFooter>
            </PresaleBuyStyledCard>
        </BuyCardContainer>
    )
}

export default BuyCard
// disabled={requestedApproval} 