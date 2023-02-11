import React, { useState } from 'react'
import { AutoRenewIcon, Button, Flex } from '@pancakeswap-libs/uikit'
import { PresaleOption } from 'state/types'
import useClaimPresale from '../hooks/useClaimPresale'



interface ClaimActionProps {
  isClaimActive?: boolean
  option?: PresaleOption
  percentToClaim?: number
}

const ClaimAction: React.FC<ClaimActionProps> = ({isClaimActive, option, percentToClaim}) => {
  const { onClaim } = useClaimPresale(option)
  const [pendingTx, setPendingTx] = useState(false)

  const handleClaim = async () => {
    setPendingTx(true)
    await onClaim()
    setPendingTx(false)
  }

  return (
    <Button mt="8px" 
      fullWidth 
      isLoading={pendingTx}
      endIcon={pendingTx ? <AutoRenewIcon spin color="currentColor" /> : null}                        
      disabled={!isClaimActive || pendingTx || !percentToClaim || percentToClaim === 0} 
      onClick={async () => {
        setPendingTx(true)
        await onClaim()
        setPendingTx(false)
      }}
      >Claim Tokens</Button>
  )
}

export default ClaimAction