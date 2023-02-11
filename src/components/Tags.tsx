import React from 'react'
import { Tag, VerifiedIcon, CommunityIcon, BinanceIcon, OpenNewIcon, AutoRenewIcon, CheckmarkIcon } from '@pancakeswap-libs/uikit'

const NoFeeTag = () => (
  <Tag variant="failure" outline startIcon={<VerifiedIcon />}>
    No Fees
  </Tag>
)

const RiskTag = ({ risk }) => (
  <Tag variant={risk >= 3 ? 'failure' : 'success'} outline startIcon={<VerifiedIcon />}>
    Risk {risk}
  </Tag>
)

const CoreTag = () => (
  <Tag variant='secondary' outline startIcon={<VerifiedIcon />}>
    Core
  </Tag>
)

const CommunityTag = () => (
  <Tag variant='textSubtle' outline startIcon={<CommunityIcon />}>
    Community
  </Tag>
)

const FarmingTag = () => (
  <Tag variant='success' outline startIcon={<VerifiedIcon />}>
    Farming
  </Tag>
)

const WaitingTag = () => (
  <Tag variant='textDisabled' startIcon={<AutoRenewIcon />}>
    Waiting
  </Tag>
)

const BinanceTag = () => (
  <Tag variant='binance' outline startIcon={<BinanceIcon />}>
    Binance
  </Tag>
)

const NewTag = () => (
  <Tag variant='failure' startIcon={<CheckmarkIcon />}>
    New
  </Tag>
)

export { CoreTag, CommunityTag, BinanceTag, RiskTag, NoFeeTag, FarmingTag, WaitingTag, NewTag }
