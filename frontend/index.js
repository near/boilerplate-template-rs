// React
import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';

// Wallet Selector
import { Wallet } from './near-wallet';

const CONTRACT_NAME = process.env.CONTRACT_NAME;

// When creating the wallet you can optionally ask to create an access key
// Having the key enables to call non-payable methods without interrupting the user to sign
const wallet = new Wallet({ createAccessKeyFor: process.env.CONTRACT_NAME });

// Abstract the logic of interacting with the contract to simplify your flow
const helloNEAR = {
  getGreeting: async () => await wallet.viewMethod({ contractId: CONTRACT_NAME, method: 'get_greeting' }),
  setGreeting: async (greeting) => await wallet.callMethod({
    contractId: CONTRACT_NAME,
    method: 'set_greeting',
    args: { message: greeting },
  })
}

// Setup on page load
window.onload = async () => {
  const isSignedIn = await wallet.startUp();

  const root = createRoot(document.getElementById('root'));
  root.render(
    <App isSignedIn={isSignedIn} helloNEAR={helloNEAR} wallet={wallet} />
  );
};
