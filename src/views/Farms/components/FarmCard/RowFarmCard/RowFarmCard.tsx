import React, { useState } from 'react'
import BigNumber from 'bignumber.js'
import styled, { keyframes } from 'styled-components'
import { Flex, Text, Skeleton, LinkExternal, Link, CardRibbon, HelpIcon, Button, MetaMaskIcon } from '@pancakeswap-libs/uikit'
import { useFarmUser, useTransferTaxRate } from 'state/hooks'
import { Farm } from 'state/types'
import useI18n from 'hooks/useI18n'
import getLiquidityUrlPathParts, { getLiquidityLink } from 'utils/getLiquidityUrlPathParts'
import lpTokens from 'config/constants/lp-tokens'
import { NoFeeTag } from 'components/Tags'
import { getLiquidityUrl } from 'utils'
import { registerToken } from 'utils/wallet'
import useDelayedUnmount from 'hooks/useDelayedUnmount'
import ApyButton from '../ApyButton'
import RowCardHeading from './RowCardHeading'
import RowHarvestAction from './RowHarvestAction'
import RowStakeAction from './RowStakeAction'

export interface FarmWithStakedValue extends Farm {
  apy?: BigNumber
  cakeRewardPerDay?: BigNumber
  liquidity?: BigNumber

}

const RainbowLight = keyframes`
  0% {
    background-position: 0% 50%;
  }
  50% {
    background-position: 100% 50%;
  }
  100% {
    background-position: 0% 50%;
  }
`

const Tada = keyframes`
  0% {
    transform: scale(1)
  }
  10%, 20% {
    transform: scale(.9) rotate(-8deg);
  }
  30%, 50%, 70% {
    transform: scale(1.3) rotate(8deg);
  } 
  40%, 60% {
    transform: scale(1.3) rotate(-8deg);
  }
  100% {
    transform: scale(1) rotate(0)
  }
`

const StyledCardAccent = styled.div`
  background: linear-gradient(45deg,
  rgba(255, 0, 0, 1) 0%,
  rgba(255, 154, 0, 1) 10%,
  rgba(208, 222, 33, 1) 20%,
  rgba(79, 220, 74, 1) 30%,
  rgba(63, 218, 216, 1) 40%,
  rgba(47, 201, 226, 1) 50%,
  rgba(28, 127, 238, 1) 60%,
  rgba(95, 21, 242, 1) 70%,
  rgba(186, 12, 248, 1) 80%,
  rgba(251, 7, 217, 1) 90%,
  rgba(255, 0, 0, 1) 100%);
  background-size: 300% 300%;
  animation: ${RainbowLight} 2s linear infinite;
  border-radius: 15px;
  filter: blur(6px);
  position: absolute;
  top: -2px;
  right: -2px;
  bottom: -2px;
  left: -2px;
  z-index: -1;
`

const FCard = styled.div`
  position: relative;
  align-self: baseline;    
  overflow: visible;
  background-color: rgb(16 12 12 / 82%);  
  background-blend-mode: luminosity;  
  box-shadow: 0px 2px 12px -8px rgba(25, 19, 38, 0.1), 0px 1px 1px rgba(25, 19, 38, 0.05);
  display: flex;
  flex-direction: column;
  justify-content: space-around;
  padding: 24px;
  position: relative;
  font-size: 0.8em;  
  margin: 0;  

  &:first-child {
    border-top-left-radius: 16px;
    border-top-right-radius: 16px;
  }
  &:last-child {
    border-bottom-left-radius: 16px;
    border-bottom-right-radius: 16px;
  }
  &:not(:last-child) {
    border-bottom: 1px solid #473e6c;  
  }
`

const NewImage = styled.img`
  position: absolute;  
  left: 10px;
  top: 33px;
  width: 40px;
  animation: ${Tada} 1.5s linear infinite;
`

const Divider = styled.div`
  background-color: ${({ theme }) => theme.colors.borderColor};
  height: 1px;
  margin: 28px auto;
  width: 100%;
`

const FarmCardInfoWrapper = styled.div`
    background-color: ${({ theme }) => theme.colors.invertedContrast}80;    
    border-radius: 20px;
    padding: 10px;
    display: block;
    margin-top: 10px;
    ${({ theme }) => theme.mediaQueries.nav} {
      display: none;
    }
`

const TokenCardInfoWrapper = styled.div`
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    /* background-color: ${({ theme }) => theme.colors.invertedContrast}80;     */
    border-radius: 20px;    
    padding: 10px;
`

const ExpandingWrapper = styled.div`
  display: block;

  ${({ theme }) => theme.mediaQueries.nav} {
    display: flex;
    justify-content: space-between;
  }
`

const ExpandedRow = styled.tr<{ expanded: boolean }>`
  &>td {
    padding: 10px;
  }

  border-bottom: 1px solid #473e6c;  
  display: ${(props) => (props.expanded) ? 'table-row' : 'none'};
`

