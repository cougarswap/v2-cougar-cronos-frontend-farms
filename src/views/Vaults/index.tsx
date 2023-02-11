import React, { useCallback, useEffect, useMemo } from 'react'
import useI18n from 'hooks/useI18n'
import BigNumber from 'bignumber.js'
import styled from 'styled-components'
import { useCgsPoolLiquidity, useCombinedVaults, useVaults, useVaultsTradingFeeApr } from 'state/hooks'
import { Vault } from 'state/types'
import { useWeb3React } from '@web3-react/core'
import { useDispatch } from 'react-redux'
import useRefresh from 'hooks/useRefresh'
import { orderBy, uniq } from 'lodash'
import { Flex, Heading, Text } from '@pancakeswap-libs/uikit'
import { BIG_ZERO } from 'utils/bigNumber'
import { BLOCKS_PER_YEAR } from 'config'
import { fetchVaultsUserDataAsync } from 'state/vaults'
import { fetchFarmUserDataAsync } from 'state/actions'
import { getPrice, getTradingFeeApr } from 'state/prices/helper'
import { getBalanceAmount } from 'utils/formatBalance'
import { useCgsPrice, usePrices } from 'state/prices/hooks'
import { useTokenPerBlock } from 'state/tokenPublicData/hooks'
import { getApy, getRoi } from 'utils/compoundApyCalculator'

import Page from 'components/layout/Page'
import TextBanner from 'components/TextBanner'
import RowVaultPool from './components/RowVaultPool'
import Filters from './components/Filters'
import useFilters from './hooks/useFilters'
import useFilteredPools from './hooks/useFilteredPools'
import VaultTable from './components/VaultTable'
import BountyCard from './components/Bounty/BountyCard'
import HelpButton from './components/Bounty/HelpButton'

const VaultPage = styled.div`
    position: relative;
`

const HeaderSection = styled(Flex)`
    justify-content: center;
    flex-direction: column;
    align-items: center;
`

const TableLayout = styled.div`
  display: flex;
  justify-content: center;
  flex-wrap: wrap;
  & > * {
    min-width: 280px;
    width: 100%;
    margin: 0 12px;
    margin-bottom: 32px;
  }
`

const BountyContainer = styled(Flex)`
    justify-content: center;
    align-items: center;
    padding: 20px;
`

