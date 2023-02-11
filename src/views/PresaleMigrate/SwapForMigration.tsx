import React, { useMemo, useState } from 'react'
import BigNumber from 'bignumber.js'

import { Flex, Heading, Text, Box, BalanceInput, Button, Image, ChevronDownIcon } from '@pancakeswap-libs/uikit'
import styled from 'styled-components'
import { useWeb3React } from '@web3-react/core'
import { useTranslation } from 'contexts/Localization'
import { BIG_TEN, BIG_ZERO } from 'utils/bigNumber'
import { DEFAULT_TOKEN_DECIMAL } from 'config'
import { PresaleOption } from 'state/types'
import { getBalanceAmount, getBalanceNumber, getDecimalAmount } from 'utils/formatBalance'
import { ToastDescriptionWithTx } from 'components/Toast'
import UnlockButton from 'components/UnlockButton'
import useToast from 'hooks/useToast'
// import { usePresaleUserTokenData } from './hooks/usePresaleMigrateUserData'
import { usePresaleUserTokenData, usePresaleUserData, usePresalePublicData } from 'views/Presale/hooks/usePresaleUserData'
import ClaimAction from './components/ClaimAction'
import MigrationActions from './MigrationActions'

const SwapContainer = styled(Flex)`
    flex-direction: column;
    max-width: 400px;
    background-color: #000000bd;
    justify-content: center;
    opacity: 0.85;
    margin: 40px auto 20px;
    border-radius: 33px;
    padding: 20px;
`

const CurrencyBox = styled.div``

const multiplierValues = [0.1, 0.25, 0.5, 1]

const Label = (props) => <Text bold fontSize="12px" color="primaryDark" textTransform="uppercase" {...props} />

const Value = (props) => <Text bold fontSize="20px" style={{ wordBreak: 'break-all' }} {...props} />

