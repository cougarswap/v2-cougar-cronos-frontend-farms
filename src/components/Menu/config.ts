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
    href: 'https://legacy-cronosapp.cougarswap.io/',
    calloutClass: 'highlight' 
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
        label: 'Liquidity',
        href: 'https://cronosdex.cougarswap.io/#/pool'
      },
       {
        label: 'Buy CGS',
        href: 'https://cronosdex.cougarswap.io/#/swap?outputCurrency=0xCBfb4bE9dBbaD51A794B10AaCaC0E5341777d398'
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
    label: 'Launchpad (New)',   
    icon: 'Ifo2Icon',       
    href: '/ifo'
  },   
  {
    label: 'CBank', 
    icon: 'Ifo3Icon',         
    href: '/cbank'  
  },      
  {
    label: 'Referral',
    icon: 'Groups2Icon', 
    href: '/referrals'   
  },    
  {
    label: 'Bridge',
    icon: 'BridgeIcon',    
    items: [
      {
        label: 'Cougar Bridge',
        href: 'https://bridge.cougarswap.io'
      }, 
      {
        label: 'Any Swap',
        href: 'https://anyswap.exchange/#/router'
      },     
      {
        label: 'EVOdefi Bridge',
        href: 'https://bridge.evodefi.com'
      },     
      {
        label: 'Cronos Bridge',
        href: 'https://cronos.crypto.org/docs/bridge/cdcex.html'
      }        
    ]
  },    
  {
    label: 'Audit',
    icon: 'Audit2Icon',
    href: 'https://cougarswap.gitbook.io/cronoscougarswap/security/audits-and-reviews'
  },    
  {
    label: 'Graphs',
    icon: 'ChartIcon',
    items: [
      {
        label: 'DexScreener',
        href: 'https://dexscreener.com/cronos/0x6Fdb5901A12BeefeB7Ff35d7396464aFa689C4dD',
      },
      {
        label: 'Nomics',
        href: 'https://nomics.com/assets/cgscro-cougarswap-cronos',
      }
    ]
  },
  {
    label: 'Listings',
    icon: 'HamburgerIcon',
    items: [     
      {
        label: 'CoinMarketCap',
        href: 'https://coinmarketcap.com/currencies/cougar/',
      },     
      {
        label: 'Cronos Explorer',
        href: 'https://cronoscan.com/address/0x4e57e27e4166275Eb7f4966b42A201d76e481B03/transactions',
      },
      {
        label: 'Defi Llama',
        href: 'https://defillama.com/protocol/cougarswap',
      },
    ],
  }, 
  {
    label: 'Partner Application Form',
    icon: 'TicketIcon',
    href: 'https://forms.gle/UNhhuUfuw24uwNdV7'
  },
  {
    label: 'More',
    icon: 'MoreIcon',
    items: [     
      {
        label: "Docs",
        href: "https://cougarecosystem.gitbook.io/cronoscougarswap/",
      },  
      // {
      //   label: 'Presale Infomation',
      //   href: 'https://cougarecosystem.gitbook.io/cronoscougarswap/presale-information'
      // },
      {
        label: 'Roadmap',        
        href: 'https://cougarecosystem.gitbook.io/cronoscougarswap/roadmap',
      },   
      {
        label: 'Tokenomics',        
        href: 'https://cougarecosystem.gitbook.io/cronoscougarswap/tokenomic/cougar-tokenomic',
      },       
    ],
  },  
]

export default config
