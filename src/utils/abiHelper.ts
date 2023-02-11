import beamswapMasterchefAbi from 'config/abi/partners/beamswap.json'
import merdMasterchefAbi from 'config/abi/partners/merdChef.json'
import masterchefAbi from 'config/abi/masterchef.json'


export const getPartnerMasterchefAbi = (token: string) => {
    switch (token) {
        case 'GLINT': 
            return beamswapMasterchefAbi            
        case 'MERD': 
            return merdMasterchefAbi         
        default:
            return masterchefAbi
    }
}

