import React from 'react'
import styled, { keyframes }  from 'styled-components'
import CountdownIcon from './CountdownIcon'

export interface ShowHarvestLockupCountdownButtonProps {
  onClick?: () => void  
}

const TikTac = keyframes`
    0% {
        transform: scale3d(1, 1, 1);
    }
    0%, 20% {
        transform: scale3d(0.9, 0.9, 0.9) rotate3d(0, 0, 1, -3deg);
    }
    0%, 50%, 70%, 90% {
        transform: scale3d(1.1, 1.1, 1.1) rotate3d(0, 0, 1, 3deg);
    }
    40%, 60%, 80% {
        transform: scale3d(1.1, 1.1, 1.1) rotate3d(0, 0, 1, -3deg);
    }
    100% {
        transform: scale3d(1, 1, 1);
    }
`

const Wrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  position: absolute; 
  right: 0; 
  top: -35px;

  svg {
    fill: ${({ theme }) => theme.colors.primary};
  }

  animation: 5s ease-in-out 0s infinite normal none running ${TikTac};
  transform: translate3d(0px, 0px, 0px);
`

const ShowHarvestLockupCountdownButton: React.FC<ShowHarvestLockupCountdownButtonProps> = ({ onClick }) => {
  return (
    <Wrapper aria-label="View countdown for harvest lockup" role="button" onClick={() => onClick()}>      
      <CountdownIcon />
    </Wrapper>
  )
}


export default ShowHarvestLockupCountdownButton
