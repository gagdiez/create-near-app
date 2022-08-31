import {utils} from 'near-api-js'
import * as Wallet from './near-wallet'

export async function getBeneficiary() {
  return await Wallet.viewMethod({ method: "beneficiary" })
}

export async function latestDonations() {
  const number_of_donors = await Wallet.viewMethod({ method: "number_of_donors" })
  const min = number_of_donors > 10 ? number_of_donors - 9 : 0

  let donations = await Wallet.viewMethod({ method: "get_donations", args: { from_index: min.toString(), limit: number_of_donors } })

  donations.forEach(elem => {
    elem.total_amount = utils.format.formatNearAmount(elem.total_amount);
  })

  return donations
}

export async function donate(amount) {
  let deposit = utils.format.parseNearAmount(amount.toString())
  let response = await Wallet.callMethod({ method: "donate", deposit })
  return response
}