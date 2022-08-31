import * as Wallet from './near-wallet'

export async function getGreeting(){
  return await Wallet.viewMethod({method: "get_greeting"});
}

export async function setGreeting(message){
  return await Wallet.callMethod({method: "set_greeting", args:{message}})
}