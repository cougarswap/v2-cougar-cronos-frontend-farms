import BigNumber from "bignumber.js";
import { useVaults } from "state/hooks";
import { usePrices } from "state/prices/hooks";
import { BIG_ZERO } from "utils/bigNumber";
import { getBalanceNumber } from "utils/formatBalance";

const useTotalTvl = () => {
    const vaults = useVaults();
    const prices = usePrices();

    const totalTvl = vaults.reduce((total, vault) => {
        let lpWorth = 0

        if (prices[vault.stakingToken.token.address.toLowerCase()]) {
            lpWorth = prices[vault.stakingToken.token.address.toLowerCase()]
        }      

        const poolTvl = getBalanceNumber(new BigNumber(vault.totalStaked).times(lpWorth), vault.stakingToken.token.decimals)    

        return poolTvl ? total.plus(poolTvl) : total

    }, BIG_ZERO)

    return totalTvl
}

export default useTotalTvl