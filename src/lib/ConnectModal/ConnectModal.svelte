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

<dialog bind:this={connectModal}>
	{#if isCustom}
		<slot />
	{:else}
		<div
			class="fixed left-0 top-0 flex h-screen w-screen items-start justify-center bg-black/50 pt-40"
		>
			<div class="card p-5">
				<div class="grid gap-y-2">
					<div class="grid grid-cols-2">
						<div class="flex items-center text-xl font-bold">Available wallets</div>
						<div class="flex justify-end">
							<button class="btn-icon variant-filled-error btn-sm" on:click={onClose}>
								<svg viewBox="0 0 24 24" width="1.2em" height="1.2em">
									<path
										fill="currentColor"
										d="M19 6.41L17.59 5L12 10.59L6.41 5L5 6.41L10.59 12L5 17.59L6.41 19L12 13.41L17.59 19L19 17.59L13.41 12z"
									>
									</path>
								</svg>
							</button>
						</div>
					</div>
					{#if availableWallets.length == 0}
						<div>
							Please install a Sui wallet, we recommend <a
								href="https://chromewebstore.google.com/detail/suiet-sui-wallet/khpkpbbcccdmmclmpigdgddabeilkdpd"
								target="_blank"
								class="font-bold underline"
							>
								Suiet
							</a>.
						</div>
					{/if}
					{#each availableWallets as wallet (wallet.name)}
						<button
							class="font btn flex justify-start items-center space-x-2 !p-0"
							on:click={() => onSelected(wallet)}
						>
							<img src={wallet.iconUrl} alt={wallet.name} />
							<div>{wallet.name}</div>
						</button>
					{/each}
				</div>
			</div>
		</div>
	{/if}
</dialog>

<style>
	/*! CSS Used from: https://suiforge.com/_app/immutable/assets/0.oTkU9L5B.css */
	*,
	:before,
	:after {
		box-sizing: border-box;
		border-width: 0;
		border-style: solid;
		border-color: #e5e7eb;
	}
	:before,
	:after {
		--tw-content: '';
	}
	a {
		color: inherit;
		text-decoration: inherit;
	}
	button {
		font-family: inherit;
		font-feature-settings: inherit;
		font-variation-settings: inherit;
		font-size: 100%;
		font-weight: inherit;
		line-height: inherit;
		color: inherit;
		margin: 0;
		padding: 0;
	}
	button {
		text-transform: none;
	}
	button {
		appearance: button;
		background-color: transparent;
		background-image: none;
	}
	dialog {
		padding: 0;
	}
	button {
		cursor: pointer;
	}
	:disabled {
		cursor: default;
	}
	svg {
		display: block;
	}
	::selection {
		background-color: rgb(orange / 0.3);
	}
	::-webkit-scrollbar {
		width: 0.5rem;
		height: 0.5rem;
	}
	::-webkit-scrollbar-track {
		padding-left: 1px;
		padding-right: 1px;
		background-color: rgb(var(--color-surface-50)) !important;
	}
	::-webkit-scrollbar-thumb {
		background-color: rgb(var(--color-surface-400));
		border-radius: var(--theme-rounded-base);
	}
	::-webkit-scrollbar-corner {
		background-color: rgb(var(--color-surface-50)) !important;
	}
	::placeholder {
		color: rgb(var(--color-surface-500));
	}
	*,
	:before,
	:after {
		--tw-border-spacing-x: 0;
		--tw-border-spacing-y: 0;
		--tw-translate-x: 0;
		--tw-translate-y: 0;
		--tw-rotate: 0;
		--tw-skew-x: 0;
		--tw-skew-y: 0;
		--tw-scale-x: 1;
		--tw-scale-y: 1;
		--tw-scroll-snap-strictness: proximity;
		--tw-ring-offset-width: 0px;
		--tw-ring-offset-color: #fff;
		--tw-ring-color: rgb(59 130 246 / 0.5);
		--tw-ring-offset-shadow: 0 0 #0000;
		--tw-ring-shadow: 0 0 #0000;
		--tw-shadow: 0 0 #0000;
		--tw-shadow-colored: 0 0 #0000;
	}
	.btn-icon:disabled {
		cursor: not-allowed !important;
		opacity: 0.5 !important;
	}
	.btn-icon:disabled:hover {
		--tw-brightness: brightness(1);
		filter: var(--tw-blur) var(--tw-brightness) var(--tw-contrast) var(--tw-grayscale)
			var(--tw-hue-rotate) var(--tw-invert) var(--tw-saturate) var(--tw-sepia) var(--tw-drop-shadow);
	}
	.btn-icon:disabled:active {
		--tw-scale-x: 1;
		--tw-scale-y: 1;
		transform: translate(var(--tw-translate-x), var(--tw-translate-y)) rotate(var(--tw-rotate))
			skew(var(--tw-skew-x)) skewY(var(--tw-skew-y)) scaleX(var(--tw-scale-x))
			scaleY(var(--tw-scale-y));
	}
	.btn-sm {
		padding: 0.375rem 0.75rem;
		font-size: 0.875rem;
		line-height: 1.25rem;
	}
	.btn-icon {
		font-size: 1rem;
		line-height: 1.5rem;
		padding-left: 1.25rem;
		padding-right: 1.25rem;
		white-space: nowrap;
		text-align: center;
		display: inline-flex;
		align-items: center;
		justify-content: center;
		transition-property: all;
		transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
		transition-duration: 0.15s;
		padding: 0;
		aspect-ratio: 1 / 1;
		width: 43px;
		border-radius: 9999px;
	}
	.btn-icon:hover {
		--tw-brightness: brightness(1.15);
		filter: var(--tw-blur) var(--tw-brightness) var(--tw-contrast) var(--tw-grayscale)
			var(--tw-hue-rotate) var(--tw-invert) var(--tw-saturate) var(--tw-sepia) var(--tw-drop-shadow);
	}
	.btn-icon:active {
		--tw-scale-x: 95%;
		--tw-scale-y: 95%;
		transform: translate(var(--tw-translate-x), var(--tw-translate-y)) rotate(var(--tw-rotate))
			skew(var(--tw-skew-x)) skewY(var(--tw-skew-y)) scaleX(var(--tw-scale-x))
			scaleY(var(--tw-scale-y));
		--tw-brightness: brightness(0.9);
		filter: var(--tw-blur) var(--tw-brightness) var(--tw-contrast) var(--tw-grayscale)
			var(--tw-hue-rotate) var(--tw-invert) var(--tw-saturate) var(--tw-sepia) var(--tw-drop-shadow);
	}
	.card {
		background-color: white;
		--tw-ring-offset-shadow: var(--tw-ring-inset) 0 0 0 var(--tw-ring-offset-width)
			var(--tw-ring-offset-color);
		--tw-ring-shadow: var(--tw-ring-inset) 0 0 0 calc(1px + var(--tw-ring-offset-width))
			var(--tw-ring-color);
		box-shadow: var(--tw-ring-offset-shadow), var(--tw-ring-shadow), var(--tw-shadow, 0 0 #0000);
		--tw-ring-inset: inset;
		--tw-ring-color: rgb(23 23 23 / 0.05);
		border-radius: 8px;
	}
	.variant-filled-error {
		--tw-bg-opacity: 1;
		background-color: rgb(212 25 118);
		color: white;
	}
	.pointer-events-auto {
		pointer-events: auto;
	}
	.fixed {
		position: fixed;
	}
	.left-0 {
		left: 0;
	}
	.top-0 {
		top: 0;
	}
	.flex {
		display: flex;
	}
	.grid {
		display: grid;
	}
	.h-screen {
		height: 100vh;
	}
	.w-screen {
		width: 100vw;
	}
	.grid-cols-2 {
		grid-template-columns: repeat(2, minmax(0, 1fr));
	}
	.items-start {
		align-items: flex-start;
	}
	.items-center {
		align-items: center;
	}
	.justify-end {
		justify-content: flex-end;
	}
	.justify-center {
		justify-content: center;
	}
	.gap-y-2 {
		row-gap: 0.5rem;
	}
	.bg-black\/50 {
		background-color: #00000080;
	}
	.p-5 {
		padding: 1.25rem;
	}
	.pt-40 {
		padding-top: 10rem;
	}
	.text-xl {
		font-size: 1.25rem;
		line-height: 1.75rem;
	}
	.font-bold {
		font-weight: 700;
	}
	.underline {
		text-decoration-line: underline;
	}
	.space-x-2 > :not([hidden]) ~ :not([hidden]) {
		--tw-space-x-reverse: 0;
		margin-right: calc(0.5rem * var(--tw-space-x-reverse));
		margin-left: calc(0.5rem * calc(1 - var(--tw-space-x-reverse)));
	}
</style>
