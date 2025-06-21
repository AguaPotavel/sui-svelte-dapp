<script lang="ts" module>
	export interface IConnectModal {
		openAndWaitForResponse: () => Promise<IWallet | undefined>;
	}

	let _resolve = $state<(value: IWallet | PromiseLike<IWallet | undefined> | undefined) => void>();
	let resolve = {
		get value() {
			return _resolve;
		},
		set(resolve: typeof _resolve) {
			_resolve = resolve;
		}
	};
	let connectModal = $state<HTMLDialogElement>();
	let getConnectModal = () => connectModal;
</script>

<script lang="ts">
	import type { IWallet } from '@suiet/wallet-sdk';

	interface IProps {
		availableWallets: IWallet[];
		isCustom: boolean;
	}

	let { availableWallets, isCustom }: IProps = $props();
	let isOpen = $state<boolean>(false);

	$effect(() => {
		if (!connectModal) return;
		if (isOpen) {
			connectModal.show();
		} else {
			connectModal.close();
		}
	});

	export const openAndWaitForResponse = (): Promise<IWallet | undefined> => {
		return new Promise((res) => {
			connectModal?.show();
			resolve.set(res);
		});
	};

	const onClose = () => {
		if (resolve.value) {
			resolve.value(undefined);
		}
		connectModal?.close();
	};

	const onSelected = (wallet: IWallet) => {
		if (resolve.value) {
			resolve.value(wallet);
		}
		connectModal?.close();
	};
</script>

<dialog bind:this={connectModal} class="connect-modal">
	{#if isCustom}
		<slot />
	{:else}
		<div class="modal-overlay">
			<div class="modal-content">
				<div class="modal-header">
					<h2 class="modal-title">Connect Wallet</h2>
					<button
						aria-label="Close"
						class="close-button"
						onclick={onClose}
					>
						<svg class="close-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
							<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
						</svg>
					</button>
				</div>
				
				{#if availableWallets.length == 0}
					<div class="no-wallets">
						<div class="no-wallets-message">No wallets detected</div>
						<p class="no-wallets-text">
							Please install a Sui wallet. We recommend 
							<a
								href="https://chromewebstore.google.com/detail/suiet-sui-wallet/khpkpbbcccdmmclmpigdgddabeilkdpd"
								target="_blank"
								class="wallet-link"
							>
								Suiet
							</a>.
						</p>
					</div>
				{:else}
					<div class="wallet-list">
						{#each availableWallets as wallet (wallet.name)}
							<button
								class="wallet-button"
								onclick={() => onSelected(wallet)}
							>
								<img 
									src={wallet.iconUrl} 
									alt={wallet.name}
									class="wallet-icon"
								/>
								<div class="wallet-info">
									<div class="wallet-name">{wallet.name}</div>
									<div class="wallet-description">Click to connect</div>
								</div>
								<svg class="wallet-arrow" fill="none" stroke="currentColor" viewBox="0 0 24 24">
									<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"></path>
								</svg>
							</button>
						{/each}
					</div>
				{/if}
			</div>
		</div>
	{/if}
</dialog>

<style>
	.connect-modal {
		padding: 0;
		border: none;
		border-radius: 0;
		background: transparent;
	}
	
	.connect-modal::backdrop {
		background-color: rgba(0, 0, 0, 0.5);
	}
	
	.modal-overlay {
		position: fixed;
		inset: 0;
		display: flex;
		align-items: center;
		justify-content: center;
		padding: 1rem;
	}
	
	.modal-content {
		background: white;
		border-radius: 0.75rem;
		box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
		padding: 1.5rem;
		width: 100%;
		max-width: 28rem;
		animation: fadeInZoom 0.2s ease-out;
	}
	
	@keyframes fadeInZoom {
		from {
			opacity: 0;
			transform: scale(0.95);
		}
		to {
			opacity: 1;
			transform: scale(1);
		}
	}
	
	.modal-header {
		display: flex;
		justify-content: space-between;
		align-items: center;
		margin-bottom: 1.5rem;
	}
	
	.modal-title {
		font-size: 1.5rem;
		font-weight: bold;
		color: #111827;
		margin: 0;
	}
	
	.close-button {
		color: #9ca3af;
		padding: 0.25rem;
		border-radius: 9999px;
		border: none;
		background: none;
		cursor: pointer;
		transition: all 0.15s ease;
	}
	
	.close-button:hover {
		color: #4b5563;
		background-color: #f3f4f6;
	}
	
	.close-icon {
		width: 1.5rem;
		height: 1.5rem;
	}
	
	.no-wallets {
		text-align: center;
		padding: 2rem 0;
	}
	
	.no-wallets-message {
		color: #6b7280;
		margin-bottom: 1rem;
	}
	
	.no-wallets-text {
		font-size: 0.875rem;
		color: #4b5563;
		margin: 0;
	}
	
	.wallet-link {
		color: #2563eb;
		font-weight: 600;
		text-decoration: underline;
	}
	
	.wallet-link:hover {
		color: #1d4ed8;
	}
	
	.wallet-list {
		display: flex;
		flex-direction: column;
		gap: 0.75rem;
	}
	
	.wallet-button {
		width: 100%;
		display: flex;
		align-items: center;
		gap: 1rem;
		padding: 1rem;
		border-radius: 0.5rem;
		border: 1px solid #e5e7eb;
		background: white;
		cursor: pointer;
		transition: all 0.2s ease;
	}
	
	.wallet-button:hover {
		border-color: #93c5fd;
		background-color: #eff6ff;
	}
	
	.wallet-icon {
		width: 2.5rem;
		height: 2.5rem;
		border-radius: 0.5rem;
		flex-shrink: 0;
	}
	
	.wallet-info {
		flex: 1;
		text-align: left;
	}
	
	.wallet-name {
		font-weight: 600;
		color: #111827;
		transition: color 0.2s ease;
	}
	
	.wallet-button:hover .wallet-name {
		color: #1e3a8a;
	}
	
	.wallet-description {
		font-size: 0.875rem;
		color: #6b7280;
	}
	
	.wallet-arrow {
		width: 1.25rem;
		height: 1.25rem;
		color: #9ca3af;
		transition: color 0.2s ease;
	}
	
	.wallet-button:hover .wallet-arrow {
		color: #2563eb;
	}
</style>
