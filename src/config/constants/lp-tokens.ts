import token from './farm-tokens'

export default {
    pairs: {     
        cgsMatic: {
            pid: 1,
            address: token.cgsMatic
        },   
        cgsUsdc: {
            pid: 2,
            address: token.cgsUsdc
        },   
        wMaticUsdc: {
            pid: 3,
            address: token.wMaticUsdc
        },   
        usdcUsdt: {
            pid: 4,
            address: token.usdcUsdt
        },   
        usdcMai: {
            pid: 5,
            address: token.usdcMai
        },
                 
    },
    single: {
        cgs: {
            pid: 0,
        },
        wmatic: {
            pid: 6,
        },
        wbtc: {
            pid: 7,
        },
        weth: {
            pid: 8,
        },
        sand: {
            pid: 9,
        },
        
    }    
}