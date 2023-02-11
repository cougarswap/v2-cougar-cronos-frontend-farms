import React from 'react'
import styled from 'styled-components'
import { useRouteMatch, Link } from 'react-router-dom'
import { ButtonMenu, ButtonMenuItem, Text, Toggle } from '@pancakeswap-libs/uikit'
import useI18n from 'hooks/useI18n'

const FarmTabButtons = () => {
  const { url, isExact } = useRouteMatch()
  const TranslateString = useI18n()

  return (
    <Wrapper>      
      <div style={{ alignSelf: 'flex-end'}}>
        <ButtonMenu activeIndex={isExact ? 0 : 1} size="sm" variant="subtle">
          <ButtonMenuItem as={Link} to={`${url}`}>
            {TranslateString(698, 'Active')}
          </ButtonMenuItem>
          <ButtonMenuItem as={Link} to={`${url}/history`}>
            {TranslateString(700, 'Inactive')}
          </ButtonMenuItem>
        </ButtonMenu>
      </div>      
    </Wrapper>
  )
}

export default FarmTabButtons

const Wrapper = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
`