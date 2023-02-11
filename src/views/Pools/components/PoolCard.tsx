import BigNumber from 'bignumber.js'
import React, { useCallback, useMemo, useState } from 'react'
import styled from 'styled-components'
import { Button, IconButton, useModal, AddIcon, Image, Flex, Text, useTooltip, TimerIcon } from '@pancakeswap-libs/uikit'
import { useWeb3React } from '@web3-react/core'
import UnlockButton from 'components/UnlockButton'
import Label from 'components/Label'
import { useERC20 } from 'hooks/useContract'
import { useSousApprove } from 'hooks/useApprove'
import useI18n from 'hooks/useI18n'
import { useSousStake } from 'hooks/useStake'
import { useSousUnstake } from 'hooks/useUnstake'
import { useBlock } from 'state/block/hooks'
import { getBalanceNumber } from 'utils/formatBalance'
import { useSousHarvest } from 'hooks/useHarvest'
import Balance from 'components/Balance'
import { QuoteToken, PoolCategory } from 'config/constants/types'
import { Pool } from 'state/types'
import { useTransferTaxRate } from 'state/tokenPublicData/hooks'
import CountdownTimer from 'views/Farms/components/FarmCard/CountdownTimer'
import DepositModal from './DepositModal'
import WithdrawModal from './WithdrawModal'
import CompoundModal from './CompoundModal'
import CardTitle from './CardTitle'
import Card from './Card'
import OldSyrupTitle from './OldSyrupTitle'
import HarvestButton from './HarvestButton'
import CardFooter from './CardFooter'

const CHAIN_ID = process.env.REACT_APP_CHAIN_ID

interface PoolWithApy extends Pool {
  apy: BigNumber
}

interface HarvestProps {
  pool: PoolWithApy
}


const HarvestCountdown = styled.div`
  display: flex;
`

const HarvestUntilCard = styled(Flex)`
  position: absolute;
  top: -50%;
  right: 14px;
`

const CountdownContainer = styled(Flex)`
  justify-content: flex-end;
  align-items: center;
  width: 120px;
`


const ActionWrapper = styled.div`
  position: relative;
`
const HarvestInfo = styled.span`
  cursor: pointer;
`

