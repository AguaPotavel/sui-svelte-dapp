import {
	AllDefaultWallets,
	ConnectionStatus,
	WalletRadar,
	type IDefaultWallet,
	type IWallet,
	type IWalletAdapter
} from '@suiet/wallet-sdk';
import type { IdentifierString, WalletAccount } from '@wallet-standard/core';
import { Transaction } from '@mysten/sui/transactions';
import type { SuiSignAndExecuteTransactionOutput } from '@mysten/wallet-standard';

/**
 * Get all available wallets installed in the browser
 */
export function getAvailableWallets(): IWallet[] {
	const walletAdapters = detectWalletAdapters();

	const availableWallets = AllDefaultWallets
		.map((item) => {
			const foundAdapter = walletAdapters.find((walletAdapter) => {
				return item.name.includes(walletAdapter.name);
			});

			return {
				...item,
				adapter: foundAdapter ? foundAdapter : undefined,
				installed: foundAdapter ? true : false
			};
		})
		.filter((item) => item.installed === true);

	return availableWallets;
}

/**
 * Connect to a specific wallet
 */
export async function connectToWallet(wallet: IWallet): Promise<{
	success: boolean;
	account?: WalletAccount;
	adapter?: IWalletAdapter;
	error?: string;
}> {
	const walletAdapter = wallet?.adapter;
	
	if (!walletAdapter) {
		return { success: false, error: 'Wallet adapter not found' };
	}

	try {
		await walletAdapter.connect();
		const account = walletAdapter.accounts[0];
		
		return { 
			success: true, 
			account, 
			adapter: walletAdapter 
		};
	} catch (error) {
		return { 
			success: false, 
			error: error instanceof Error ? error.message : 'Unknown error' 
		};
	}
}

/**
 * Disconnect from wallet
 */
export function disconnectWallet(adapter?: IWalletAdapter): void {
	adapter?.disconnect();
}

/**
 * Sign and execute a transaction
 */
export async function signAndExecuteTransactionHeadless(
	transaction: Transaction,
	account: WalletAccount,
	adapter: IWalletAdapter
): Promise<SuiSignAndExecuteTransactionOutput> {
	if (!adapter || !account) {
		throw new Error('Wallet not connected');
	}

	return await adapter.signAndExecuteTransaction({
		account: account,
		chain: account.chains[0] as IdentifierString,
		transaction: transaction
	});
}

/**
 * Sign a message
 */
export async function signMessageHeadless(
	message: string | Uint8Array,
	account: WalletAccount,
	adapter: IWalletAdapter
): Promise<{ signature: string; messageBytes: string }> {
	if (!adapter || !account) {
		throw new Error('Wallet not connected');
	}

	if (!adapter.signMessage) {
		throw new Error(
			'This wallet does not support message signing. Please try a different wallet or use signAndExecuteTransaction instead.'
		);
	}

	const messageBytes = typeof message === 'string' ? new TextEncoder().encode(message) : message;

	const result = await adapter.signPersonalMessage({
		account: account,
		message: messageBytes
	});

	return {
		signature: result.signature,
		messageBytes: Array.from(messageBytes)
			.map((b) => b.toString(16).padStart(2, '0'))
			.join('')
	};
}

/**
 * Check if wallet can sign messages
 */
export function canSignMessageHeadless(adapter?: IWalletAdapter): boolean {
	if (!adapter) {
		return false;
	}
	return typeof adapter.signMessage === 'function';
}

/**
 * Open a wallet selection modal programmatically
 */
export async function openWalletSelectionModal(): Promise<IWallet | undefined> {
	return new Promise((resolve) => {
		const availableWallets = getAvailableWallets();
		
		if (availableWallets.length === 0) {
			resolve(undefined);
			return;
		}

		// Create a simple modal
		const modal = document.createElement('div');
		modal.style.cssText = `
			position: fixed;
			top: 0;
			left: 0;
			right: 0;
			bottom: 0;
			background: rgba(0, 0, 0, 0.5);
			display: flex;
			align-items: center;
			justify-content: center;
			z-index: 9999;
		`;

		const content = document.createElement('div');
		content.style.cssText = `
			background: white;
			border-radius: 12px;
			padding: 24px;
			max-width: 400px;
			width: 90%;
			max-height: 80vh;
			overflow-y: auto;
		`;

		const title = document.createElement('h2');
		title.textContent = 'Connect Wallet';
		title.style.cssText = 'margin: 0 0 16px 0; font-size: 24px; font-weight: bold;';

		const walletList = document.createElement('div');
		walletList.style.cssText = 'display: flex; flex-direction: column; gap: 8px;';

		availableWallets.forEach(wallet => {
			const button = document.createElement('button');
			button.style.cssText = `
				display: flex;
				align-items: center;
				gap: 12px;
				padding: 12px;
				border: 1px solid #e5e7eb;
				border-radius: 8px;
				background: white;
				cursor: pointer;
				transition: all 0.2s;
				width: 100%;
			`;

			button.innerHTML = `
				<img src="${wallet.iconUrl}" alt="${wallet.name}" style="width: 32px; height: 32px; border-radius: 6px;">
				<div style="text-align: left; flex: 1;">
					<div style="font-weight: 600; color: #111827;">${wallet.name}</div>
					<div style="font-size: 14px; color: #6b7280;">Click to connect</div>
				</div>
			`;

			button.onmouseover = () => {
				button.style.borderColor = '#93c5fd';
				button.style.backgroundColor = '#eff6ff';
			};
			button.onmouseout = () => {
				button.style.borderColor = '#e5e7eb';
				button.style.backgroundColor = 'white';
			};

			button.onclick = () => {
				document.body.removeChild(modal);
				resolve(wallet);
			};

			walletList.appendChild(button);
		});

		const closeButton = document.createElement('button');
		closeButton.textContent = 'Cancel';
		closeButton.style.cssText = `
			margin-top: 16px;
			padding: 8px 16px;
			border: 1px solid #e5e7eb;
			border-radius: 6px;
			background: white;
			cursor: pointer;
			width: 100%;
		`;
		closeButton.onclick = () => {
			document.body.removeChild(modal);
			resolve(undefined);
		};

		content.appendChild(title);
		content.appendChild(walletList);
		content.appendChild(closeButton);
		modal.appendChild(content);

		modal.onclick = (e) => {
			if (e.target === modal) {
				document.body.removeChild(modal);
				resolve(undefined);
			}
		};

		document.body.appendChild(modal);
	});
}

/**
 * Connect wallet with modal selection
 */
export async function connectWithModalHeadless(): Promise<{
	success: boolean;
	account?: WalletAccount;
	adapter?: IWalletAdapter;
	wallet?: IWallet;
	error?: string;
}> {
	try {
		const selectedWallet = await openWalletSelectionModal();
		
		if (!selectedWallet) {
			return { success: false, error: 'No wallet selected' };
		}

		const result = await connectToWallet(selectedWallet);
		
		return {
			...result,
			wallet: selectedWallet
		};
	} catch (error) {
		return {
			success: false,
			error: error instanceof Error ? error.message : 'Unknown error'
		};
	}
}

// Helper function to detect wallet adapters
function detectWalletAdapters(): IWalletAdapter[] {
	const walletRadar = new WalletRadar();
	walletRadar.activate();

	const walletAdapters = walletRadar.getDetectedWalletAdapters();
	walletRadar.deactivate();

	return walletAdapters;
}