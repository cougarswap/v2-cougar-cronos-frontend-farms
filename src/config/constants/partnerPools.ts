import { trimEnd } from "lodash";
import { DexSwapRouter, PartnerPoolConfig, LinkPartnerPoolConfig, PoolCategory, StartType } from "./types";

const partnerPools : PartnerPoolConfig[] = [
    // {
    //     partnerId: 1,
    //     masterchefAddress: '0xc6ca172fc8bdb803c5e12731109744fb0200587b',
    //     poolId: 12,
    //     stakingToken: {
    //         isTokenOnly: false,
    //         token: {
    //             symbol: 'CGS-USDC',
    //             address: '0xd4d0622ac66786d1bdf3fee0a36810e64148809c',
    //             decimals: 18
    //         },
    //         token0: {
    //             symbol: 'CGS',
    //             address: '0xeb50C308177Df06685112b3f56E66761578eA9Bd',
    //             decimals: 18
    //         },
    //         token1: {
    //             symbol: 'USDC',
    //             address: '0x818ec0A7Fe18Ff94269904fCED6AE3DaE6d6dC0b',
    //             decimals: 6
    //         }
    //     },
    //     earningToken: {
    //         symbol: 'GLINT',
    //         address: '0xcd3b51d98478d53f4515a306be565c6eebef1d58',
    //         decimals: 18
    //     },
    //     pendingFunction: 'pendingTokens',
    //     tokenPerBlockFunction: 'beamPerSec',
    //     startType: StartType.TIMESTAMP,
    //     startFunction: 'startTimestamp',
    //     poolCategory: PoolCategory.PARTNER,
    //     referrer: '',
    //     projectLink: 'https://beamswap.io/',
    //     isNewPool: false,
    //     isHardCodeFinished: true,
    //     dex: DexSwapRouter.BEAM
    // },   
    // {
    //     partnerId: 8,
    //     masterchefAddress: '0x13Bbdf2434461ab9566498AA8028a162757Ab42B',
    //     poolId: 39,
    //     stakingToken: {
    //         isTokenOnly: true,
    //         token: {
    //             symbol: 'CGS',
    //             address: '0x5a2e451fb1b46fde7718315661013ae1ae68e28c',
    //             decimals: 18
    //         },            
    //     },
    //     earningToken: {
    //         symbol: 'TREAT',
    //         address: '0x484f2ff94a7790759D56Fb1eFbAce8075aBA5e06',
    //         decimals: 18
    //     },
    //     pendingFunction: 'pendingTreat',
    //     tokenPerBlockFunction: 'treatPerSecond',
    //     startType: StartType.TIMESTAMP,
    //     startFunction: 'startTime',
    //     poolCategory: PoolCategory.PARTNER,
    //     referrer: '',
    //     projectLink: 'https://trickortreat.farm/',
    //     isNewPool: true,
    // },
    // {
    //     partnerId: 1,
    //     masterchefAddress: '0x5A9710f3f23053573301C2aB5024D0a43A461E80',
    //     poolId: 60,
    //     stakingToken: {
    //         isTokenOnly: false,
    //         token: {
    //             symbol: 'WAVAX-CGS',
    //             address: '0x32557cc7b86531c9e3dfd11e2f4667762fd92e39',
    //             decimals: 18
    //         },
    //         token0: {
    //             symbol: 'WAVAX',
    //             address: '0xb31f66aa3c1e785363f0875a1b74e27b85fd66c7',
    //             decimals: 18
    //         },
    //         token1: {
    //             symbol: 'CGS',
    //             address: '0x727c43b707c6fe3acd92f17efac8e05476dfa81c',
    //             decimals: 18
    //         }
    //     },
    //     earningToken: {
    //         symbol: 'OLIVE',
    //         address: '0x617724974218A18769020A70162165A539c07E8a',
    //         decimals: 18
    //     },
    //     pendingFunction: 'pendingOlive',
    //     tokenPerBlockFunction: 'olivePerBlock',
    //     startType: StartType.BLOCK,
    //     startFunction: 'startBlock',
    //     poolCategory: PoolCategory.PARTNER,
    //     referrer: '',
    //     projectLink: 'https://avax.olive.cash/',
    //     isNewPool: true,
    //     dex: DexSwapRouter.TRADERJOE
    // },   
    // {
    //     partnerId: 2,
    //     masterchefAddress: '0x9F887f888028c3982445D2DdF3300cd2e9787beB',
    //     poolId: 17,
    //     stakingToken: {
    //         isTokenOnly: true,
    //         token: {
    //             symbol: 'CGS',
    //             address: '0x727c43b707c6fe3acd92f17efac8e05476dfa81c',
    //             decimals: 18
    //         },            
    //     },
    //     earningToken: {
    //         symbol: 'MERD',
    //         address: '0xF54Cd11595aeC3B99d274318446060E24b0d2D33',
    //         decimals: 18
    //     },
    //     pendingFunction: 'pendingMerd',
    //     tokenPerBlockFunction: 'merdPerBlock',
    //     startType: StartType.BLOCK,
    //     startFunction: 'startBlock',
    //     poolCategory: PoolCategory.PARTNER,
    //     referrer: '0000000000000000000000000000000000000000',
    //     projectLink: 'https://avalanche.mermaidswap.com/',
    //     isNewPool: true,
    //     dex: DexSwapRouter.PANGOLIN
    // }, 


    // {
    //     partnerId: 2,
    //     masterchefAddress: '0x7c36c64811219cf9b797c5d9b264d9e7cdade7a4',
    //     poolId: 26,
    //     stakingToken: {
    //         isTokenOnly: false,
    //         token: {
    //             symbol: 'WFTM-CGS',
    //             address: '0x2b5965F901f8817DA4D660c64051bA8ADCdc495E',
    //             decimals: 18
    //         },
    //         token0: {
    //             symbol: 'WFTM',
    //             address: '0x21be370d5312f44cb42ce377bc9b8a0cef1a4c83',
    //             decimals: 18
    //         },
    //         token1: {
    //             symbol: 'CGS',
    //             address: '0x5a2e451fb1b46fde7718315661013ae1ae68e28c',
    //             decimals: 18
    //         }
    //     },
    //     earningToken: {
    //         symbol: 'DMD',
    //         address: '0x90e892fed501ae00596448aecf998c88816e5c0f',
    //         decimals: 18
    //     },
    //     pendingFunction: 'pendingDMD',
    //     tokenPerBlockFunction: 'DMDPerSecond',
    //     startType: StartType.TIMESTAMP,
    //     startFunction: 'startTime',
    //     poolCategory: PoolCategory.PARTNER,
    //     referrer: '',
    //     projectLink: 'https://www.darkmatterdefi.com/',
    //     isNewPool: true
    // },    
    // {
    //     partnerId: 3,
    //     masterchefAddress: '0x5A3b5A572789B87755Fa7720A4Fae36e2e2D3b35',
    //     poolId: 17,
    //     stakingToken: {
    //         isTokenOnly: true,
    //         token: {
    //             symbol: 'CGS',
    //             address: '0x5a2e451fb1b46fde7718315661013ae1ae68e28c',
    //             decimals: 18
    //         },            
    //     },
    //     earningToken: {
    //         symbol: 'SAPPHIRE',
    //         address: '0xfa7d8c3CccC90c07c53feE45A7a333CEC40B441B',
    //         decimals: 18
    //     },
    //     pendingFunction: 'pendingSapphire',
    //     tokenPerBlockFunction: 'fSapphirePerBlock',
    //     startType: StartType.BLOCK,
    //     startFunction: 'startBlock',
    //     poolCategory: PoolCategory.PARTNER,
    //     referrer: '',
    //     projectLink: 'https://sapphiredefi.com/',
    //     isNewPool: true,
    // },
    // {
    //     partnerId: 4,
    //     masterchefAddress: '0xD1b96929AceDFa7a2920b5409D0c5636b89dcD85',
    //     poolId: 20,
    //     stakingToken: {
    //         isTokenOnly: true,
    //         token: {
    //             symbol: 'CGS',
    //             address: '0x5a2e451fb1b46fde7718315661013ae1ae68e28c',
    //             decimals: 18
    //         },            
    //     },
    //     earningToken: {
    //         symbol: 'WAR',
    //         address: '0xB063862a72d234730654c0577C188452424CF53c',
    //         decimals: 18
    //     },
    //     pendingFunction: 'pendingSapphire',
    //     tokenPerBlockFunction: 'fSapphirePerBlock',
    //     startType: StartType.BLOCK,
    //     startFunction: 'startBlock',
    //     poolCategory: PoolCategory.PARTNER,
    //     referrer: '',
    //     projectLink: 'https://war.sapphiredefi.com/',
    //     isNewPool: true,
    // },
    // {
    //     partnerId: 5,
    //     masterchefAddress: '0xbcef0849ddd928835a6aa130ae527c2703cd832c',
    //     poolId: 27,
    //     stakingToken: {
    //         isTokenOnly: true,
    //         token: {
    //             symbol: 'CGS',
    //             address: '0x5a2e451fb1b46fde7718315661013ae1ae68e28c',
    //             decimals: 18
    //         },            
    //     },
    //     earningToken: {
    //         symbol: 'SCARE',
    //         address: '0x46e1ee17f51c52661d04238f1700c547de3b84a1',
    //         decimals: 18
    //     },
    //     pendingFunction: 'pendingScare',
    //     tokenPerBlockFunction: 'scarePerBlock',
    //     startType: StartType.BLOCK,
    //     startFunction: 'startBlock',
    //     poolCategory: PoolCategory.PARTNER,
    //     referrer: '',
    //     projectLink: 'https://app.scarecrow.fi/',
    //     isNewPool: true,
    // },
    // {
    //     partnerId: 6,
    //     masterchefAddress: '0xb9ac3a4c1b76b38fb7a374b4d0e4809d08ef092e',
    //     poolId: 28,
    //     stakingToken: {
    //         isTokenOnly: true,
    //         token: {
    //             symbol: 'CGS',
    //             address: '0x5a2e451fb1b46fde7718315661013ae1ae68e28c',
    //             decimals: 18
    //         },            
    //     },
    //     earningToken: {
    //         symbol: 'MAX',
    //         address: '0x287a3f943db1c053c3e79d2f211ffe5c795b978b',
    //         decimals: 18
    //     },
    //     pendingFunction: 'pendingMax',
    //     tokenPerBlockFunction: 'MaxPerBlock',
    //     startType: StartType.BLOCK,
    //     startFunction: 'startBlock',
    //     poolCategory: PoolCategory.PARTNER,
    //     referrer: '',
    //     projectLink: 'https://maximum.farm/',
    //     isNewPool: true,
    // },
]

export const linkPartnerPools: LinkPartnerPoolConfig[] = [
    // {
    //     partnerId: 7,
    //     projectLink: 'https://ftm.paprprintr.finance/pools',
    //     contractAddress: '0x0ecc0c10283033ef28162fec8ccc44d6dc03b68c',
    //     stakingToken: {
    //         isTokenOnly: false,
    //         token: {
    //             symbol: 'PRNTR-CGS',
    //             address: '0xbcd61d876f541f9572972860ea8e447922b47ccb',
    //             decimals: 18
    //         },
    //         token0: {
    //             symbol: 'PRNTR',
    //             address: '0xeff11197247ac09e0239ec9f83f7de13c186caa6',
    //             decimals: 18
    //         },
    //         token1: {
    //             symbol: 'CGS',
    //             address: '0x5a2e451fb1b46fde7718315661013ae1ae68e28c',
    //             decimals: 18
    //         }
    //     },
    //     earningToken: {
    //         symbol: 'PRNTR',
    //         address: '0xeff11197247ac09e0239ec9f83f7de13c186caa6',
    //         decimals: 18
    //     },
    //     isNewPool: true,
    //     dex: DexSwapRouter.SPOOKY
    // }
]

export default partnerPools