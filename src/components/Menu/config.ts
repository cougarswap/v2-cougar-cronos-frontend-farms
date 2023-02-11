import { MenuEntry } from '@pancakeswap-libs/uikit'

const config: MenuEntry[] = [
  {
    label: 'Home',
    icon: 'HomeIcon',
    href: '/',
  },
  {
    label: 'Legacy (v1)',
    icon: 'JungleIcon',
    href: 'https://legacy-polyapp.cougarswap.io/',
    calloutClass: 'highlight' 
  },
  {
    label: 'Trade',
    icon: 'TradeIcon',
    items: [
      {
        label: 'Exchange',
        href: 'https://polydex.cougarswap.io/#/swap'
      },  
      {
        label: 'Liquidity',
        href: 'https://polydex.cougarswap.io/#/pool'
      },
       {
        label: 'Buy CGS',
        href: 'https://polygondex.cougarswap.io/#/swap?outputCurrency=0x0b265919F1B9285FE283010A874b2BEae32D731E'
      },     
    ],
  },
  // {
  //   label: 'Presale (Ended)',
  //   icon: 'Titanic2Icon', 
  //   href: '/presale'   
  // },  
  {
    label: 'Migration (Start)',
    icon: 'Titanic2Icon', 
    href: '/swap-migrate'   
  },
  {
    label: 'Farms',
    icon: 'FarmIcon',
    href: '/farms',
  },
  {
    label: 'Pools',
    icon: 'Pool2Icon',
    href: '/nests',
  },    
  {
    label: 'Vaults',
    icon: 'PoolIcon',
    href: '/vaults',
  },   
  {
    label: 'CBank', 
    icon: 'IfoIcon',         
    href: '/cbank'  
  },      
  {
    label: 'Referral',
    icon: 'Groups2Icon', 
    href: '/referrals'   
  },  
  {
    label: 'Future',
    icon: 'FaucetIcon',
    items: [
      {
        label: 'Launch Pad (soon)',          
        href: '#launchPad'
      }, 
      {
        label: 'CVaults (soon)',        
        href: '#cvaults' 
      },        
    ]
  },
  {
    label: 'Bridge',
    icon: 'BridgeIcon',    
    items: [
      {
        label: 'MultiChain Bridge',
        href: 'https://multichain.xyz/'
      },
      {
        label: 'EvoDefi Bridge',
        href: 'https://bridge.evodefi.com/'
      },
      {
        label: 'Anyswap',
        href: 'https://anyswap.exchange/#/bridge'
      },
      {
        label: 'CougarBridge',
        href: 'https://bridge.cougarswap.io/'
      },
    ]
  },    
  {
    label: 'Audit',
    icon: 'Audit2Icon',
    href: 'https://cougarecosystem.gitbook.io/polycougarswap/security/audits-and-reviews'
  },   
  // {
  //   label: 'Highlight Features',
  //   icon: 'SunIcon',    
  //   href: 'https://cougarecosystem.gitbook.io/polycougarswap/feature/highlight-features' 
  // }, 
  // {
  //   label: 'Chart',
  //   icon: 'AnalyticsIcon',    
  //   href: '/chart'
  // },  
  // {
  //   label: 'Graph',
  //   icon: 'InfoIcon',    
  //   items: [         
  //     {
  //       label: 'DexScreener',
  //       href: 'https://dexscreener.com/moonbeam/0x0b265919F1B9285FE283010A874b2BEae32D731E',
  //     }    
  //   ]
  // },     
  {
    label: 'Listings',
    icon: 'HamburgerIcon',
    items: [     
      {
        label: 'CoinMarketCap',
        href: 'https://coinmarketcap.com/currencies/cougar/',
      },
      {
        label: 'CoinGecko',
        href: 'https://www.coingecko.com/en/coins/cougar-token',
      },
      {
        label: 'DappRadar',
        href: 'https://dappradar.com/polygon/defi/polycougar',
      },
      {
        label: 'Defi Llama',
        href: 'https://defillama.com/protocol/cougarswap',
      },
    ],
  },  
  {
    label: 'More',
    icon: 'MoreIcon',
    items: [     
      {
        label: "Docs",
        href: "https://cougarecosystem.gitbook.io/polycougarswap/",
      },  
      {
        label: 'Presale Infomation',
        href: 'https://cougarecosystem.gitbook.io/polycougarswap/presale-information'
      },
      {
        label: 'Roadmap',        
        href: 'https://cougarecosystem.gitbook.io/polycougarswap/roadmap',
      },   
      {
        label: 'Tokenomics',        
        href: 'https://cougarecosystem.gitbook.io/polycougarswap/tokenomic/cougar-tokenomic',
      },        
    ],
  },  
]

export default config
