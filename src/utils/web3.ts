import Web3 from 'web3'
import { HttpProviderOptions } from 'web3-core-helpers'
import getRpcUrl from 'utils/getRpcUrl'

const RPC_URL = getRpcUrl()
const httpProvider = new Web3.providers.HttpProvider(RPC_URL, { timeout: 10000 } as HttpProviderOptions)
/**
 * Provides a web3 instance using our own private provider httpProver
 */

const web3NoAccount = new Web3(httpProvider)

const getWeb3 = () => {
  return web3NoAccount
}

export { getWeb3, httpProvider }
export default web3NoAccount
