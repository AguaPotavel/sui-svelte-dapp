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

	let walletAdapter = $state<IWalletAdapter>();
	let status = $state<ConnectionStatus>(ConnectionStatus.DISCONNECTED);
	let _account = $state<WalletAccount>();
	let connectModal = $state<IConnectModal>();
	export let getConnectModal = () => connectModal;
	let _onConnect = $state<() => void>(() => {});

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
				_onConnect();
			} catch {
				status = ConnectionStatus.DISCONNECTED;
			}
		}
	};

	export const disconnect = () => {
		walletAdapter?.disconnect();
		account.removeAccount();
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

	export const signMessage = async (message: string | Uint8Array): Promise<{ signature: string; messageBytes: string }> => {
		ensureCallable();
		
		// Convert string to Uint8Array if needed
		const messageBytes = typeof message === 'string' 
			? new TextEncoder().encode(message)
			: message;
		
		const result = await walletAdapter!!.signMessage({
			account: account.value!!,
			message: messageBytes
		});
		
		return {
			signature: result.signature,
			messageBytes: Array.from(messageBytes).map(b => b.toString(16).padStart(2, '0')).join('')
		};
	};

	const getAvailableWallets = (defaultWallets: IDefaultWallet[]): IWallet[] => {
		const walletAdapters = detectWalletAdapters();

		// Debug: log detected wallets with full info
		console.log(
			'Detected wallet adapters:',
			walletAdapters.map((w) => ({ name: w.name, icon: w.icon }))
		);
		console.log(
			'Default wallets:',
			defaultWallets.map((w) => w.name)
		);

		const availableWallets = defaultWallets
			.map((item) => {
				const foundAdapter = walletAdapters.find((walletAdapter) => {
					// Check exact name match or common aliases
					return (
						walletAdapter.name === item.name ||
						(item.name === 'Sui Wallet' && walletAdapter.name === 'Slush') ||
						(item.name === 'Slush' && walletAdapter.name === 'Sui Wallet')
					);
				});

				return {
					...item,
					adapter: foundAdapter ? foundAdapter : undefined,
					installed: foundAdapter ? true : false
				};
			})
			.filter((item) => item.installed == true);

		// Also check for any adapters not in default list (like Slush with different names)
		const extraWallets = walletAdapters
			.filter((adapter) => {
				// Don't include if already matched in default wallets
				const isAlreadyMatched = defaultWallets.some(
					(dw) =>
						dw.name === adapter.name ||
						(dw.name === 'Sui Wallet' && adapter.name === 'Slush') ||
						(dw.name === 'Slush' && adapter.name === 'Sui Wallet')
				);
				return !isAlreadyMatched;
			})
			.map((adapter) => ({
				name: adapter.name,
				iconUrl: adapter.icon || '',
				downloadUrl: '',
				adapter: adapter,
				installed: true
			}));

		const allWallets = [...availableWallets, ...extraWallets];
		console.log(
			'Final available wallets:',
			allWallets.map((w) => w.name)
		);

		return allWallets;
	};

	const detectWalletAdapters = (): IWalletAdapter[] => {
		const walletRadar = new WalletRadar();
		walletRadar.activate();

		// Give a small delay for wallets to register
		const walletAdapters = walletRadar.getDetectedWalletAdapters();

		// Also check window object for Slush-specific registration
		if (typeof window !== 'undefined' && (window as any).slush) {
			console.log('Found Slush wallet in window object');
		}

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
	}

	const { onConnect }: IProps = $props();
	if (onConnect) {
		_onConnect = onConnect;
	}
</script>

<ConnectModal isCustom={$$slots.modal ? true : false} bind:this={connectModal} {availableWallets}>
	{#if $$slots.modal}
		<slot name="modal" />
	{/if}
</ConnectModal>
<slot />
