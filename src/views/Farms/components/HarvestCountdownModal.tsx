import React, { useCallback, useMemo, useState } from 'react'
import { Button, Flex, Modal, Text } from '@pancakeswap-libs/uikit'
import ModalActions from 'components/ModalActions'
import useI18n from 'hooks/useI18n'
import styled from 'styled-components'
import CountdownTimer from './FarmCard/CountdownTimer'

interface HarvestCountdownModalProps {
  secondsToHarvest: number  
  onDismiss?: () => void
  harvestInterval: number
  tokenName?: string
}

const ModelBody = styled(Flex)`
  align-items: center;
  flex-direction: column;
`

const HarvestCountdownModal: React.FC<HarvestCountdownModalProps> = ({ secondsToHarvest, onDismiss, harvestInterval, tokenName = '' }) => {
  const TranslateString = useI18n()  

  return (
    <Modal title={`Harvest ${tokenName} In`} onDismiss={onDismiss}>
      <ModelBody>
        <CountdownTimer seconds = {secondsToHarvest} />
        <Text fontSize="24px" bold color="textSubtle" textTransform="uppercase" mb="10px">
          {TranslateString(10004, 'Harvest Lockup')}: {harvestInterval/3600} hour(s)
        </Text>       
      </ModelBody>
      <ModalActions>
        <Button variant="secondary" onClick={onDismiss}>
          {TranslateString(10005, 'OK')}
        </Button>        
      </ModalActions>
    </Modal>
  )
}

export default HarvestCountdownModal
