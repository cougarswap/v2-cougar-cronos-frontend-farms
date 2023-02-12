import { createGlobalStyle } from 'styled-components'
// eslint-disable-next-line import/no-unresolved
import { PancakeTheme } from '@pancakeswap-libs/uikit'

declare module 'styled-components' {
  /* eslint-disable @typescript-eslint/no-empty-interface */
  export interface DefaultTheme extends PancakeTheme {}
}

const GlobalStyle = createGlobalStyle`
  * {
    font-family: 'Rubik', sans-serif;
    font-weight: bold;
  }
  body {
    background-color: ${({ theme }) => theme.colors.background};
    background-color: #25262d;
    background-blend-mode: overlay;
    background-image: url(/images/egg/cougar_bg_cronos_1.jpg);
    background-attachment: fixed;
    background-size: cover;
    
    img {
      height: auto;
      max-width: 100%;
    }
  }

  .highlight {
    a > svg {
      fill: #ff5722;
    }

    a > div {
      color: #ff5722;
    }

    a:hover > svg {
      fill: #ff5722;
    }

    a:hover > div {
      color: #ff5722;
    }
  }
`

export default GlobalStyle
