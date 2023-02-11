import { useEffect, useState } from "react"

const VAULT_FILTER_KEY = 'fantomVaultFilter'
export interface VaultFilter {
    showFilter?: boolean
    hideZeroBalances?: boolean
    retiredVaults?: boolean
    depositedVaults?: boolean
    boost?: boolean
    manual?: boolean
    platform?: string
    vaultType?: string
    asset?: string
    sortBy?: string
    fee?: string
}


const useFilters = () => {
    const initFilterData : VaultFilter = {
        showFilter: true,
        hideZeroBalances: false,
        retiredVaults: false,
        depositedVaults: false,
        manual: false,        
        boost: false,
        platform: 'all', 
        vaultType: 'all', 
        asset: 'all', 
        sortBy: 'default',
        fee: 'all'
    }

    const [vaultFilter, setVaultFilter] = useState(initFilterData)

    useEffect(() => {
        const storedFilter = localStorage.getItem(VAULT_FILTER_KEY)

        if (storedFilter) {
            setVaultFilter(JSON.parse(storedFilter))
        }
    }, [setVaultFilter])

    const updateFilter = (key, value) => {
        const newFilters = { ...vaultFilter };
        newFilters[key] = value ?? !vaultFilter[key];

        setVaultFilter(newFilters)
        
        if (localStorage) {
            try {
              localStorage.setItem(VAULT_FILTER_KEY, JSON.stringify(newFilters));
            } catch (e) {
                console.log(e)
            }
        }
    }

    const clearFilter = () => {
        setVaultFilter(initFilterData)

        if (localStorage) {
            try {
              localStorage.setItem(VAULT_FILTER_KEY, JSON.stringify(initFilterData));
            } catch (e) {
                console.log(e)
            }
        }
    }

    return { vaultFilter, updateFilter, clearFilter}
}

export default useFilters