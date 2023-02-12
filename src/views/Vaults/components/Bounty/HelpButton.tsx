import React from 'react'
import styled from 'styled-components'
import { Text, Button, HelpIcon, Link } from '@pancakeswap-libs/uikit'

const ButtonText = styled(Text)`
  display: none;
  ${({ theme }) => theme.mediaQueries.xs} {
    display: block;
  }
`

const Container = styled.div`
  margin-left: 16px;
  display: flex;
  justify-content: flex-end;

  ${({ theme }) => theme.mediaQueries.sm} {
    flex: 1;
  }
`

const StyledLink = styled(Link)`
  &:hover {
    text-decoration: none;
  }
`

const HelpButton = () => {
  return (
    <Container>
      <StyledLink external href="https://cougarswap.gitbook.io/cronoscougarswap/product/cougar-vaults">
        <Button px={['14px', null, null, null, '20px']} variant="primary">
          <ButtonText color="primary" bold fontSize="16px">
            Help
          </ButtonText>
          <HelpIcon marginLeft="3px" color="primary" ml={[null, null, null, 0, '6px']} />
        </Button>
      </StyledLink>
    </Container>
  )
}

export default HelpButton
