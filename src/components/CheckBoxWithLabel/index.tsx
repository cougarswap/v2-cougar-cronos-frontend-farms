import React from 'react'
import { Checkbox,Text } from "@pancakeswap-libs/uikit"
import styled from 'styled-components'


const Wrapper = styled.label`
    display: inline-flex;
    align-items: center;
`

export interface CheckBoxWithTextProps {
    text?: string
    checked?: boolean
    onChange?: () => void
}

const CheckBoxWithText : React.FC<CheckBoxWithTextProps> = (
    {
        text,
        checked,
        onChange
    }) => {
    
    const cbName = text.toLowerCase().replaceAll(' ', '')

    return (

        <Wrapper>
            <Checkbox checked={checked} onChange={onChange} name={cbName}/>
            <Text color="white" ml='5px'>{text}</Text>
        </Wrapper>
    )
}

export default React.memo(CheckBoxWithText)