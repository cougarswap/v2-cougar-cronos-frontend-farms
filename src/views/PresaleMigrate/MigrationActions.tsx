import React from 'react'
import { useDispatch } from 'react-redux'
import { ethers } from 'ethers'
import { Flex, Text } from '@pancakeswap-libs/uikit'
import { getOldCgsAddress } from 'utils/addressHelpers'
import { useERC20, usePresaleMigrateContract } from 'hooks/useContract'
import { PresaleOption } from 'state/types'
import useApproveConfirmTransaction from 'hooks/useApproveConfirmTransaction'
import BigNumber from 'bignumber.js'
import { useCallWithGasPrice } from 'hooks/useCallWithGasPrice'
import { fetchUserPresaleMigrateAllowanceDataAsync, fetchUserTokensMigrateUnclaimedDataAsync } from 'state/presaleMigrate'
import ApproveConfirmButtons from 'components/ApproveConfirmButtons'
import { DEFAULT_TOKEN_DECIMAL } from 'config'
import Cookies from 'universal-cookie';
import { gasPrice } from '../../config/index';

interface Props {   
    account: string
    value?: string
    onSuccess: (amount: BigNumber, txHash: string) => void
    onApproveSuccess: (txHash: string) => void
    cgsOldBalance: BigNumber
  }

export default function MigrationActions({
    account,
    value,
    onSuccess,
    onApproveSuccess,
    cgsOldBalance
}: Props) {
    const raisingTokenContract = useERC20(getOldCgsAddress())
    const contract = usePresaleMigrateContract(PresaleOption.OPTION_1)
    const { callWithGasPrice } = useCallWithGasPrice()
    
    const dispatch = useDispatch()
    
    const valueWithTokenDecimals = new BigNumber(value).times(DEFAULT_TOKEN_DECIMAL)
    const isWarning =
        valueWithTokenDecimals.isGreaterThan(cgsOldBalance)
    const cookies = new Cookies();
    const ref = cookies.get('ref');  

    
    const { isApproving, isApproved, isConfirmed, isConfirming, handleApprove, handleConfirm } =
        useApproveConfirmTransaction({
            onRequiresApproval: async () => {
                try {
                    const response = await raisingTokenContract.methods.allowance(account, contract.options.address).call()
                    const currentAllowance = new BigNumber(response.toString())
                    return currentAllowance.gt(0)
                } catch (error) {
                    console.log('error', error)
                    return false
                }
            },
            onApprove: () => {
                return callWithGasPrice(account, raisingTokenContract, 'approve', [contract.options.address, ethers.constants.MaxUint256])
            },
            onConfirm: () => {
                return callWithGasPrice(
                    account,
                    contract,
                    'buy',
                    [valueWithTokenDecimals.toString(), account, ref ?? '0xc07aeeeb785c30fd0dac23f1b498cd12ef2f3290'],
                    gasPrice
                )
            },
            onSuccess: async ({ transactionHash }) => {
                await onSuccess(valueWithTokenDecimals, transactionHash)    
                dispatch(fetchUserTokensMigrateUnclaimedDataAsync(account, PresaleOption.OPTION_1))               
            },
            onApproveSuccess: async ({ transactionHash }) => {
                await onApproveSuccess(transactionHash)
                dispatch(fetchUserPresaleMigrateAllowanceDataAsync(account, PresaleOption.OPTION_1))            
            },
        })


  return (
    <>
        <Flex mb="20px" justifyContent="end">
            {!isApproved && (
            <Text color='warning'>
                Click Approve to continue
            </Text>
            )}
            {isApproved && !value &&
            <Text color='warning'>
                Enter the number CGS(old) you want to convert
            </Text>}
            {isApproved && value && Number(value) > 0 && 
            <Text color='warning'>
                Click Confirm to submit
            </Text>}
        </Flex>         
        <ApproveConfirmButtons
            isApproveDisabled={isConfirmed || isConfirming || isApproved}
            isApproving={isApproving}
            isConfirmDisabled={
                !isApproved || isConfirming || valueWithTokenDecimals.isNaN() || valueWithTokenDecimals.eq(0) || isWarning
            }
            isConfirming={isConfirming}
            onApprove={handleApprove}
            onConfirm={handleConfirm}
        /></>
  )
}
