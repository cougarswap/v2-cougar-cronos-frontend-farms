import React, { useRef } from 'react'
import styled from 'styled-components'
import { Button, ChevronUpIcon } from '@pancakeswap-libs/uikit'
import useI18n from 'hooks/useI18n'

const Container = styled.div`
  width: 100%;
  /* background: ${({ theme }) => theme.card.background}; */
  background-color: rgb(16 12 12 / 82%);
  border-radius: 16px;
  margin: 16px 0px;
`

const TableWrapper = styled.div`
  overflow: visible;

  &::-webkit-scrollbar {
    display: none;
  }
`

const StyledTable = styled.table`
  border-collapse: collapse;
  font-size: 14px;
  border-radius: 4px;
  margin-left: auto;
  margin-right: auto;
  width: 100%;
`

const TableBody = styled.tbody`
  & tr {
    &:hover {
      background-color: #46508f4a;
    }
    td {
      font-size: 16px;
      vertical-align: middle;
    }
  }
`

const TableContainer = styled.div`
  position: relative;
`

const ScrollButtonContainer = styled.div`
  display: flex;
  justify-content: center;
  padding-top: 5px;
  padding-bottom: 5px;
`

const VaultTable = ({children}) => {
  const tableWrapperEl = useRef<HTMLDivElement>(null)
  const TranslateString = useI18n()

  const scrollToTop = (): void => {
    // tableWrapperEl.current.scrollIntoView({
    //   behavior: 'smooth'      
    // })    

    const elementPosition = tableWrapperEl.current.offsetTop;
    window.scrollTo({
        top: elementPosition - 10, // add your necessary value
        behavior: "smooth"  // Smooth transition to roll
    });
  }

  return (
    <Container>
      <TableContainer>
        <TableWrapper ref={tableWrapperEl}>
          <StyledTable>
            <TableBody>
              {children}
            </TableBody>
          </StyledTable>
        </TableWrapper>
        <ScrollButtonContainer>
          <Button variant="texttotop" onClick={scrollToTop}>
            {TranslateString(999, 'To Top')}
            <ChevronUpIcon color="primaryDark" />
          </Button>
        </ScrollButtonContainer>
      </TableContainer>
    </Container>
  )
}

export default VaultTable
