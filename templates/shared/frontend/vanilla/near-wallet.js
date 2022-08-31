// near api js
import { providers } from 'near-api-js';

// wallet selector UI
import "@near-wallet-selector/modal-ui/styles.css";
import { setupModal } from "@near-wallet-selector/modal-ui";
import LedgerIconUrl from "@near-wallet-selector/ledger/assets/ledger-icon.png";
import MyNearIconUrl from "@near-wallet-selector/my-near-wallet/assets/my-near-wallet-icon.png";

// wallet selector options
import { setupWalletSelector } from "@near-wallet-selector/core";
import { setupLedger } from "@near-wallet-selector/ledger";
import { setupMyNearWallet } from "@near-wallet-selector/my-near-wallet";


// To be called when the website loads
export async function startUp() {
  window.walletSelector = await setupWalletSelector({
    network: "testnet",
    modules: [setupMyNearWallet({ iconUrl: MyNearIconUrl }),
    setupLedger({ iconUrl: LedgerIconUrl })],
  });;

  const isSignedIn = window.walletSelector.isSignedIn();

  if (isSignedIn) {
    const { contract: { contractId }, accounts } = walletSelector.store.getState();

    window.wallet = await walletSelector.wallet();
    window.accountId = accounts[0].accountId;
    window.contractId = contractId;
  }

  return isSignedIn
}


// Sign-in method
export function signIn() {
  const description = "Please select a wallet to sign in."
  modal = setupModal(window.walletSelector, { contractId: process.env.CONTRACT_NAME, description })
  modal.show()
}


// Sign-out method
export function signOut() {
  window.wallet.signOut()
  window.location.replace(window.location.origin + window.location.pathname);
}


// Make a read-only call to retrieve information from the network
export async function viewMethod({ method, args = {} }) {
  const { network } = window.walletSelector.options;
  const provider = new providers.JsonRpcProvider({ url: network.nodeUrl });

  let res = await provider.query({
    request_type: "call_function",
    account_id: process.env.CONTRACT_NAME,
    method_name: method,
    args_base64: Buffer.from(JSON.stringify(args)).toString('base64'),
    finality: "optimistic",
  })
  return JSON.parse(Buffer.from(res.result).toString());
}


// Call a method that changes the contract's state
export async function callMethod({ method, args = {}, gas = 3000000000000, deposit = 0 }) {
  const { contract: { contractId }, accounts } = window.walletSelector.store.getState();
  const { accountId } = accounts[0]
  const wallet = await window.walletSelector.wallet();

  // Sign a transaction with the "FunctionCall" action
  return await wallet.signAndSendTransaction({
    signerId: accountId,
    receiverId: contractId,
    actions: [
      {
        type: "FunctionCall",
        params: {
          methodName: method,
          args,
          gas,
          deposit,
        },
      },
    ],
  })
}


export async function getTransactionResult(txhash) {
  const { network } = window.walletSelector.options;
  const provider = new providers.JsonRpcProvider({ url: network.nodeUrl });

  // Retrieve transaction result from the network
  const transaction = await provider.txStatus(txhash, 'unnused')
  return providers.getTransactionLastResult(transaction)
}