// @ts-nocheck
import React from 'react'
import { Text } from '@pancakeswap-libs/uikit'
import styled from 'styled-components'
import useI18n from 'hooks/useI18n'

const Block = styled.div`
    margin-bottom: 32px;    
    display: flex;
    flex-direction: column;
    text-align: center;
`

const CountDownBlockLink = styled.a`
  color: ${({ theme }) => theme.colors.binance};
`

interface CountDownToLauchTimeProps {
    block: number;
    timeStamp: number;
}

const CountDownToLauchTime: React.FC<CountDownToLauchTimeProps> = ({block, timeStamp}) => {
    const TranslateString = useI18n()

    const currentTimeStamp = Math.round(+new Date()/1000);

    return currentTimeStamp < timeStamp ? (
        <Block>
            <Text as="p" fontSize="24px">
                <strong>{TranslateString(730, 'Farming will start on Block')}&nbsp;
                <CountDownBlockLink href={`https://cronoscan.com/block/countdown/${block}`}>#{block}</CountDownBlockLink>
                </strong>
            </Text>
            <Text as="p" fontSize="20px">
                ETA: {(new Date(timeStamp * 1000)).toUTCString()}
            </Text>
            <Text as="p" fontSize="10px">
                {(new Date(timeStamp * 1000)).toString()}
            </Text>
        </Block>
    ) : null
}

export default CountDownToLauchTime