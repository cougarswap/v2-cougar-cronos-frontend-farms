import { useSelector } from "react-redux";
import { State } from "state/types";
import { getCakeAddress, getWbnbAddress } from "utils/addressHelpers";

export const usePrices = () => {
    let nativePrices = useSelector((state: State) => state.prices.data);

    nativePrices = [
        { symbol: 'CGS', address: getCakeAddress(), price: useSelector((state: State) => state.prices.tokenPrice)},
        { symbol: 'WMATIC', address: getWbnbAddress(), price: useSelector((state: State) => state.prices.platformPrice)},
        ...nativePrices,
    ]

    return nativePrices.reduce((prices, tokenPrice) => {
        if (!prices[tokenPrice.address.toLowerCase()]) {
            prices[tokenPrice.address.toLowerCase()] = tokenPrice.price
        }
        return prices
    }, {})
};
  
export const useTokenPrice = (address: string) => {
    const nativePrices = useSelector((state: State) => state.prices.data);
    const token = nativePrices.find(_ => _.address.toLowerCase() === address.toLowerCase())

    return token ? token.price : 0
}

export const useCgsPrice = () => {
    const tokenPrice = useSelector((state: State) => state.prices.tokenPrice);

    return tokenPrice
}

export const usePlatformPrice = () => {
    const tokenPrice = useSelector((state: State) => state.prices.platformPrice);

    return tokenPrice
}
