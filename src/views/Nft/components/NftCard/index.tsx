import React, { useState, useContext, useCallback } from 'react'
import styled from 'styled-components'
import {
  Card,
  CardBody,
  Heading,
  Tag,
  Button,
  ChevronUpIcon,
  ChevronDownIcon,
  Text,
  CardFooter,
  Image
} from '@pancakeswap-libs/uikit'
import useI18n from 'hooks/useI18n'
import { Nft } from 'config/constants/types'
import InfoRow from '../InfoRow'
import NftImage from '../Image'
import { NftProviderContext } from '../../contexts/NftProvider'

interface NftCardProps {
  nft: Nft
}

const NCard = styled.div`  
  background: ${(props) => props.theme.card.background};  
  box-shadow: 0px 2px 12px -8px rgba(25, 19, 38, 0.1), 0px 1px 1px rgba(25, 19, 38, 0.05);
  color: ${(props) => props.theme.colors.text}; ;
  overflow: hidden;
  position: relative;  

`

const NCardBody = styled(CardBody)`
  padding: 12px;
  display: flex;
  justify-content: space-between;
`

const Header = styled(InfoRow)`
  min-height: 28px;
`

const PriceTag = styled.div`
  align-self: center;
  display: flex;
  flex-direction: row;
  align-items: center;
`

const PriceImage = styled(Image)`
  width: 12px;
`

const NftCard: React.FC<NftCardProps> = ({ nft }) => {
  const [state, setState] = useState({
    isLoading: false,
    isOpen: false,
    bunnyCount: 0,
    bunnyBurnCount: 0,
  })
  const TranslateString = useI18n()
  const {    
    getTokenIds,
  } = useContext(NftProviderContext)
  const { bunnyId, name, previewImage, originalImage, description, price } = nft
  const tokenIds = getTokenIds(bunnyId)
  const walletOwnsNft = tokenIds && tokenIds.length > 0
  

  return (
    <NCard>
      <NftImage src={`/images/nfts/${previewImage}`} alt={name} originalLink={walletOwnsNft ? originalImage : null} />
      <NCardBody>
        <Header>
          <Heading>{name}</Heading>
        </Header>  
        <PriceTag>
          <span>{price}&nbsp;</span>
          <PriceImage src='/images/egg/logo.png' width={12} height={12} alt="Egg" />
        </PriceTag>
      </NCardBody>      
    </NCard>
  )
}

export default NftCard
