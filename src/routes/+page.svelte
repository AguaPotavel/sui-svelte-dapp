<script lang="ts">
	import { SuiModule, ConnectButton, account, connectWithModal, disconnect, signAndExecuteTransaction } from '$lib';
	import { Transaction } from '@mysten/sui/transactions';
	import { WalletRadar } from '@suiet/wallet-sdk';
	
	let transactionResult = $state<any>(null);
	let isLoading = $state(false);
	let error = $state<string | null>(null);
	let detectedWallets = $state<string[]>([]);

	const testTransaction = async () => {
		if (!account.value) {
			error = 'Please connect your wallet first';
			return;
		}

		isLoading = true;
		error = null;
		transactionResult = null;

		try {
			// Create a simple test transaction (transfer 0 SUI to self)
			const tx = new Transaction();
			tx.transferObjects(
				[tx.splitCoins(tx.gas, [0])],
				account.value.address
			);

			const result = await signAndExecuteTransaction(tx);
			transactionResult = result;
		} catch (err: any) {
			error = err.message || 'Transaction failed';
		} finally {
			isLoading = false;
		}
	};

	const onConnect = () => {
		error = null;
		transactionResult = null;
	};

	const checkDetectedWallets = () => {
		const walletRadar = new WalletRadar();
		walletRadar.activate();
		const adapters = walletRadar.getDetectedWalletAdapters();
		detectedWallets = adapters.map(adapter => adapter.name);
		walletRadar.deactivate();
		console.log('Manual wallet check:', detectedWallets);
	};
</script>

<SuiModule {onConnect}>
	<div class="container">
		<header>
			<h1>Sui Svelte Library Test</h1>
			<p>Test the wallet connection and transaction signing functionality</p>
		</header>

		<div class="wallet-section">
			<h2>Wallet Connection</h2>
			<ConnectButton class="connect-btn" />
			
			{#if account.value}
				<div class="account-info">
					<h3>Connected Account</h3>
					<p><strong>Address:</strong> {account.value.address}</p>
					<p><strong>Label:</strong> {account.value.label || 'N/A'}</p>
					<p><strong>Chains:</strong> {account.value.chains.join(', ')}</p>
				</div>
			{/if}
		</div>

		<div class="transaction-section">
			<h2>Transaction Testing</h2>
			{#if account.value}
				<button 
					class="test-btn" 
					onclick={testTransaction}
					disabled={isLoading}
				>
					{isLoading ? 'Signing Transaction...' : 'Test Transaction (0 SUI transfer)'}
				</button>
			{:else}
				<p class="warning">Connect your wallet to test transactions</p>
			{/if}

			{#if error}
				<div class="error">
					<h4>Error:</h4>
					<p>{error}</p>
				</div>
			{/if}

			{#if transactionResult}
				<div class="result">
					<h4>Transaction Result:</h4>
					<pre>{JSON.stringify(transactionResult, null, 2)}</pre>
				</div>
			{/if}
		</div>

		<div class="actions-section">
			<h2>Available Actions</h2>
			<div class="action-buttons">
				<button class="action-btn" onclick={connectWithModal}>Connect with Modal</button>
				<button class="action-btn" onclick={disconnect} disabled={!account.value}>Disconnect</button>
				<button class="action-btn" onclick={checkDetectedWallets}>Check Detected Wallets</button>
			</div>
			
			{#if detectedWallets.length > 0}
				<div class="detected-wallets">
					<h4>Manually Detected Wallets:</h4>
					<ul>
						{#each detectedWallets as wallet}
							<li>{wallet}</li>
						{/each}
					</ul>
				</div>
			{/if}
		</div>
	</div>
</SuiModule>

<style>
	.container {
		max-width: 800px;
		margin: 0 auto;
		padding: 2rem;
		font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
	}

	header {
		text-align: center;
		margin-bottom: 3rem;
	}

	h1 {
		color: #2563eb;
		margin-bottom: 0.5rem;
	}

	.wallet-section, .transaction-section, .actions-section {
		background: #f8fafc;
		border: 1px solid #e2e8f0;
		border-radius: 8px;
		padding: 1.5rem;
		margin-bottom: 2rem;
	}

	h2 {
		color: #1e293b;
		margin-bottom: 1rem;
		border-bottom: 2px solid #e2e8f0;
		padding-bottom: 0.5rem;
	}

	.connect-btn {
		background: #3b82f6;
		color: white;
		border: none;
		padding: 0.75rem 1.5rem;
		border-radius: 6px;
		font-size: 1rem;
		cursor: pointer;
		transition: background-color 0.2s;
	}

	.connect-btn:hover {
		background: #2563eb;
	}

	.account-info {
		margin-top: 1rem;
		padding: 1rem;
		background: white;
		border-radius: 6px;
		border: 1px solid #d1d5db;
	}

	.account-info h3 {
		color: #059669;
		margin-bottom: 0.5rem;
	}

	.account-info p {
		margin: 0.25rem 0;
		font-family: monospace;
		font-size: 0.9rem;
	}

	.test-btn {
		background: #10b981;
		color: white;
		border: none;
		padding: 0.75rem 1.5rem;
		border-radius: 6px;
		font-size: 1rem;
		cursor: pointer;
		transition: all 0.2s;
	}

	.test-btn:hover:not(:disabled) {
		background: #059669;
	}

	.test-btn:disabled {
		background: #9ca3af;
		cursor: not-allowed;
	}

	.warning {
		color: #f59e0b;
		font-style: italic;
	}

	.error {
		background: #fef2f2;
		border: 1px solid #fecaca;
		color: #dc2626;
		padding: 1rem;
		border-radius: 6px;
		margin-top: 1rem;
	}

	.result {
		background: #f0fdf4;
		border: 1px solid #bbf7d0;
		color: #166534;
		padding: 1rem;
		border-radius: 6px;
		margin-top: 1rem;
	}

	.result pre {
		background: white;
		padding: 1rem;
		border-radius: 4px;
		overflow-x: auto;
		font-size: 0.8rem;
		margin-top: 0.5rem;
	}

	.action-buttons {
		display: flex;
		gap: 1rem;
		flex-wrap: wrap;
	}

	.action-btn {
		background: #6366f1;
		color: white;
		border: none;
		padding: 0.5rem 1rem;
		border-radius: 6px;
		cursor: pointer;
		transition: background-color 0.2s;
	}

	.action-btn:hover:not(:disabled) {
		background: #4f46e5;
	}

	.action-btn:disabled {
		background: #9ca3af;
		cursor: not-allowed;
	}

	.detected-wallets {
		margin-top: 1rem;
		padding: 1rem;
		background: white;
		border-radius: 6px;
		border: 1px solid #d1d5db;
	}

	.detected-wallets h4 {
		color: #374151;
		margin-bottom: 0.5rem;
	}

	.detected-wallets ul {
		margin: 0;
		padding-left: 1.5rem;
	}

	.detected-wallets li {
		margin: 0.25rem 0;
		font-family: monospace;
	}
</style>
