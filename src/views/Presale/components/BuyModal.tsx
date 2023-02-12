import BigNumber from 'bignumber.js'
import React, { useCallback, useEffect, useMemo, useState } from 'react'
import styled from 'styled-components'
import { AutoRenewIcon, Button, LinkExternal, Modal, Text } from '@pancakeswap-libs/uikit'
import useI18n from 'hooks/useI18n'
import { getBalanceAmount, getBalanceNumber, getDecimalAmount, getFullDisplayBalance } from 'utils/formatBalance'
import { CAKE_PRESALE_PRICE } from 'config/constants/presale'
import { BIG_ZERO } from 'utils/bigNumber'
import { getUsdcAddress } from 'utils/addressHelpers'
import ModalActions from 'components/ModalActions'
import ModalInput from 'components/ModalInput'

interface BuyModalProps {
    max: BigNumber
    tokenName?: string
    onConfirm: (amount: string) => void
    onDismiss?: () => void
    tokensUnclaimed?: BigNumber
    tokenBalance?: BigNumber
    tokensLeft?: BigNumber
    token?: string
    usdcPerCake?: number
    purchaseLimit?: number
}

const TokenWillReceive = styled(Text)`
    color: #3fff00;
    text-align: center;
    margin-top: 8px;
    margin-bottom: 8px;
`

const MaxTokenCanBuy = styled(Text)`
    text-align: center;
    color: #3fff00;
`

const PriceTag = styled(Text)`
    text-align: center;
    color: #3fff00;
`

const BuyModal: React.FC<BuyModalProps> = ({ max, usdcPerCake, tokensUnclaimed, purchaseLimit, tokenName = "", onConfirm, onDismiss, tokensLeft }) => {
    const [val, setVal] = useState('')
    const [pendingTx, setPendingTx] = useState(false)
    const t = useI18n()
    const lpTokenDecimals = 6 // usdc is configured for 6 decimal
    const fullBalance = useMemo(() => {
        return getFullDisplayBalance(max, lpTokenDecimals)
    }, [max, lpTokenDecimals])
    const fullBalanceBigNumber = useMemo(() => {
        return getBalanceAmount(max, lpTokenDecimals)
    }, [max, lpTokenDecimals])

    const handleChange = useCallback(
        (e: React.FormEvent<HTMLInputElement>) => {
          if (e.currentTarget.validity.valid) {
            setVal(e.currentTarget.value.replace(/,/g, '.'))
          }
        },
        [setVal],
      )
      
    const [numberTokenWillReceived, setNumberTokenWillReceived] = useState(BIG_ZERO)
    
    const maxTokenCanBuy = useMemo(() => {
        const tokenHasBought = getBalanceNumber(tokensUnclaimed, 6)
        const maxCanBuy = purchaseLimit - tokenHasBought
        return maxCanBuy
    },[purchaseLimit, tokensUnclaimed])
    

    useEffect(() => {
        const output = new BigNumber(Number(val)).dividedBy(usdcPerCake);
        setNumberTokenWillReceived(output)
    }, [val, usdcPerCake])

    const handleSelectMax = useCallback(() => {
        setVal(fullBalance)
    }, [fullBalance, setVal])

    const usdcLiquidityUrl = `https://cronosdex.cougarswap.io/#/swap?outputCurrency=${getUsdcAddress()}`

    return (
        <Modal title={`${t(999, 'Buy CGS Token')}`} onDismiss={onDismiss}>            
            <ModalInput
                value={val}
                onSelectMax={handleSelectMax}
                onChange={handleChange}
                max={fullBalance}
                symbol={tokenName}
                addLiquidityUrl={usdcLiquidityUrl}
                inputTitle='Presale BUY'
            />
            <TokenWillReceive>{`${t(999, 'You will get:')} ${numberTokenWillReceived.toNumber()} CGS`}</TokenWillReceive>
            <PriceTag>Price: 1 CGS = ${usdcPerCake} USDC</PriceTag>
            <MaxTokenCanBuy>{`${t(999, 'Max token you can buy:')} ${maxTokenCanBuy} CGS`}</MaxTokenCanBuy>
            <ModalActions>
                <Button variant="secondary" onClick={onDismiss} disabled={pendingTx}>
                    {t(999, 'Cancel')}
                </Button>
                <Button
                    isLoading={pendingTx}
                    endIcon={pendingTx ? <AutoRenewIcon spin color="currentColor" /> : null}                        
                    disabled={!val
                        || numberTokenWillReceived.gt(tokensLeft)
                        || numberTokenWillReceived.gt(maxTokenCanBuy)
                        || new BigNumber(val).gt(fullBalanceBigNumber)
                        || pendingTx}

                    onClick={async () => {
                        setPendingTx(true)
                        await onConfirm(val)
                        setPendingTx(false)
                        onDismiss()
                    }}
                >
                    {pendingTx ? t(999, 'Confirming') : t(999, 'Confirm')}
                </Button>
            </ModalActions>
            <LinkExternal href={usdcLiquidityUrl} style={{ alignSelf: 'center' }}>
                {t(999, 'Get USDC')}
            </LinkExternal>
        </Modal>
    )
}

export default BuyModal
