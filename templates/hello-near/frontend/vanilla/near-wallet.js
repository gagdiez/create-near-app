// Wallet selector
import { setupWalletSelector } from "@near-wallet-selector/core";
import { setupLedger } from "@near-wallet-selector/ledger";
import { setupMyNearWallet } from "@near-wallet-selector/my-near-wallet";
import { setupSender } from "@near-wallet-selector/sender";
import { setupWalletConnect } from "@near-wallet-selector/wallet-connect";

// Modal UI
import { setupModal } from "@near-wallet-selector/modal-ui";

import "@near-wallet-selector/modal-ui/styles.css";
import LedgerIconUrl from "@near-wallet-selector/ledger/assets/ledger-icon.png";
import MyNearIconUrl from "@near-wallet-selector/my-near-wallet/assets/my-near-wallet-icon.png";
import SenderIconUrl from "@near-wallet-selector/sender/assets/sender-icon.png";
import WalletConnectIconUrl from "@near-wallet-selector/wallet-connect/assets/wallet-connect-icon.png";

// NEAR API JS
import { utils, providers } from 'near-api-js';

export async function getWalletSelector(){
  window.selector = await setupWalletSelector({
    network: "testnet",
    modules: [
      setupMyNearWallet({iconUrl: MyNearIconUrl}),
      setupLedger({iconUrl: LedgerIconUrl}),
      setupSender({iconUrl: SenderIconUrl}),
      setupWalletConnect({
        projectId: "hello-near",
        iconUrl: WalletConnectIconUrl,
        metadata: {
          name: "NEAR Wallet Selector",
          description: "Example dApp used by NEAR Wallet Selector",
          url: "https://github.com/near/wallet-selector",
          icons: ["https://avatars.githubusercontent.com/u/37784886"],
        },
      })
    ],
  });
  
  return window.selector
}

export function showSelectorUI(){
  const description = "Please select a wallet to sign in."
  modal = setupModal(window.selector, {contractId: process.env.CONTRACT_NAME, description})
  modal.show()
}

// View methods
export async function view(method, args){
  const { network } = window.selector.options;
  const provider = new providers.JsonRpcProvider({ url: network.nodeUrl });

  return await provider.query({
    request_type: "call_function",
    account_id: process.env.CONTRACT_NAME,
    method_name: method,
    args_base64: Buffer.from(JSON.stringify(args)).toString('base64'),
    finality: "optimistic",
  }).then((res) => JSON.parse(Buffer.from(res.result).toString()));
}

// Change methods
export async function call(method, args, gas = 2000000000000, deposit = 0){
  const {contract: {contractId}, accounts } = window.selector.store.getState();
  const { accountId } = accounts[0]

  const wallet = await window.selector.wallet();

  return wallet.signAndSendTransaction({
    signerId: accountId,
    receiverId: contractId,
    actions: [
      {
        type: "FunctionCall",
        params: {
          methodName: method,
          args,
          gas,
          deposit: utils.format.parseNearAmount(deposit.toString()),
        },
      },
    ],
  })
}