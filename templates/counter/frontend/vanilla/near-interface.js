import * as Wallet from './near-wallet'

export async function counterIncrement(){
  return await Wallet.callMethod({method: "increment"})
}

export async function counterDecrement(){
  return await Wallet.callMethod({method: "decrement"})
}

export async function counterReset(){
  return await Wallet.callMethod({method: "reset"})
}

export async function getCounter(){
  return await Wallet.viewMethod({method: "get_num"});
}