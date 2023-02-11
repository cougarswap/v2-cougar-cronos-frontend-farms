import { Button, Flex, Image, Modal, Text } from '@pancakeswap-libs/uikit'
import React, { useEffect } from 'react'
import styled from 'styled-components'
import { delay } from 'lodash'
import confetti from 'canvas-confetti'
import PresaleStyledCard from 'components/layout/PresaleCard'

const Container = styled(PresaleStyledCard)`    
    padding: 20px;
`

const Body = styled(Flex)`
    flex-direction: column;
    justify-content: center;
    align-items: center;
`

const Footer = styled(Flex)`
    flex-direction: column;
    justify-content: center;
    align-items: center;
`

const TextInfo = styled(Text)`
    text-transform: uppercase;
    text-align: center;
    font-size: 1.4em;
    color: ${({theme}) => theme.colors.primaryBright};
`

const TextCapMet = styled(Text)`
    text-transform: uppercase;
    text-align: center;
    font-size: 1.6em;
    color: #ffeb3b;
`

const showConfetti = () => {
    confetti({
      resize: true,
      particleCount: 200,
      startVelocity: 30,
      gravity: 0.5,
      spread: 350,
      origin: {
        x: 0.5,
        y: 0.3,
      },
    })
  }
  

interface PresaleEndCelebrationModalProps {
    onDismiss?: () => void
    isHardCapMet?: boolean
}

const PresaleEndCelebrationModal : React.FC<PresaleEndCelebrationModalProps> = ({
    isHardCapMet,
    onDismiss
}) => {
    
    useEffect(() => {
        delay(() => showConfetti(), 100)
    }, [])

    return (
        <Modal title='From Cougar Team' onDismiss={onDismiss}>
            <Container>
                <Body>
                    <Image src="/images/egg/logo.png" width={100} height={100} />
                    <TextInfo>
                        The presale is ended<br />                       
                    </TextInfo>
                    {isHardCapMet ? <TextCapMet>                        
                        100% hardcap met
                    </TextCapMet> : null }
                    <Text style={{textAlign: 'center'}} mt="10px">
                        Thank you for participating and supporting our project. Enjoy farming!
                    </Text>
                </Body>
                <Footer mt="20px">
                    <Button onClick={onDismiss}>OK</Button>
                </Footer>
            </Container>
        </Modal>        
    )
}

export default PresaleEndCelebrationModal