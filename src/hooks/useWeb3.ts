import { useEffect, useState, useRef, useMemo } from 'react'
import Web3 from 'web3'
import { useWeb3React } from '@web3-react/core'
import web3NoAccount, { getWeb3, httpProvider } from 'utils/web3'

/**
 * Provides a web3 instance using the provider provided by useWallet
 * with a fallback of an httpProver
 * Recreate web3 instance only if the ethereum provider change
 */
const useWeb3 = () => {
  const { library } = useWeb3React()
  const refEth = useRef(library)  

  const [provider, setProvider] = useState(library || web3NoAccount)
  
  useEffect(() => {
    if (library !== refEth.current) {
      setProvider(library || web3NoAccount)
      refEth.current = library
    }
  }, [library])
  
  return provider
}

export default useWeb3
