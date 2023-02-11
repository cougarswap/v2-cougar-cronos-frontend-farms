import React from 'react'
import { CardBody, Heading, Text } from '@pancakeswap-libs/uikit'
import Card from 'components/layout/Card'
import styled from 'styled-components'
import { Timeline } from 'react-twitter-widgets'
import useI18n from 'hooks/useI18n'

const StyledTwitterCard = styled(Card)`
  background-color: #27262cad;
  margin-left: auto;
  margin-right: auto;
  background: linear-gradient(166deg,#143c78 20%,#464f99 80%);
  box-shadow: 0px 4px 4px rgba(0, 0, 0, 0.25);
  opacity: 0.85;
  border-radius: 33px;
  &>div>div {
    max-height: 390px;
    overflow-y: scroll;
  }
`

const Row = styled.div`
  align-items: center;
  display: flex;
  font-size: 14px;
  justify-content: space-between;
  margin-bottom: 8px;
`

const TwitterCard = () => {
  const TranslateString = useI18n()

  return (
    <StyledTwitterCard>
      <CardBody>
        <Heading size="xl" color="#ffffff" mb="24px">
          {TranslateString(10003, 'Announcements')}
        </Heading>
        <Timeline
          dataSource={{
            sourceType: 'profile',
            screenName: 'cougarswap'
          }}
          options={{
            height: '315',
            chrome: "noheader, nofooter",
            width: "100%"
          }}
        />
      </CardBody>
    </StyledTwitterCard>
  )
}

export default TwitterCard
