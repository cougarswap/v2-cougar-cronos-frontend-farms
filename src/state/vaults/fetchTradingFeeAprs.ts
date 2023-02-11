const fetchTradingFeeApr = async () => {
    try {
        const response = await fetch('https://capi.cougarswap.io/api/apy/fantom', {
            method: 'GET'
        })

        const fantomTradingFeeApr = response.json()
        return fantomTradingFeeApr
    }
    catch (e) {
        console.log('error', e)
        return {}
    }
}

export default fetchTradingFeeApr