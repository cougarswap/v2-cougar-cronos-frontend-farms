import { getReferralContract } from 'utils/contractHelpers'

export const fetchReferralsUserCount = async (account) => {
    const referralContract = getReferralContract()
    const referralsCount = await referralContract.methods.referralsCount(account).call()
    return referralsCount
}

export const fetchReferralUserCommission = async (account) => {
    const referralContract = getReferralContract()
    const referralCommission = await referralContract.methods.totalReferralCommissions(account).call()
    return referralCommission
}
