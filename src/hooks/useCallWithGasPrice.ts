import { useCallback } from 'react'
import { Contract } from 'web3-eth-contract'
import ethers from 'ethers'
import { get } from 'lodash'

export function useCallWithGasPrice() {

  /**
   * Perform a contract call with a gas price returned from useGasPrice
   * @param contract Used to perform the call
   * @param methodName The name of the method called
   * @param methodArgs An array of arguments to pass to the method
   * @param overrides An overrides object to pass to the method. gasPrice passed in here will take priority over the price returned by useGasPrice
   * @returns https://docs.ethers.io/v5/api/providers/types/#providers-TransactionReceipt
   */
  const callWithGasPrice = useCallback(
    async (
      account: string,
      contract: Contract,
      methodName: string,
      methodArgs: any[] = [],
      gasPrice: any = null,
    ): Promise<any> => {
      
      const contractMethod = get(contract, ['methods', methodName])

      let result : any = {
        status: 'error',
        error: 'Unknown'
      }

      const callback = (err, transactionHash) => {
        if (err) {
          result = {
            status: 'error',
            error: err
          }
        }
        else {
          result = {
            status: 'success',
            transactionHash
          }
        }
      }

      const tx = gasPrice ? await contractMethod(...methodArgs).send({from: account, ...gasPrice}, callback) :
        await contractMethod(...methodArgs).send({ from: account }, callback)
      
      return result
    },
    [],
  )

  return { callWithGasPrice }
}
