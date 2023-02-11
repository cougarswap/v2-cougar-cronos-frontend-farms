import BigNumber from 'bignumber.js'
import { ethers } from 'ethers'
import Cookies from 'universal-cookie';

export const approve = async (lpContract, masterChefContract, account) => {
  return lpContract.methods
    .approve(masterChefContract.options.address, ethers.constants.MaxUint256)
    .send({ from: account })
}

export const partnerApprove = async (lpContract, masterChefContractAddress, account) => {
  return lpContract.methods
    .approve(masterChefContractAddress, ethers.constants.MaxUint256)
    .send({ from: account })
}

export const autoCakeApprove = async (lpContract, autoCakeAddress, account) => {
  return lpContract.methods
    .approve(autoCakeAddress, ethers.constants.MaxUint256)
    .send({ from: account })
}


export const stake = async (masterChefContract, pid, amount, account) => {
  const cookies = new Cookies();
  const ref = cookies.get('ref');  

  const referrerAddress = ref ?? account;  
  return masterChefContract.methods
    .deposit(pid, amount, referrerAddress)
    .send({ from: account })
    .on('transactionHash', (tx) => {
      return tx.transactionHash
  })
}

export const partnerStake = async (masterChefContract, pid, amount, account, referrer) => { 
  if (referrer) {
    return masterChefContract.methods
      .deposit(pid, amount, referrer)
      .send({ from: account })
      .on('transactionHash', (tx) => {
        return tx.transactionHash
    })
  }

  return masterChefContract.methods
    .deposit(pid, amount)
    .send({ from: account })
    .on('transactionHash', (tx) => {
      return tx.transactionHash
  })
}

export const sousStake = async (sousChefContract, amount, account) => {
  return sousChefContract.methods
    .deposit(amount)
    .send({ from: account })
    .on('transactionHash', (tx) => {
      return tx.transactionHash
    })
}

export const sousStakeBnb = async (sousChefContract, amount, account) => {
  return sousChefContract.methods
    .deposit()
    .send({ from: account, value: amount })
    .on('transactionHash', (tx) => {
      return tx.transactionHash
    })
}

export const autoCakeStake = async (autoCakeContract, amount, account) => { 
  return autoCakeContract.methods
    .deposit(amount)
    .send({ from: account })
    .on('transactionHash', (tx) => {
      return tx.transactionHash
  })
}

export const unstake = async (masterChefContract, pid, amount, account) => {
  return masterChefContract.methods
    .withdraw(pid, amount)
    .send({ from: account })
    .on('transactionHash', (tx) => {
      return tx.transactionHash
    })
}

export const partnerUnstake = async (masterChefContract, pid, amount, account) => {
  return masterChefContract.methods
    .withdraw(pid, amount)
    .send({ from: account })
    .on('transactionHash', (tx) => {
      return tx.transactionHash
    })
}

export const sousUnstake = async (sousChefContract, amount, account) => {  
  try {
    return sousChefContract.methods
      .withdraw(amount)
      .send({ from: account })
      .on('transactionHash', (tx) => {
        return tx.transactionHash
      })
  }
  catch (error) 
  {
    console.log('error', error)
    return false
  }
}

export const sousEmegencyUnstake = async (sousChefContract, amount, account) => {
  return sousChefContract.methods
    .emergencyWithdraw()
    .send({ from: account })
    .on('transactionHash', (tx) => {
      return tx.transactionHash
    })
}


export const autoCakeUnstake = async (autoCakeContract, amount, account) => { 
  return autoCakeContract.methods
    .withdraw(amount)
    .send({ from: account })
    .on('transactionHash', (tx) => {
      return tx.transactionHash
  })
}

export const autoCakeUnstakeAll = async (autoCakeContract, account) => { 
  return autoCakeContract.methods
    .withdrawAll()
    .send({ from: account })
    .on('transactionHash', (tx) => {
      return tx.transactionHash
  })
}

export const harvest = async (masterChefContract, pid, account) => {
  return masterChefContract.methods
    .deposit(pid, '0', account)
    .send({ from: account })
    .on('transactionHash', (tx) => {
      return tx.transactionHash
    })
}


export const partnerHarvest = async (masterChefContract, pid, account, referrer) => {
  if (referrer) {
    return masterChefContract.methods
      .deposit(pid, '0', referrer)
      .send({ from: account })
      .on('transactionHash', (tx) => {
        return tx.transactionHash
    })
  }

  return masterChefContract.methods
    .deposit(pid, '0')
    .send({ from: account })
    .on('transactionHash', (tx) => {
      return tx.transactionHash
    })
}


export const soushHarvest = async (sousChefContract, account) => {
  return sousChefContract.methods
    .deposit('0')
    .send({ from: account })
    .on('transactionHash', (tx) => {
      return tx.transactionHash
    })
}

export const soushHarvestBnb = async (sousChefContract, account) => {
  return sousChefContract.methods
    .deposit()
    .send({ from: account, value: new BigNumber(0) })
    .on('transactionHash', (tx) => {
      return tx.transactionHash
    })
}

export const vaultHarvest = async (vaultContract, pid, account) => {
  return vaultContract.methods
    .deposit(pid, '0')
    .send({ from: account })
    .on('transactionHash', (tx) => {
      return tx.transactionHash
    })
}

export const vaultApprove = async (lpContract, spenderAddress, account) => {
  return lpContract.methods
    .approve(spenderAddress, ethers.constants.MaxUint256)
    .send({ from: account })
}

export const vaultStake = async (vaultContract, pid, amount, account) => { 

  return vaultContract.methods
    .deposit(pid, amount)
    .send({ from: account })
    .on('transactionHash', (tx) => {
      return tx.transactionHash
  })
}


export const vaultUnstake = async (vaultContract, pid, amount, account) => { 
  return vaultContract.methods
    .withdraw(pid, amount)
    .send({ from: account })
    .on('transactionHash', (tx) => {
      return tx.transactionHash
  })
}