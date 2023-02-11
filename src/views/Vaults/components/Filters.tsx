import React, { useCallback, useMemo } from 'react'
import { Button, Checkbox, Flex, Text } from '@pancakeswap-libs/uikit'
import CheckBoxWithText from 'components/CheckBoxWithLabel'
import styled from 'styled-components'
import Select, { OptionProps } from 'components/Select/Select'
import { StakePlatform } from 'config/constants/types'
import { VaultFilter } from '../hooks/useFilters'
import FilterIcon from './FilterIcon'
import HelpButton from './Bounty/HelpButton'
import BountyCard from './Bounty/BountyCard'

const Container = styled.div` 
    padding: 12px; 
    margin-bottom: 20px;   
`

const FilterBody = styled.div`
    padding: 20px;
    border-radius: 10px;    
    /* border: 2px solid ${({theme}) => theme.colors.borderColor}; */
    background-color: #100c0cd1;
    display: grid;
    grid-template-rows: repeat(2, auto);
    grid-template-columns: repeat(2, 1fr);
    grid-row-gap: 10px;
    grid-column-gap: 5px;
    
    ${({ theme }) => theme.mediaQueries.nav} {
        grid-template-rows: repeat(2, auto);
        grid-template-columns: repeat(5, 1fr);
    }
`

const ClearWrapper = styled.div`
    padding: 10px;
    display: flex;
    justify-content: flex-end;  
    align-items: center;

    & > * + * {
        margin-left: 5px;
    }
`

const LabelWrapper = styled.div`
  & > ${Text} {
    font-size: 12px;
  };

  & > * + div {
    width: 90%;
  }
`

const BodyWrapper = styled.div<{expand?: boolean}>`
    transition: max-height 200ms;
    max-height: ${({expand}) => expand ? '400px' : 0 };
    overflow: ${({expand}) => expand ? 'visible' : 'hidden' };;
`

const HeaderWrapper = styled(Flex)`
    justify-content: space-between;
    flex-direction: column;

    ${({ theme }) => theme.mediaQueries.nav} {
        flex-direction: row;
    }
`

const BountyContainer = styled(Flex)`
    justify-content: center;
    align-items: center;
    padding: 20px;
`

export interface FiltersProps {
    vaultFilter?: VaultFilter
    updateFilter?: (key: any, value?: any) => void
    clearFilter?: () => void
    tokens?: string[]
}

const Filters : React.FC<FiltersProps> = ({
    vaultFilter, 
    updateFilter,
    clearFilter,
    tokens
}) => {

    const handleChechboxChange = useCallback((key) => {
        updateFilter(key)
    }, [updateFilter])

    const handleSelectChange = useCallback((key, value) => {
        updateFilter(key, value)
    }, [updateFilter])        

    const toggleFilter = useCallback(() => {
        updateFilter('showFilter')
    }, [updateFilter])

    const assets = useMemo(() => {
        const options = tokens.map(token => {
            return {
                label: token,
                value: token
            } as OptionProps
        })

        const allOption : OptionProps = {
            label: 'All',
            value: 'all',
        }

        return [allOption, ...options]

    }, [tokens])

    return (
        <Container>
            <HeaderWrapper>                
                <ClearWrapper>                
                    {vaultFilter.showFilter && 
                        <Button size="sm" 
                            onClick={clearFilter}>Clear Filters</Button>
                    }
                    <Button 
                        size="sm"
                        variant="tertiary"
                        onClick={() => toggleFilter()}
                        startIcon={<FilterIcon />}    
                        >Filters </Button>
                    
                </ClearWrapper>
            </HeaderWrapper>            
            <BodyWrapper expand={vaultFilter.showFilter}>
                <FilterBody>               
                    <CheckBoxWithText checked={vaultFilter.hideZeroBalances} 
                        onChange={() => handleChechboxChange('hideZeroBalances')} text="Hide Zero Balances" />
                    <CheckBoxWithText checked={vaultFilter.retiredVaults} 
                        onChange={() => handleChechboxChange('retiredVaults')} text="Retired Vaults" />
                    <CheckBoxWithText checked={vaultFilter.depositedVaults} 
                        onChange={() => handleChechboxChange('depositedVaults')} text="Deposited Vaults" />
                    <CheckBoxWithText checked={vaultFilter.manual} 
                        onChange={() => handleChechboxChange('manual')} text="Manual Pools" />
                    <CheckBoxWithText checked={vaultFilter.boost} 
                        onChange={() => handleChechboxChange('boost')} text="Boost" />
                    <LabelWrapper>
                        <Text color="text" textTransform="uppercase">Platform</Text>
                        <Select
                            onChange={(option) => handleSelectChange('platform', option.value)}
                            value={vaultFilter.platform}
                            options={[{
                                label: 'All',
                                value: 'all',
                            },
                            {
                                label: 'Cougar',
                                value: StakePlatform.COUGARSWAP,
                            },
                        ]}
                        />
                    </LabelWrapper>
                    <LabelWrapper>
                        <Text color="text" textTransform="uppercase">Vault Type</Text>
                        <Select
                            onChange={(option) => handleSelectChange('vaultType', option.value)}
                            value={vaultFilter.vaultType}
                            options={[{
                                label: 'All',
                                value: 'all',
                            },
                            {
                                label: 'Single Assets',
                                value: 'single',
                            },
                            {
                                label: 'LPs Assets',
                                value: 'lp',
                            },
                            {
                                label: 'Stable Assets',
                                value: 'stable',
                            }
                        ]}
                        />
                    </LabelWrapper>
                    <LabelWrapper>
                        <Text color="text" textTransform="uppercase">Asset</Text>
                        <Select
                            onChange={(option) => handleSelectChange('asset', option.value)}
                            value={vaultFilter.asset}
                            options={assets}
                        />
                    </LabelWrapper>
                    <LabelWrapper>
                        <Text color="text" textTransform="uppercase">Sort by</Text>
                        <Select
                            onChange={(option) => handleSelectChange('sortBy', option.value)}
                            value={vaultFilter.sortBy}
                            options={[{
                                label: 'Default',
                                value: 'default',
                            },
                            {
                                label: 'APR',
                                value: 'apr',
                            },
                            {
                                label: 'TVL',
                                value: 'tvl',
                            }
                        ]}
                        />
                    </LabelWrapper>    
                    <LabelWrapper>
                        <Text color="text" textTransform="uppercase">Deposit Fee</Text>
                        <Select
                            onChange={(option) => handleSelectChange('fee', option.value)}
                            value={vaultFilter.fee}
                            options={[{
                                label: 'All',
                                value: 'all',
                            },
                            {
                                label: 'No Deposit Fee',
                                value: 'nofee',
                            },
                            {
                                label: 'Deposit Fee > 0.1%',
                                value: 'hasfee',
                            }
                        ]}
                        />
                    </LabelWrapper>              
                </FilterBody>  
            </BodyWrapper>            
        </Container>
    )
}

export default React.memo(Filters)