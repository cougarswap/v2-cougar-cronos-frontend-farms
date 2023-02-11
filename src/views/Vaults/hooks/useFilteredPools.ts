import BigNumber from "bignumber.js";
import { StakePlatform, VaultStatus } from "config/constants/types";
import { stableCoins } from 'config'
import { Vault } from "state/types";
import { VaultFilter } from "./useFilters";

const useFilteredPools = (vaults: Vault[], vaultFilter: VaultFilter) => {
    let filteredPools = [...vaults]

    if (vaultFilter.hideZeroBalances) {
        filteredPools = filteredPools.filter(_ => _.userData && new BigNumber(_.userData.tokenBalance).gt(0))
    }

    if (vaultFilter.retiredVaults) {
        filteredPools = filteredPools.filter(_ => _.status === VaultStatus.STOPPED)
    }

    if (vaultFilter.depositedVaults) {
        filteredPools = filteredPools.filter(_ => _.userData && new BigNumber(_.userData.stakedBalance).gt(0))
    }

    if (vaultFilter.manual) {
        filteredPools = filteredPools.filter(_ => _.isManualCgs)
    }

    if (vaultFilter.boost) {
        filteredPools = filteredPools.filter(_ => _.isBoosted)
    }

    if (vaultFilter.platform !== 'all') {
        filteredPools = filteredPools.filter(_ => _.stakePlatform === vaultFilter.platform )
    }

    if (vaultFilter.vaultType !== 'all') {
        if (vaultFilter.vaultType === 'single') {
            filteredPools = filteredPools.filter(_ => _.stakingToken.isTokenOnly)
        }
        else if (vaultFilter.vaultType === 'lp') {
            filteredPools = filteredPools.filter(_ => !_.stakingToken.isTokenOnly)
        }
        else {
            filteredPools = filteredPools.filter(pool => {
                const findIndex = stableCoins.findIndex(stableCoin => pool.stakingToken.token.symbol.includes(stableCoin))
                return findIndex > -1
            })
        }
    }

    if (vaultFilter.asset !== 'all') {        
        filteredPools = filteredPools.filter(pool => {
            if (pool.stakingToken.isTokenOnly) {
                return pool.stakingToken.token.symbol.toLowerCase() === vaultFilter.asset.toLowerCase()
            }

            return pool.stakingToken.token0.symbol.toLowerCase() === vaultFilter.asset.toLowerCase() ||
                pool.stakingToken.token1.symbol.toLowerCase() === vaultFilter.asset.toLowerCase()
        })
    }

    if (vaultFilter.fee !== 'all') {        
        filteredPools = filteredPools.filter(pool => {
            if (vaultFilter.fee === 'hasfee') {
                return pool.depositFee > 0.1
            }

            return pool.depositFee <= 0.1
        })
    }


    return filteredPools
}

export default useFilteredPools