import React from 'react'
import styled from 'styled-components'
import BigNumber from 'bignumber.js'
import { Button, Flex, useModal } from '@pancakeswap-libs/uikit'
import useI18n from 'hooks/useI18n'
import { PresaleOption } from 'state/types'
import BuyModal from './BuyModal'
import useBuyPresale from '../hooks/useBuyPresale'

interface BuyActionProps {
    usdcBalance?: BigNumber
    tokensUnclaimed?: BigNumber
    tokenBalance?: BigNumber
    tokensLeft?: BigNumber
    isSaleActive?: boolean
    option?: PresaleOption
    usdcPerCake?: number
    purchaseLimit?: number
}


const BuyAction: React.FC<BuyActionProps> = ({ usdcBalance, tokensUnclaimed, tokenBalance, tokensLeft, option, usdcPerCake, purchaseLimit, isSaleActive = false }) => {
    const t = useI18n()
    const { onBuy } = useBuyPresale(option)        

    const [onPresentBuy] = useModal(
        <BuyModal max={usdcBalance} 
            onConfirm={onBuy} 
            tokenName="USDC" 
            tokensUnclaimed={tokensUnclaimed} 
            tokenBalance={tokenBalance} 
            tokensLeft={tokensLeft} 
            usdcPerCake={usdcPerCake}
            purchaseLimit={purchaseLimit}
            token="CGS" />
    )

    const renderBuyButtons = () => {
        return <Button mt="8px" disabled={!isSaleActive} onClick={onPresentBuy}>Buy CGS</Button>
    }

    return (
        <Flex justifyContent="space-between" alignItems="center" flexDirection="column">
            {renderBuyButtons()}
        </Flex>
    )
}

export default BuyAction