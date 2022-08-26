import * as Wallet from './near-wallet'

export async function init(){
  const walletSelector = await Wallet.getWalletSelector();
  const isSignedIn = walletSelector.isSignedIn();

  if(isSignedIn){
    const {contract:{contractId}, accounts} = walletSelector.store.getState();
  
    window.wallet = await walletSelector.wallet();
    window.accountId = accounts[0].accountId;
    window.contractId = contractId;   
  }

  return isSignedIn
}

export function signOutNearWallet() {
  window.wallet.signOut()
  window.location.replace(window.location.origin + window.location.pathname);
}

export function signInWithNearWallet() {
  Wallet.showSelectorUI()
}

export async function setGreetingOnContract(message){
  return await Wallet.call("set_greeting", {message})
}

export async function getGreetingFromContract(){
  return await Wallet.view("get_greeting", {});
}