const StyledLinkExternal = styled(LinkExternal)`
  text-decoration: none;
  font-weight: normal;
  color: ${({ theme }) => theme.colors.textTitleFarm};
  display: flex;
  align-items: center;

  svg {
    padding-left: 4px;
    height: 18px;
    width: auto;
    fill: ${({ theme }) => theme.colors.textTitleFarm};
  }
`

const RowCardActions = styled.div`
  align-items: center;

  ${({ theme }) => theme.mediaQueries.sm} {
    display: flex;
    justify-content: space-between;
  }

  ${({ theme }) => theme.mediaQueries.sm} {
    flex-basis: 75%;
  }
`


const TextTitle = styled(Text)`
  color: ${({theme}) => theme.colors.primary};
  font-size: 14px;
`

const ExpandedSectionWrapper = styled(ExpandingWrapper)`  
  overflow: visible;
`
const AddToMetaMaskButton = styled.button`
  background-color: transparent;
  border: none;
  display: inline-flex;
  align-items: center;
  cursor: pointer;
  padding-left: 0;
  color: ${({theme}) => theme.colors.text};
  & > * {
    color: ${({theme}) => theme.colors.textTitleFarm};
  }
`

interface FarmCardProps {
  farm: FarmWithStakedValue
  removed: boolean
  cakePrice?: BigNumber
  bnbPrice?: BigNumber
  account?: string
}

