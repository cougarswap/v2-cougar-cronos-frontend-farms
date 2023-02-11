import React from 'react'
import BigNumber from 'bignumber.js'
import { CalculateIcon, IconButton, useModal } from '@pancakeswap-libs/uikit'
import { Address, DexSwapRouter } from 'config/constants/types'
import ApyCalculatorModal from './ApyCalculatorModal'

export interface ApyButtonProps {
  lpLabel?: string
  cakePrice?: BigNumber
  apy?: BigNumber
  quoteTokenAdresses?: Address
  quoteTokenSymbol?: string
  tokenAddresses: Address
  isTokenOnly?: boolean
  dex?: DexSwapRouter
  cakeSymbol?: string
  getLiquidityExternalLink?: string
}

const ApyButton: React.FC<ApyButtonProps> = ({
  lpLabel,
  quoteTokenAdresses,
  quoteTokenSymbol,
  tokenAddresses,
  cakePrice,
  isTokenOnly,
  dex,
  apy,
  cakeSymbol,
  getLiquidityExternalLink
}) => {
  const [onPresentApyModal] = useModal(
    <ApyCalculatorModal
      lpLabel={lpLabel}
      quoteTokenAdresses={quoteTokenAdresses}
      quoteTokenSymbol={quoteTokenSymbol}
      tokenAddresses={tokenAddresses}
      cakePrice={cakePrice}
      isTokenOnly={isTokenOnly}
      dex={dex}
      apy={apy}
      cakeSymbol={cakeSymbol}
      getLiquidityExternalLink={getLiquidityExternalLink}
    />,
  )

  return (
    <IconButton onClick={onPresentApyModal} style={{height: 'auto'}} variant="text" size="sm" ml="4px" color="primaryDark">
      <CalculateIcon />
    </IconButton>
  )
}

export default ApyButton
