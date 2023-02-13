import { lpTokens, tokens } from "./tokens";
import { DexSwapRouter, StakePlatform, VaultConfig, VaultStatus } from "./types";

export const autoVaultConfig : VaultConfig = {
    id: 'cougar-cgs-auto',
    name: 'CGS', 
    isAutoCgs: true,       
    pid: -1,
    stakingToken: {
        isTokenOnly: true,
        token: tokens.cgs
    },          
    stakePlatform: StakePlatform.COUGARSWAP,
    strategyContract: '0x26337B589661D933f12493c763926FD742Dda281',
    status: VaultStatus.ACTIVE,
    dex: DexSwapRouter.COUGAREXCHANGE,
    depositFee: 0,
    withdrawFee: 0,
    performanceFee: 0,
    compoundFrequency: 1,
    compoundCron: "0 7 * * *",
    farmContractInfo: {
        mainToken: tokens.cgs,
        tokenPerBlockFunction: 'CougarGPerBlock',
        depositFeeBP: 0
    }
}

const vaults : VaultConfig [] =  []
export default vaults