const PoolCard: React.FC<HarvestProps> = ({ pool }) => {
  const {
    sousId,
    image,
    tokenName,
    tokenAddress,    
    stakingTokenName,
    stakingTokenAddress,
    projectLink,
    harvest,
    apy,
    tokenDecimals,
    poolCategory,
    totalStaked,
    startBlock,
    endBlock,
    isFinished,
    userData,
    stakingLimit,
  } = pool
  // Pools using native BNB behave differently than pools using a token
  const isBnbPool = poolCategory === PoolCategory.BINANCE
  const TranslateString = useI18n()
  const stakingTokenContract = useERC20(stakingTokenAddress)
  const { account } = useWeb3React()
  const { currentBlock: block } = useBlock()
  const { onApprove } = useSousApprove(stakingTokenContract, sousId)
  const { onStake } = useSousStake(sousId, isBnbPool)
  const { onUnstake } = useSousUnstake(sousId)
  const { onReward } = useSousHarvest(sousId, isBnbPool)
  const transferTaxRate = useTransferTaxRate()
  
  const [requestedApproval, setRequestedApproval] = useState(false)
  const [pendingTx, setPendingTx] = useState(false)

  const allowance = new BigNumber(userData?.allowance || 0)
  const stakingTokenBalance = new BigNumber(userData?.stakingTokenBalance || 0)
  const stakedBalance = new BigNumber(userData?.stakedBalance || 0)
  const earnings = new BigNumber(userData?.pendingReward || 0)

  const blocksUntilStart = Math.max(startBlock - block, 0)
  const blocksRemaining = Math.max(endBlock - block, 0)
  const isOldSyrup = stakingTokenName === QuoteToken.SYRUP
  const accountHasStakedBalance = stakedBalance?.toNumber() > 0
  const needsApproval = !accountHasStakedBalance && !allowance.toNumber() && !isBnbPool
  const isCardActive = isFinished && accountHasStakedBalance

  const convertedLimit = new BigNumber(stakingLimit).multipliedBy(new BigNumber(10).pow(tokenDecimals))
  const [onPresentDeposit] = useModal(
    <DepositModal
      max={stakingLimit && stakingTokenBalance.isGreaterThan(convertedLimit) ? convertedLimit : stakingTokenBalance}
      onConfirm={onStake}
      tokenName={stakingLimit ? `${stakingTokenName} (${stakingLimit} max)` : stakingTokenName}
    />,
  )

  const [onPresentCompound] = useModal(
    <CompoundModal earnings={earnings} onConfirm={onStake} tokenName={stakingTokenName} />,
  )

  const [onPresentWithdraw] = useModal(
    <WithdrawModal max={stakedBalance} onConfirm={onUnstake} tokenName={stakingTokenName} />,
  )

  const handleApprove = useCallback(async () => {
    try {
      setRequestedApproval(true)
      const txHash = await onApprove()
      // user rejected tx or didn't go thru
      if (!txHash) {
        setRequestedApproval(false)
      }
    } catch (e) {
      console.error(e)
    }
  }, [onApprove, setRequestedApproval])

  const currentMs = Date.now() / 1000

  const secondsUntilNextWithdraw = useMemo(() => {  
    const nextWithdrawalUntil = new BigNumber(userData?.nextWithdrawalUntil || 0)
    if (nextWithdrawalUntil.eq(0)) return 0
    return Math.round(nextWithdrawalUntil.toNumber() - currentMs)
  }, [currentMs, userData?.nextWithdrawalUntil]) 

  const tooltipContent = <HarvestCountdown>
    <Text fontSize='12px'>Withdraw Locked In:&nbsp;</Text>
    <CountdownContainer>
      <CountdownTimer seconds={secondsUntilNextWithdraw} fontSize='0.8em' /> 
    </CountdownContainer>
  </HarvestCountdown>

  const { targetRef, tooltip: tooltipMiddle, tooltipVisible: middleVisible } = useTooltip(tooltipContent, { placement: "top", trigger: "hover" });

  return (
    <Card isActive={isCardActive} isFinished={isFinished && sousId !== 0}>
      {isFinished && sousId !== 0 && <PoolFinishedSash />}
      <div style={{ padding: '24px' }}>
        <CardTitle isFinished={isFinished && sousId !== 0}>
          {isOldSyrup && '[OLD]'} {tokenName} {TranslateString(348, 'Jungle')}
        </CardTitle>
        <div style={{ marginBottom: '8px', display: 'flex', alignItems: 'center' }}>
          <div style={{ flex: 1 }}>
            <Image src={`/images/single-token/${image || tokenName}.png`} width={64} height={64} alt={tokenName} />
          </div>
          {account && harvest && !isOldSyrup && (
            <HarvestButton
              disabled={!earnings.toNumber() || pendingTx}
              text={pendingTx ? 'Collecting' : 'Harvest'}
              onClick={async () => {
                setPendingTx(true)
                await onReward()
                setPendingTx(false)
              }}
            />
          )}
        </div>
        {!isOldSyrup ? (
          <BalanceAndCompound>
            <Balance value={getBalanceNumber(earnings, tokenDecimals)} isDisabled={isFinished} />
            {sousId === 0 && account && harvest && (
              <HarvestButton
                disabled={!earnings.toNumber() || pendingTx}
                text={pendingTx ? TranslateString(999, 'Compounding') : TranslateString(999, 'Compound')}
                onClick={onPresentCompound}
              />
            )}
          </BalanceAndCompound>
        ) : (
          <OldSyrupTitle hasBalance={accountHasStakedBalance} />
        )}
        <Label isFinished={isFinished && sousId !== 0} text={TranslateString(330, `${tokenName} earned`)} />
        <StyledCardActions>
          {!account && <UnlockButton />}
          {account &&
            (needsApproval && !isOldSyrup ? (
              <div style={{ flex: 1 }}>
                <Button disabled={isFinished || requestedApproval} onClick={handleApprove} fullWidth>
                  {`Approve ${stakingTokenName}`}
                </Button>
              </div>
            ) : (
              <>
                <ActionWrapper>
                  {secondsUntilNextWithdraw > 0 ? 
                    <HarvestUntilCard>
                      <HarvestInfo ref={targetRef}>
                        <TimerIcon color='#df0939'/>
                      </HarvestInfo>
                      {middleVisible && tooltipMiddle}
                    </HarvestUntilCard> : null
                  }
                  <Button
                    disabled={stakedBalance.eq(new BigNumber(0)) || pendingTx || secondsUntilNextWithdraw > 0}
                    onClick={
                      isOldSyrup
                        ? async () => {
                            setPendingTx(true)
                            await onUnstake('0')
                            setPendingTx(false)
                          }
                        : onPresentWithdraw
                    }
                  >
                    {`Unstake ${stakingTokenName}`}
                  </Button>
                </ActionWrapper>                
                <StyledActionSpacer />
                {!isOldSyrup && (
                  <IconButton disabled={isFinished && sousId !== 0} onClick={onPresentDeposit}>
                    <AddIcon color="background" />
                  </IconButton>
                )}
              </>
            ))}
        </StyledCardActions>
        <StyledDetails>
          <div style={{ flex: 1 }}>{TranslateString(736, 'APR')}:</div>
          {isFinished || isOldSyrup || !apy || apy?.isNaN() || !apy?.isFinite() ? (
            '-'
          ) : (
            <Balance fontSize="14px" isDisabled={isFinished} value={apy?.toNumber()} decimals={2} unit="%" />
          )}
        </StyledDetails>
        <StyledDetails style={{margin: '10px auto'}}>
          <div style={{ flex: 1 }}>{TranslateString(999, 'Deposit Fee')}:</div>
          {isFinished || isOldSyrup ? (
            '-'
          ) : (
            <Balance fontSize="14px" isDisabled={isFinished} value={transferTaxRate} decimals={0} unit="%" />
          )}
        </StyledDetails>
        <StyledDetails style={{margin: '10px auto'}}>
          <div style={{ flex: 1 }}>{TranslateString(999, 'Withdraw Fee')}:</div>
          {isFinished || isOldSyrup ? (
            '-'
          ) : (
            <Balance fontSize="14px" isDisabled={isFinished} value={transferTaxRate} decimals={0} unit="%" />
          )}
        </StyledDetails>
        <StyledDetails>
          <div style={{ flex: 1 }}>
            <span role="img" aria-label={stakingTokenName}>
              🥞{' '}
            </span>
            {TranslateString(384, 'Your Stake')}:
          </div>
          <Balance fontSize="14px" isDisabled={isFinished} value={getBalanceNumber(stakedBalance)} />
        </StyledDetails>
        <NoteBox>
          * Deposit Fee and Withdraw Fee will be burned immediately 
        </NoteBox>
      </div>
      <CardFooter
        projectLink={projectLink}
        totalStaked={totalStaked}
        endBlock={endBlock}
        blocksRemaining={blocksRemaining}
        startBlock={startBlock}
        blocksUntilStart={blocksUntilStart}
        isFinished={isFinished}
        poolCategory={poolCategory}
        contractAddress={pool.contractAddress}
        account={account}
        tokenSymbol={tokenName}
        tokenAddress={tokenAddress}
        tokenDecimals={tokenDecimals}
      />
    </Card>
  )
}

const PoolFinishedSash = styled.div`
  background-image: url('/images/pool-finished-sash.svg');
  background-position: top right;
  background-repeat: not-repeat;
  height: 135px;
  position: absolute;
  right: -24px;
  top: -24px;
  width: 135px;
`

const StyledCardActions = styled.div`
  display: flex;
  justify-content: center;
  margin: 16px 0;
  width: 100%;
  box-sizing: border-box;
`

const BalanceAndCompound = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-direction: row;
`

const StyledActionSpacer = styled.div`
  height: ${(props) => props.theme.spacing[4]}px;
  width: ${(props) => props.theme.spacing[4]}px;
`

const StyledDetails = styled.div`
  display: flex;
  font-size: 14px;
`

const NoteBox = styled.div`
  color: #896643;
  margin-top: 10px;
  line-height: 1.1;
  font-size: 0.8em;
`

export default PoolCard
