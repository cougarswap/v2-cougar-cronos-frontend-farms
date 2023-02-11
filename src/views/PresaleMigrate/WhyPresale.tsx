import React from 'react'
import styled from 'styled-components';
import useI18n from 'hooks/useI18n'
import { Heading, Text, Flex } from "@pancakeswap-libs/uikit"

const IntroductionCard = styled(Flex)`
    margin-top: 30px;
`

const BulletList = styled.ul`  
  list-style-type: none;
  margin-left: 8px;
  padding: 0;
  li {
    margin: 0;
    padding: 0;    
  }
  li::marker {
    font-size: 12px;
  }
  li::before {
    content: '•';
    margin-right: 8px;
    color: ${({ theme }) => theme.colors.ultraText};
  }
`

const TextWhy = styled(Text)`
    display: inline-block;
`

const WhyPresale = () => {
    const t= useI18n()

    return (
        <IntroductionCard  flexDirection="column">
            <Heading mb="24px" color="secondary">
                {t(999, 'Why Presale?')}
            </Heading>
            <BulletList>
                <li>
                    <TextWhy color="ultraText">
                        {t(999, 
                        'So-called "fair launches" are not actually fair. They are overrun by bots and insiders.',
                        )}
                    </TextWhy>
                </li>
                <li>
                    <TextWhy color="ultraText">
                        {t(999, 
                        'We predict that a quality farm launch will see significant interest in a fairly constituted early liquidity pool. We are initially placing a microcap valuation on the total supply to give investors an advantage',
                        )}
                    </TextWhy>
                </li>
                <li>
                    <TextWhy color="ultraText">
                        {t(999, 
                        'We prefer that everyone pay the same price initially',
                        )}
                    </TextWhy>
                </li>
                <li>
                    <TextWhy color="ultraText">
                        {t(999, 
                        'A presale enables us to provide a much larger amount of cash towards liquidity than we could otherwise.',
                        )}
                    </TextWhy>
                </li>
                <li>
                    <TextWhy color="ultraText">
                        {t(999, 
                        'A presale provides an established budget for marketing, partnerships, and further development',
                        )}
                    </TextWhy>
                </li>
            </BulletList>
        </IntroductionCard>)
}

export default WhyPresale