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

<dialog bind:this={connectModal} class="backdrop:bg-black/50">
	{#if isCustom}
		<slot />
	{:else}
		<div class="fixed inset-0 flex items-center justify-center p-4">
			<div class="bg-white rounded-xl shadow-2xl p-6 w-full max-w-md animate-in fade-in-0 zoom-in-95 duration-200">
				<div class="flex justify-between items-center mb-6">
					<h2 class="text-2xl font-bold text-gray-900">Connect Wallet</h2>
					<button
						aria-label="Close"
						class="text-gray-400 hover:text-gray-600 transition-colors p-1 rounded-full hover:bg-gray-100"
						onclick={onClose}
					>
						<svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
							<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
						</svg>
					</button>
				</div>
				
				{#if availableWallets.length == 0}
					<div class="text-center py-8">
						<div class="text-gray-500 mb-4">No wallets detected</div>
						<p class="text-sm text-gray-600">
							Please install a Sui wallet. We recommend 
							<a
								href="https://chromewebstore.google.com/detail/suiet-sui-wallet/khpkpbbcccdmmclmpigdgddabeilkdpd"
								target="_blank"
								class="text-blue-600 hover:text-blue-800 font-semibold underline"
							>
								Suiet
							</a>.
						</p>
					</div>
				{:else}
					<div class="space-y-3">
						{#each availableWallets as wallet (wallet.name)}
							<button
								class="w-full flex items-center gap-4 p-4 rounded-lg border border-gray-200 hover:border-blue-300 hover:bg-blue-50 transition-all duration-200 group"
								onclick={() => onSelected(wallet)}
							>
								<img 
									src={wallet.iconUrl} 
									alt={wallet.name}
									class="w-10 h-10 rounded-lg flex-shrink-0"
								/>
								<div class="flex-1 text-left">
									<div class="font-semibold text-gray-900 group-hover:text-blue-900">{wallet.name}</div>
									<div class="text-sm text-gray-500">Click to connect</div>
								</div>
								<svg class="w-5 h-5 text-gray-400 group-hover:text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
	dialog {
		padding: 0;
		border: none;
		border-radius: 0;
		background: transparent;
	}
	
	dialog::backdrop {
		background-color: rgb(0 0 0 / 0.5);
	}
</style>
