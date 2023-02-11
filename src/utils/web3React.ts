import { InjectedConnector } from '@web3-react/injected-connector'
import { WalletConnectConnector } from '@web3-react/walletconnect-connector'
import { WalletLinkConnector } from '@web3-react/walletlink-connector'
import { BscConnector } from '@binance-chain/bsc-connector'
import { ConnectorNames } from '@pancakeswap-libs/uikit'
import Web3 from 'web3'
import { DeFiWeb3Connector } from 'deficonnect'
import { TalismanConnector } from '@talismn/web3react-v6-connector'
import getNodeUrl from './getRpcUrl'

const POLLING_INTERVAL = 12000
const rpcUrl = getNodeUrl()
const chainId = parseInt(process.env.REACT_APP_CHAIN_ID, 10)

const injected = new InjectedConnector({ supportedChainIds: [chainId] })

const walletconnect = new WalletConnectConnector({
  rpc: { [chainId]: rpcUrl },
  bridge: 'https://pancakeswap.bridge.walletconnect.org/',
  qrcode: true,
  pollingInterval: POLLING_INTERVAL,
})

const bscConnector = new BscConnector({ supportedChainIds: [chainId] })

const defiWalletConnect = new DeFiWeb3Connector({
  supportedChainIds: [chainId],
  rpc: { [chainId]: rpcUrl },
  pollingInterval: 15000,
})

const coinbaseConnector = new WalletLinkConnector({
  url: rpcUrl,
  appName: 'coinbase wallet',
  supportedChainIds: [chainId],
})

const talisman = new TalismanConnector({
  supportedChainIds: [1, 3, 4, 5, 42, 81, 100, 137, 336, 592, 595, 1284, 1285, 1287, 42161]
})

export const connectorsByName: { [connectorName in ConnectorNames]: any } = {
  [ConnectorNames.Injected]: injected,
  [ConnectorNames.WalletConnect]: walletconnect,
  [ConnectorNames.BSC]: bscConnector,  
  [ConnectorNames.CDCDefiWallet]: defiWalletConnect,
  [ConnectorNames.CoinBase]: coinbaseConnector,
  [ConnectorNames.Talisman]: talisman,
}

export const getLibrary = (provider): Web3 => {
  return new Web3(provider)
}