const RowFarmCard: React.FC<FarmCardProps> = ({ farm, removed, cakePrice, bnbPrice, account }) => {
  const TranslateString = useI18n()

  const [showExpandableSection, setShowExpandableSection] = useState(false)
  const shouldRenderChild = useDelayedUnmount(showExpandableSection, 300)
  const { stakedBalance, earnings } = useFarmUser(farm.pid)
  
  // const isCommunityFarm = communityFarms.includes(farm.tokenSymbol)
  // We assume the token name is coin pair + lp e.g. CAKE-BNB LP, LINK-BNB LP,
  // NAR-CAKE LP. The images should be cake-bnb.svg, link-bnb.svg, nar-cake.svg
  // const farmImage = farm.lpSymbol.split(' ')[0].toLocaleLowerCase()  
  const farmImage = farm.isTokenOnly ? farm.tokenSymbol.toLowerCase() : `${farm.tokenSymbol.toLowerCase()}_${farm.quoteTokenSymbol.toLowerCase()}`

  const transferTaxFee = useTransferTaxRate();

  let poolTransferTaxFee = 0;

  if (farm.pid === lpTokens.single.cgs.pid){
    poolTransferTaxFee = transferTaxFee;
  }

  const poolFee = (farm.depositFeeBP / 100) + poolTransferTaxFee;
 
  const totalValueFormated = farm.liquidity
    ? `$${Number(farm.liquidity).toLocaleString(undefined, { maximumFractionDigits: 2 })}`
    : '-'
    
  const lpLabel = farm.lpSymbol
  const earnLabel = 'CGS' 
  
  const farmAPY = farm.apy && farm.apy.toNumber().toLocaleString('en-US', { maximumFractionDigits: 2 })
  const rewardPerDay = farm.cakeRewardPerDay && farm.cakeRewardPerDay.toNumber().toLocaleString('en-US', { maximumFractionDigits: 2 })
  const rewardPerDayBusd = farm.cakeRewardPerDay && farm.cakeRewardPerDay.times(cakePrice).toNumber().toLocaleString('en-US', { maximumFractionDigits: 2 })
    
  const { quoteTokenAdresses, quoteTokenSymbol, tokenAddresses, risk, dex } = farm
  
  // const liquidityUrlPathParts = getLiquidityUrlPathParts({ quoteTokenAdresses, quoteTokenSymbol, tokenAddresses, dex })
  // const tokenPath = farm.isTokenOnly? tokenAddresses[process.env.REACT_APP_CHAIN_ID] : liquidityUrlPathParts
  // const liquidityUrl = getLiquidityUrl(farm.dex, tokenPath, farm.isTokenOnly)

  const liquidityLink = farm.getLiquidityExternalLink || getLiquidityLink(
    farm.dex,
    !!farm.isTokenOnly,
    farm.tokenAddresses[process.env.REACT_APP_CHAIN_ID],
    farm.tokenSymbol,
    farm.quoteTokenAdresses[process.env.REACT_APP_CHAIN_ID],
    farm.quoteTokenSymbol
  )

  const bscScanAddress=
    farm.isTokenOnly ?
      `https://polygonscan.com/address/${farm.tokenAddresses[process.env.REACT_APP_CHAIN_ID]}`
      :
      `https://polygonscan.com/address/${farm.lpAddresses[process.env.REACT_APP_CHAIN_ID]}`     

  const isMetaMaskInScope = !!window.ethereum?.isMetaMask

  return (
    <>
      {/* {(farm.tokenSymbol === 'CGS' ||  farm.quoteTokenSymbol === 'CGS')
        && <StyledCardAccent />}  
      {farm.isNewPool && 
        <CardRibbon variantColor="success" text="NEW" />
      } */}
      <RowCardHeading
          lpLabel={lpLabel}
          multiplier={farm.multiplier}
          risk={risk}
          depositFee={farm.depositFeeBP}
          poolTransferTaxFee={poolTransferTaxFee}
          apy={farm.apy}
          cakeRewardPerDay={farm.cakeRewardPerDay}
          stakedBalance={stakedBalance}
          earnings={earnings}
          lpTokenDecimals={farm.lpTokenDecimals}
          tvl={totalValueFormated}
          farmImage={farmImage}
          harvestInterval={farm.harvestInterval}
          isTokenOnly={farm.isTokenOnly}
          isPartner={farm.isPartner}
          dex={farm.dex}
          isNewPool={farm.isNewPool}
          tokenSymbol={farm.tokenSymbol}
          quoteTokenSymbol={farm.quoteTokenSymbol}
          quoteTokenAdresses={farm.quoteTokenAdresses}
          tokenAddresses={farm.tokenAddresses}
          cakePrice={cakePrice}  
          getLiquidityExternalLink={farm.getLiquidityExternalLink}        
          showExpandableSection={showExpandableSection}
          setShowExpandableSection={() => setShowExpandableSection(!showExpandableSection)}
        />  
        {shouldRenderChild && (
          <ExpandedRow expanded={showExpandableSection}>
           <td colSpan={8}>
             <ExpandedSectionWrapper>
               <RowCardActions>
                 <RowHarvestAction earnings={earnings} 
                   pid={farm.pid}
                 />
                 <RowStakeAction farm={farm} account={account} />
               </RowCardActions>        
               <FarmCardInfoWrapper>
                 {!removed && (
                   <Flex justifyContent='space-between' alignItems='center'>              
                     <TextTitle>{TranslateString(352, 'APR')}:</TextTitle>
                     <Text color="secondary" style={{ display: 'flex', alignItems: 'center' }}>
                       {farm.apy ?
                           <>
                             {farm.apy.gt(0) ? (
                               <>
                                 <ApyButton
                                   lpLabel={lpLabel}
                                   quoteTokenAdresses={quoteTokenAdresses}
                                   quoteTokenSymbol={quoteTokenSymbol}
                                   tokenAddresses={tokenAddresses}
                                   cakePrice={cakePrice}
                                   apy={farm.apy}
                                   dex={farm.dex}
                                   getLiquidityExternalLink={farm.getLiquidityExternalLink}
                                 />                
                                 {farmAPY}%
                               </>
                             ) : <>-</>
                             }                         
                           </>                      
                       : (
                         <Skeleton height={24} width={80} />
                       )}
                     </Text>
                   </Flex>
                 )}
                 <Flex justifyContent='space-between'>            
                   <TextTitle>{TranslateString(999, 'Multiplier')}:</TextTitle>
                   <Text color="secondary">{farm.multiplier}</Text>
                 </Flex>
                 {!removed && (
                 <Flex justifyContent='space-between'>            
                   <TextTitle>{TranslateString(999, 'Liquidity')}:</TextTitle>
                   <Text color="secondary">{totalValueFormated}</Text>
                 </Flex>)}
                 <Flex justifyContent='space-between'>            
                   <TextTitle>Deposit Fee</TextTitle>
                   <Text color="secondary" >{farm.depositFeeBP / 100}%</Text>
                 </Flex>                       
                 <Flex justifyContent='space-between'>            
                   <TextTitle>Daily Output</TextTitle>     
                   <Text color="secondary" >{rewardPerDay}{' CGS'}</Text>                  
                 </Flex>
               </FarmCardInfoWrapper> 
               <TokenCardInfoWrapper>
                 <Flex justifyContent='space-between'>
                   <Text color="textTitleFarm">{TranslateString(999, 'GET')}:&nbsp;</Text>
                   <StyledLinkExternal href={liquidityLink}>
                     {lpLabel}
                   </StyledLinkExternal>
                 </Flex>
                 <Flex justifyContent="flex-start">
                   <Link color="textTitleFarm" external href={bscScanAddress} bold={false}>
                     {TranslateString(356, 'View on Polygonscan')}
                   </Link>
                 </Flex>
                 {account && isMetaMaskInScope && farm.isTokenOnly && (
                   <Flex justifyContent="flex-start">
                     <AddToMetaMaskButton
                       onClick={() => registerToken(farm.tokenAddresses[process.env.REACT_APP_CHAIN_ID], farm.tokenSymbol, farm.lpTokenDecimals)}
                     >
                       <Text color="textTitleFarm">{TranslateString(999, 'Add to Metamask')}</Text>
                       <MetaMaskIcon ml="4px" />
                     </AddToMetaMaskButton>
                   </Flex>
                 )}
                 <Flex justifyContent="flex-start" mt="8px">
                   {farm.depositFeeBP === 0 ? <NoFeeTag /> : null}
                   {/* {isCommunityFarm ? <CommunityTag /> : <CoreTag />} */}
                   {/* <RiskTag risk={risk} /> */}            
                 </Flex>              
               </TokenCardInfoWrapper>                    
             </ExpandedSectionWrapper>        
           </td>
         </ExpandedRow>    
        )}                          
      </>
  )
}

export default RowFarmCard