const Vaults = () => {
    const { account } = useWeb3React()
    const vaults = useCombinedVaults()
    const tradingFeeAprs = useVaultsTradingFeeApr()
    const prices = usePrices()
    const cgsvPrice = useCgsPrice()
    const cgsPoolLiquidity = useCgsPoolLiquidity()
    const tokenVPerBlock = useTokenPerBlock()

    const dispatch = useDispatch()
    const { slowRefresh } = useRefresh()

    useEffect(() => {
        if (account) {
            dispatch(fetchFarmUserDataAsync(account))
            dispatch(fetchVaultsUserDataAsync(account))
        }
    }, [account, dispatch, slowRefresh])

    const tokens = useMemo(() => {
        const possibleDupplicatedTokens = vaults.flatMap((vault) => {
            return vault.stakingToken.isTokenOnly ? [vault.stakingToken.token.symbol] :
                [vault.stakingToken.token0.symbol, vault.stakingToken.token1.symbol]
        })

        return uniq(possibleDupplicatedTokens)
    }, [vaults])

    const { vaultFilter, updateFilter, clearFilter } = useFilters() 
    
    const calculateAdditionalInfomartionVaults = useCallback(
        (filteredVaults: Vault[]) => {
            const calculatedVaults = filteredVaults.map(vault => {
                let vaultApr = 0
                let vaultDailyApy = 0
                const vaultYearlyApy = 0
                let farmApr = 0
                let farmDailyApy = 0
                const farmYearlyApy = 0
                let totalApy = 0

                const stakingLpWorth = getPrice(prices, vault.stakingToken.token.address)
                const farmRewardTokenPrice = getPrice(prices, vault.farmContractInfo.mainToken.address)
                
                const cgsVRewardPerYear = BLOCKS_PER_YEAR.times(vault.poolWeight).times(tokenVPerBlock)
                const cakeRewardPerYearInUsdc = cgsVRewardPerYear.times(cgsvPrice);  

                const liquidity = vault.totalStaked ? 
                    getBalanceAmount(new BigNumber(vault.totalStaked).times(stakingLpWorth), vault.stakingToken.token.decimals) : BIG_ZERO

                if (vault.isAutoCgs) {
                    vaultApr = getRoi({
                        amountEarned: cakeRewardPerYearInUsdc.toNumber(),
                        amountInvested: cgsPoolLiquidity.toNumber(),
                    })
                }
                else if (liquidity.comparedTo(0) > 0){
                    vaultApr = getRoi({
                        amountEarned: cakeRewardPerYearInUsdc.toNumber(),
                        amountInvested: liquidity.toNumber(),
                    })
                }

                const tradingApr = getTradingFeeApr(tradingFeeAprs, vault.stakingToken.token.address)

                if (!vault.isAutoCgs && !vault.isManualCgs) {
                    const farmTokenRewardPerYear = BLOCKS_PER_YEAR.times(vault.farmContractInfo?.poolTokenPerBlock)
                    const farmTokenRewardPerYearInUsdc = farmTokenRewardPerYear.times(farmRewardTokenPrice);  

                    const farmLiquidity = vault.farmContractInfo?.totalPoolStaked ? 
                        new BigNumber(vault.farmContractInfo?.totalPoolStaked).times(stakingLpWorth) : BIG_ZERO                                                            

                    if (farmLiquidity.comparedTo(0) > 0){
                        const farmSimpleApr = getRoi({
                            amountEarned: farmTokenRewardPerYearInUsdc.toNumber(),
                            amountInvested: farmLiquidity.toNumber(),
                        })

                        const shareAfterCougarPerformanceFee = 1 - vault.performanceFee
                        farmApr = farmSimpleApr * shareAfterCougarPerformanceFee
                    }
                    
                    farmDailyApy = getApy(farmApr, vault.compoundFrequency, 365, 0)

                    totalApy = (1 + farmYearlyApy) * (1 + Number(vaultApr || 0)) - 1;
                }
                else if (vault.isAutoCgs) {
                    

                    const shareAfterCougarPerformanceFee = 1 - vault.performanceFee
                    const vaultAprAfterPerformanceFee = vaultApr * shareAfterCougarPerformanceFee

                    vaultDailyApy = getApy(vaultAprAfterPerformanceFee, vault.compoundFrequency, 365, 0)

                    totalApy = vaultDailyApy
                }           
                
                const totalApr = (vaultDailyApy > 0 ? vaultDailyApy : vaultApr)  + 
                    (farmDailyApy > 0 ? farmDailyApy: farmApr) + 
                    tradingApr

                const interest = {
                    ...vault.interest,
                    vaultApr,
                    vaultDailyApy,
                    vaultYearlyApy,
                    farmApr,
                    farmDailyApy,
                    farmYearlyApy,
                    tradingApr,
                    totalApr,
                    totalApy
                }

                return { ...vault, stakingLpWorth, farmRewardTokenPrice, liquidity, interest }
            })

            return calculatedVaults
        }, [prices, cgsvPrice, cgsPoolLiquidity, tokenVPerBlock, tradingFeeAprs]
    )

    const vaultsListMemoized = useMemo(() => {
        const sortVaults = (vaultsInput: Vault[]) : Vault[] => {
            switch (vaultFilter.sortBy) {
                case 'apr': 
                    return orderBy(vaultsInput, (vault: Vault) => vault.interest?.totalApr, 'desc')
                case 'tvl': 
                    return orderBy(vaultsInput, (vault: Vault) => Number(vault.liquidity), 'desc')
                default: 
                    return vaultsInput
            }
        }

        const vaultsList = calculateAdditionalInfomartionVaults(vaults)

        return sortVaults(vaultsList)

    }, [calculateAdditionalInfomartionVaults, 
        vaults,
        vaultFilter.sortBy])    

    const filteredPools = useFilteredPools(vaultsListMemoized, vaultFilter)

    return (
        <VaultPage>
            <TextBanner title='CVAULTS' text='All vaults autocompound at an optimal rate'/>            
            <Page>
                <HeaderSection>
                    {/* <PageTitle>
                        {TranslateString(999, 'CVAULTS')}
                    </PageTitle>
                    <Heading as="h1" size="lg" color="primary" style={{ textAlign: 'center' }}>
                        <HeaderText>All vaults autocompound at an optimal rate</HeaderText>
                    </Heading>   */}
                    {/* <HeaderCountDown /> */}
                </HeaderSection>
                {/* <Filters vaultFilter={vaultFilter} 
                    updateFilter={updateFilter}
                    clearFilter={clearFilter}
                    tokens={tokens}
                    /> */}
                <BountyContainer>
                    <BountyCard />
                    <HelpButton />
                </BountyContainer>
                <TableLayout>
                    <VaultTable>
                        {filteredPools.map((vault) => (
                            <RowVaultPool key={vault.id} vault={vault} account={account} />
                        ))}
                    </VaultTable>
                </TableLayout>
            </Page>
        </VaultPage>        
    )
}

export default Vaults