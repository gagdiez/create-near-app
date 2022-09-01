// React
import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';

// NEAR
import { Contract } from './near-interface';
import { Wallet } from './near-wallet';

// create the Wallet and the Contract
const contractId = process.env.CONTRACT_NAME
const wallet = new Wallet({contractId: contractId});
const contract = new Contract({wallet: wallet})

// Setup on page load
window.onload = async () => {
  const isSignedIn = await wallet.startUp()
 
  ReactDOM.render(
    <App isSignedIn={isSignedIn} contract={contract} wallet={wallet} />,
    document.getElementById('root')
  );
}