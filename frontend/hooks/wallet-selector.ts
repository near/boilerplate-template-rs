// near api js
import { providers } from 'near-api-js';

import type { AccountState, NetworkId, WalletSelector } from '@near-wallet-selector/core';
import { setupWalletSelector } from '@near-wallet-selector/core';
import type { WalletSelectorModal } from '@near-wallet-selector/modal-ui';
import { setupModal } from '@near-wallet-selector/modal-ui';
import { setupMyNearWallet } from '@near-wallet-selector/my-near-wallet';
import myNearWalletIconUrl from '@near-wallet-selector/my-near-wallet/assets/my-near-wallet-icon.png';
import { setupNearWallet } from '@near-wallet-selector/near-wallet';
import nearWalletIconUrl from '@near-wallet-selector/near-wallet/assets/near-wallet-icon.png';
import { useCallback, useEffect, useState } from 'react';
import { distinctUntilChanged, map } from 'rxjs';

const THIRTY_TGAS = '30000000000000';
const NO_DEPOSIT = '0';

// Cache in module to ensure we don't re-init
let selector: WalletSelector | null = null;
let modal: WalletSelectorModal | null = null;

//! *** IMPORTANT ***
// Do not call useWalletSelector hook anywhere but ContractView.tsx. This current implementation is highly
// coupled to being called once in ContractView.tsx and serious side-effects may occur if this is changed.
export const useWalletSelector = (contractId: string | undefined, network: string = 'testnet') => {
  const [accounts, setAccounts] = useState<Array<AccountState>>([]);

  const init = useCallback(async () => {
    if (!contractId || !network) {
      return null;
    }

    selector = await setupWalletSelector({
      network: network as NetworkId,
      modules: [
        setupMyNearWallet({ iconUrl: myNearWalletIconUrl.src }),
        setupNearWallet({ iconUrl: nearWalletIconUrl.src }),
      ],
    });

    modal = setupModal(selector, {
      contractId,
    });

    const state = selector.store.getState();
    setAccounts(state.accounts);

    const subscription = selector.store.observable
      .pipe(
        map((state) => state.accounts),
        distinctUntilChanged(),
      )
      .subscribe((nextAccounts) => {
        setAccounts(nextAccounts);
      });

    return () => subscription.unsubscribe();
  }, [contractId, network]);

  useEffect(() => {
    init().catch((err) => {
      console.error(err);
    });
  }, [init]);

  const accountId = accounts.find((account) => account.active)?.accountId;

  const signOut = async (contractId: string | undefined) => {
    if (!selector || !contractId) {
      return false;
    }

    const wallet = await selector.wallet();
    await wallet.signOut();
  };

  // Make a read-only call to retrieve information from the network
  const viewMethod = async (contractId: string, method: string, args = {}) => {
    const { network } = selector!.options;
    const provider = new providers.JsonRpcProvider({ url: network.nodeUrl });

    let res = (await provider.query({
      request_type: 'call_function',
      account_id: contractId,
      method_name: method,
      args_base64: Buffer.from(JSON.stringify(args)).toString('base64'),
      finality: 'optimistic',
    })) as any;
    return JSON.parse(Buffer.from(res.result).toString());
  };

  // Call a method that changes the contract's state
  const callMethod = async (
    contractId: string,
    accountId: string,
    method: string,
    args = {},
    gas = THIRTY_TGAS,
    deposit = NO_DEPOSIT,
  ) => {
    // Sign a transaction with the "FunctionCall" action
    const wallet = await selector!.wallet();
    console.log('wallet | callMethod: ', wallet);

    return await wallet.signAndSendTransaction({
      signerId: accountId,
      receiverId: contractId,
      actions: [
        {
          type: 'FunctionCall',
          params: {
            methodName: method,
            args,
            gas,
            deposit,
          },
        },
      ],
    });
  };

  return {
    selector,
    modal,
    accountId,
    signOut,
    viewMethod,
    callMethod,
  };
};
