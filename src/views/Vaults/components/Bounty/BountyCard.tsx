import React, { useMemo } from 'react'
import BigNumber from 'bignumber.js'
import { BIG_ZERO } from 'utils/bigNumber'
import styled from 'styled-components'
import {
  Card,
  CardBody,
  Text,
  Flex,
  HelpIcon,
  Button,
  Heading,
  Skeleton,
  useModal,
  Box,
  useTooltip,
} from '@pancakeswap-libs/uikit'
import { getBalanceNumber } from 'utils/formatBalance'
import Balance from 'components/Balance'
import { useCgsPrice } from 'state/prices/hooks'
import { useCakeVault } from 'state/hooks'
import BountyModal from './BountyModal'

const StyledCard = styled(Card)`
  width: 100%;
  background-color: #27262cb0;
  flex: 1;
  ${({ theme }) => theme.mediaQueries.sm} {
    min-width: 240px;
  }
`

const BountyCard = () => {
  const {
    estimatedCakeBountyReward,
    fees: { callFee },
  } = useCakeVault()
  const cakePriceBusd = useCgsPrice()

  const estimatedCakeBountyRewardBigNum = useMemo(() => {
    return estimatedCakeBountyReward ? new BigNumber(estimatedCakeBountyReward) : BIG_ZERO
  }, [estimatedCakeBountyReward])

  const estimatedDollarBountyReward = useMemo(() => {
    return new BigNumber(estimatedCakeBountyReward).multipliedBy(cakePriceBusd)
  }, [cakePriceBusd, estimatedCakeBountyReward])

  const hasFetchedDollarBounty = estimatedDollarBountyReward.gte(0)
  const hasFetchedCakeBounty = estimatedCakeBountyReward ? estimatedCakeBountyRewardBigNum.gte(0) : false
  const dollarBountyToDisplay = hasFetchedDollarBounty ? getBalanceNumber(estimatedDollarBountyReward, 18) : 0
  const cakeBountyToDisplay = hasFetchedCakeBounty ? getBalanceNumber(estimatedCakeBountyRewardBigNum, 18) : 0

  const TooltipComponent = ({ fee }: { fee: number }) => (
    <>
      <Text mb="16px">This bounty is given as a reward for providing a service to other users.</Text>
      <Text mb="16px">
          Whenever you successfully claim the bounty, you’re also helping out by activating the Auto CGS Pool’s compounding function for everyone.
      </Text>
      <Text style={{ fontWeight: 'bold' }}>
        {`Auto-Compound Bounty: ${fee}% of all Auto CGS pool users pending yield`}
      </Text>
    </>
  )

  const [onPresentBountyModal] = useModal(<BountyModal TooltipComponent={TooltipComponent} />)

  const { targetRef, tooltip, tooltipVisible } = useTooltip(<TooltipComponent fee={callFee} />, {
    placement: 'bottom-end',
    tooltipOffset: [20, 10],
  })

  return (
    <>
      {tooltipVisible && tooltip}
      <StyledCard>
        <CardBody>
          <Flex flexDirection="column">
            <Flex alignItems="center" mb="12px">
              <Text fontSize="16px" bold color="textSubtle" mr="4px">
                Auto CGS Bounty
              </Text>
              <Box ref={targetRef}>
                <HelpIcon color="textSubtle" />
              </Box>
            </Flex>
          </Flex>
          <Flex alignItems="center" justifyContent="space-between">
            <Flex flexDirection="column" mr="12px">
              <Heading>
                {hasFetchedCakeBounty ? (
                  <Balance color="white" fontSize="20px" value={cakeBountyToDisplay} decimals={3} />
                ) : (
                  <Skeleton height={20} width={96} mb="2px" />
                )}
              </Heading>
              {hasFetchedDollarBounty ? (
                <Balance
                  fontSize="12px"
                  color="texttotop"
                  value={dollarBountyToDisplay}
                  decimals={2}
                  unit=" USD"
                  prefix="~"
                />
              ) : (
                <Skeleton height={16} width={62} />
              )}
            </Flex>
            <Button
              disabled={!dollarBountyToDisplay || !cakeBountyToDisplay || !callFee}
              onClick={onPresentBountyModal}
              size="sm"
              id="clickClaimVaultBounty"
            >
              Claim
            </Button>
          </Flex>
        </CardBody>
      </StyledCard>
    </>
  )
}

export default BountyCard
