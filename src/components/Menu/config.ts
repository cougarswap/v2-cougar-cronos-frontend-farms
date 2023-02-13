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
    href: 'https://cronosapp.cougarswap.io/',
    calloutClass: 'highlight' 
  },
  {
    label: 'Products',
    icon: 'GroupsIcon',
    items: [
      {
        label: 'Cougar Exchange',
        href: 'https://cgx.finance/',
      },
      {
        label: 'Cougar Optimizer',
        href: 'https://cgo.finance/',
      }
    ]
  },
  {
    label: 'Trade',
    icon: 'TradeIcon',
    items: [
      {
        label: 'Exchange',
        href: 'https://cronosdex.cougarswap.io/#/swap'
      },  
      {
        label: 'Exchange v2 (New)',
        href: 'https://cronosdex.cougarswap.io/#/swapv2'
      },  
      {
        label: 'Liquidity',
        href: 'https://cronosdex.cougarswap.io/#/pool'
      },  
       {
        label: 'Buy CGS',
        href: 'https://cronosdex.cougarswap.io/#/swap?outputCurrency=0x626779bA9809E9a74cea38bdaE641De5A866Dc59'
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
  // {
  //   label: 'CBank', 
  //   icon: 'IfoIcon',         
  //   href: '/cbank'  
  // },      
  {
    label: 'Referral',
    icon: 'Groups2Icon', 
    href: '/referrals'   
  },    
  // {
  //   label: 'Bridge',
  //   icon: 'BridgeIcon',    
  //   items: [
  //     {
  //       label: 'Cougar Bridge',
  //       href: 'https://bridge.cougarswap.io'
  //     }, 
  //     {
  //       label: 'Any Swap',
  //       href: 'https://anyswap.exchange/#/router'
  //     },     
  //     {
  //       label: 'EVOdefi Bridge',
  //       href: 'https://bridge.evodefi.com'
  //     },     
  //     {
  //       label: 'Cronos Bridge',
  //       href: 'https://cronos.crypto.org/docs/bridge/cdcex.html'
  //     }        
  //   ]
  // },    
  // {
  //   label: 'Audit',
  //   icon: 'Audit2Icon',
  //   href: 'https://cougarswap.gitbook.io/cronoscougarswap/security/audits-and-reviews'
  // },    
  {
    label: 'Graphs',
    icon: 'ChartIcon',
    href: 'https://dexscreener.com/cronos/0x626779bA9809E9a74cea38bdaE641De5A866Dc59'
  },
  // {
  //   label: 'Listings',
  //   icon: 'HamburgerIcon',
  //   items: [     
  //     {
  //       label: 'CoinMarketCap',
  //       href: 'https://coinmarketcap.com/currencies/cougar/',
  //     },     
  //     {
  //       label: 'Cronos Explorer',
  //       href: 'https://cronoscan.com/address/0x626779bA9809E9a74cea38bdaE641De5A866Dc59/transactions',
  //     },
  //     {
  //       label: 'Defi Llama',
  //       href: 'https://defillama.com/protocol/cougarswap',
  //     },
  //   ],
  // }, 
  {
    label: 'Partner Application Form',
    icon: 'TicketIcon',
    href: 'https://forms.gle/UNhhuUfuw24uwNdV7'
  },
  // {
  //   label: 'More',
  //   icon: 'MoreIcon',
  //   items: [     
  //     {
  //       label: "Docs",
  //       href: "https://cougarecosystem.gitbook.io/cronoscougarswap/",
  //     },  
  //     // {
  //     //   label: 'Presale Infomation',
  //     //   href: 'https://cougarecosystem.gitbook.io/cronoscougarswap/presale-information'
  //     // },
  //     {
  //       label: 'Roadmap',        
  //       href: 'https://cougarecosystem.gitbook.io/cronoscougarswap/roadmap',
  //     },   
  //     {
  //       label: 'Tokenomics',        
  //       href: 'https://cougarecosystem.gitbook.io/cronoscougarswap/tokenomic/cougar-tokenomic',
  //     },       
  //   ],
  // },  
]

export default config
