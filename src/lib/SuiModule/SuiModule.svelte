<script lang="ts" module>
	import { Transaction } from '@mysten/sui/transactions';
	import {
		AllDefaultWallets,
		ConnectionStatus,
		WalletRadar,
		type IDefaultWallet,
		type IWallet,
		type IWalletAdapter
	} from '@suiet/wallet-sdk';
	import type { IdentifierString, WalletAccount } from '@wallet-standard/core';
	import ConnectModal, { type IConnectModal } from '../ConnectModal/ConnectModal.svelte';
	import type { SuiSignAndExecuteTransactionOutput } from '@mysten/wallet-standard';
	import { browser } from '$app/environment';

	let walletAdapter = $state<IWalletAdapter>();
	let status = $state<ConnectionStatus>(ConnectionStatus.DISCONNECTED);
	let _account = $state<WalletAccount>();
	let connectModal = $state<IConnectModal>();
	export let getConnectModal = () => connectModal;
	let _onConnect = $state<() => void>(() => {});
	let _autoConnect = $state<boolean>(false);

	const STORAGE_KEY = 'sui-module-connection';

	const saveConnectionData = (walletName: string) => {
		if (browser && _autoConnect) {
			localStorage.setItem(STORAGE_KEY, JSON.stringify({ walletName, autoConnect: true }));
		}
	};

	const getConnectionData = () => {
		if (browser) {
			const data = localStorage.getItem(STORAGE_KEY);
			return data ? JSON.parse(data) : null;
		}
		return null;
	};

	const clearConnectionData = () => {
		if (browser) {
			localStorage.removeItem(STORAGE_KEY);
		}
	};

	const autoConnectWallet = async () => {
		if (!_autoConnect || !browser) return;

		const connectionData = getConnectionData();
		if (!connectionData?.autoConnect) return;

		const wallet = availableWallets.find((w) => w.name === connectionData.walletName);
		if (wallet && wallet.installed) {
			await connect(wallet);
		}
	};

	export const account = {
		get value() {
			return _account;
		},
		setAccount(account: WalletAccount) {
			_account = account;
		},
		removeAccount() {
			_account = undefined;
		}
	};

	export const connectWithModal = async () => {
		if (account.value) return;
		let selectedWallet = await connectModal?.openAndWaitForResponse();
		if (selectedWallet) {
			await connect(selectedWallet);
		}
	};

	export const connect = async (wallet: IWallet) => {
		walletAdapter = wallet?.adapter;
		if (walletAdapter) {
			status = ConnectionStatus.CONNECTING;
			try {
				await walletAdapter.connect();
				account.setAccount(walletAdapter.accounts[0]);
				status = ConnectionStatus.CONNECTED;
				saveConnectionData(wallet.name);
				_onConnect();
			} catch {
				status = ConnectionStatus.DISCONNECTED;
			}
		}
	};

	export const disconnect = () => {
		walletAdapter?.disconnect();
		account.removeAccount();
		status = ConnectionStatus.DISCONNECTED;
		clearConnectionData();
	};

	export const signAndExecuteTransaction = async (
		transaction: Transaction
	): Promise<SuiSignAndExecuteTransactionOutput> => {
		ensureCallable();
		return await walletAdapter!!.signAndExecuteTransaction({
			account: account.value!!,
			chain: account.value!!.chains[0] as IdentifierString,
			transaction: transaction
		});
	};

	export const signMessage = async (
		message: string | Uint8Array
	): Promise<{ signature: string; messageBytes: string }> => {
		ensureCallable();

		// Check if wallet supports message signing
		if (!walletAdapter!!.signMessage) {
			throw new Error(
				'This wallet does not support message signing. Please try a different wallet or use signAndExecuteTransaction instead.'
			);
		}

		// Convert string to Uint8Array if needed
		const messageBytes = typeof message === 'string' ? new TextEncoder().encode(message) : message;

		const result = await walletAdapter!!.signPersonalMessage({
			account: account.value!!,
			message: messageBytes
		});

		return {
			signature: result.signature,
			messageBytes: Array.from(messageBytes)
				.map((b) => b.toString(16).padStart(2, '0'))
				.join('')
		};
	};

	export const canSignMessage = (): boolean => {
		if (status !== ConnectionStatus.CONNECTED || !walletAdapter) {
			return false;
		}

		return typeof walletAdapter.signMessage === 'function';
	};

	const getAvailableWallets = (defaultWallets: IDefaultWallet[]): IWallet[] => {
		const walletAdapters = detectWalletAdapters();

		const availableWallets = defaultWallets
			.map((item) => {
				const foundAdapter = walletAdapters.find((walletAdapter) => {
					// Check exact name match or common aliases
					return item.name.includes(walletAdapter.name);
				});

				return {
					...item,
					adapter: foundAdapter ? foundAdapter : undefined,
					installed: foundAdapter ? true : false
				};
			})
			.filter((item) => item.installed == true);

		return availableWallets;
	};

	const detectWalletAdapters = (): IWalletAdapter[] => {
		const walletRadar = new WalletRadar();
		walletRadar.activate();

		// Give a small delay for wallets to register
		const walletAdapters = walletRadar.getDetectedWalletAdapters();

		walletRadar.deactivate();

		return walletAdapters;
	};

	const ensureCallable = () => {
		if (status !== ConnectionStatus.CONNECTED) {
			throw Error('wallet is not connected');
		}
	};

	let availableWallets = getAvailableWallets(AllDefaultWallets);
</script>

<script lang="ts">
	interface IProps {
		onConnect?: () => void;
		autoConnect?: boolean;
	}

	const { onConnect, autoConnect = false }: IProps = $props();
	if (onConnect) {
		_onConnect = onConnect;
	}
	_autoConnect = autoConnect;

	$effect(() => {
		if (browser && _autoConnect) {
			autoConnectWallet();
		}
	});
</script>

<ConnectModal isCustom={$$slots.modal ? true : false} bind:this={connectModal} {availableWallets}>
	{#if $$slots.modal}
		<slot name="modal" />
	{/if}
</ConnectModal>
<slot />
