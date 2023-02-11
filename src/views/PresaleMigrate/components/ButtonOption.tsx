import React from 'react'
import styled from "styled-components"
import { ButtonMenuProps, Tab, Flex } from "@pancakeswap-libs/uikit"

export interface ButtonOptionProps {
    isActive?: boolean;
    text: string
}

const NewImage = styled.img`
  position: absolute;
  top:  -40px;
  left: -10px;
  width: 80px;
`

const ButtonOption : React.FC<ButtonOptionProps> = ({
    isActive,
    text,
    ...props
}) => {
    return (
        <Tab {...props} style={{position: 'relative'}}>
            <Flex alignItems="center">
               {text}
            </Flex>
            <NewImage src="/images/egg/newpool.png" alt="Active" />)
        </Tab>
    )
}

export default ButtonOption;