export default function SwapForMigration() {
    const { t } = useTranslation()
    const { account } = useWeb3React()    
    const [value, setValue] = useState('')
    
    const { isClaimActive, BuyTokenPerCGS } = usePresalePublicData(PresaleOption.OPTION_1)
    // const abc =  usePresalePublicData(PresaleOption.OPTION_1)
    const { 
            userAllowance: userAllowanceAsString,
            cakeUnclaimed: tokensUnclaimedAsString,
            cakeLastClaimed: cakeLastClaimedAsString
        } = usePresaleUserData(PresaleOption.OPTION_1);
        
    const {
        usdcBalance: cgsOldBalanceAsString,
        cakeBalance: cgsNewBalanceAsString,
    } = usePresaleUserTokenData()
    
    // const userAllowance = new BigNumber(userAllowanceAsString)
    // const allowanceBigNumber = getBalanceAmount(userAllowance)     
    
    const { toastSuccess } = useToast()
        
    const maximumTokenCommittable = useMemo(() => {
        return cgsOldBalanceAsString ? new BigNumber(cgsOldBalanceAsString) : BIG_ZERO
    }, [cgsOldBalanceAsString])

    const cgsOldBalance = useMemo(() => {        
        return cgsOldBalanceAsString ? new BigNumber(cgsOldBalanceAsString) : BIG_ZERO
    }, [cgsOldBalanceAsString])

    const cgsNewBalance = useMemo(() => {        
        return cgsNewBalanceAsString ? new BigNumber(cgsNewBalanceAsString) : BIG_ZERO
    }, [cgsNewBalanceAsString])

    // const tokensUnclaimed = new BigNumber(1)
    
    const tokensUnclaimed = useMemo(() => {
        return tokensUnclaimedAsString ? new BigNumber(tokensUnclaimedAsString) : BIG_ZERO; 
    }, [tokensUnclaimedAsString])

    const canbeClaim = isClaimActive && tokensUnclaimed.gt(0);  

    const valueWithTokenDecimals = new BigNumber(value).times(BIG_TEN.pow(6))

    const isWarning =
        valueWithTokenDecimals.isGreaterThan(cgsOldBalance)

  // Refetch all the data, and display a message when fetching is done
  const handleContributeSuccess = async (amount: BigNumber, txHash: string) => {
    // reload data
    toastSuccess(
      t('Success!'),
      <ToastDescriptionWithTx txHash={txHash}>
        {t('You have converted %amount% CGS(old) to CGS(new)!', {
          amount: getBalanceNumber(amount),
        })}
      </ToastDescriptionWithTx>,
    )
  }

  const handleApproveSuccess = async (txHash: string) => {
    toastSuccess(
      t('Got approval!'),
      <ToastDescriptionWithTx txHash={txHash}>
        {t('You have successfully approved the migration contract, enter the number of CGS(old) you want to convert, then click Confirm!')}
      </ToastDescriptionWithTx>,
    )
  }

  return (
    <SwapContainer>
        <Box p="2px">  
            <CurrencyBox>
                <Flex justifyContent="space-between" mb="8px">
                    <Text color='text' bold>{t('From')}</Text>
                    <Flex flexGrow={1} justifyContent="flex-end">
                        <Image
                            src='images/single-token/CGS.png'
                            width={24}
                            height={24}
                        />
                        <Text color='text' ml="4px">CGS (old)</Text>
                    </Flex>
                </Flex>
                <BalanceInput
                    value={value}
                    onUserInput={setValue}
                    isWarning={isWarning}
                    decimals={6}
                    onBlur={() => {
                        if (isWarning) {
                            // auto adjust to max value
                            setValue(getBalanceAmount(maximumTokenCommittable, 18).toString())
                        }
                    }}
                    mb="8px"
                />
                {isWarning && (
                    <Text
                        color={valueWithTokenDecimals.isGreaterThan(cgsOldBalance) ? 'failure' : 'warning'}
                        fontSize="12px"
                        mb="8px"
                        >
                        {valueWithTokenDecimals.isGreaterThan(cgsOldBalance)
                            ? t('Insufficient Balance')
                            : t('Exceeded max CGS(old) entry')}
                    </Text>
                )}
                <Text color="textSubtle" fontSize="12px" mb="16px" bold>
                    {t('Balance: %balance%', {
                        balance: getBalanceAmount(cgsOldBalance, 18).toFixed(2),
                    })}
                </Text>
            </CurrencyBox>                       
            <Flex justifyContent="center">
                <ChevronDownIcon color="textSubTitleFarm" />
            </Flex>
            <CurrencyBox>
                <Flex justifyContent="space-between" mb="8px">
                    <Text color='text' bold>{t('To')}</Text>
                    <Flex flexGrow={1} justifyContent="flex-end">
                        <Image
                            src='images/single-token/CGS.png'
                            width={24}
                            height={24}
                        />
                        <Text color='text' ml="4px">CGS</Text>
                    </Flex>
                </Flex>
                <BalanceInput
                    aria-disabled
                    // value={value}
                    value={Number(value) *10000/BuyTokenPerCGS} // for poly
                    onUserInput={setValue}
                    decimals={18}                    
                    mb="8px"
                />
                <Text color="textSubtle" fontSize="12px" mb="16px" bold>
                    {t('Balance: %balance%', {
                        balance: getBalanceAmount(cgsNewBalance, 18).toFixed(2),
                    })}
                </Text>
            </CurrencyBox>                
            <Flex justifyContent="center" mb="16px">
                {multiplierValues.map((multiplierValue, index) => (
                <Button
                    key={multiplierValue}
                    size="sm"
                    variant="tertiary"
                    onClick={() => setValue(getBalanceAmount(maximumTokenCommittable.times(multiplierValue)).toString())}
                    mr={index < multiplierValues.length - 1 ? '8px' : 0}
                >
                    {multiplierValue * 100}%
                </Button>
                ))}
            </Flex>             
            {!account ? <UnlockButton mt="8px" fullWidth /> : (
                <MigrationActions account={account}
                    value={value}
                    cgsOldBalance={cgsOldBalance}
                    onApproveSuccess={handleApproveSuccess}
                    onSuccess={handleContributeSuccess} />
            )}                         
        </Box>
        <Box>
            <Flex 
                marginTop="40px"
                flexDirection="column" 
                justifyContent="center">
                <Flex justifyContent="space-between">
                    <Label>{t('Your CGS(old) to be converted')}</Label>
                    <Value>{getBalanceNumber(tokensUnclaimed, 18)}</Value>
                </Flex>
                <Flex justifyContent="space-between">
                    <Label>{t('CGS(new) to receive')}</Label>
                    <Value>{getBalanceNumber(tokensUnclaimed, 18)}</Value>
                </Flex>
                <Flex>
                    {!account ? <UnlockButton mt="8px" fullWidth /> : 
                        <ClaimAction 
                            isClaimActive={canbeClaim} 
                            option={PresaleOption.OPTION_1}
                            percentToClaim={100}
                            />}
                </Flex>
            </Flex>
            
        </Box>
    </SwapContainer>
  )
}