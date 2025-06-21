<script lang="ts">
	import { SuiModule, ConnectButton, account, connectWithModal, disconnect, signAndExecuteTransaction, signMessage, canSignMessage } from '$lib';
	import { Transaction } from '@mysten/sui/transactions';
	import { WalletRadar } from '@suiet/wallet-sdk';
	
	let transactionResult = $state<any>(null);
	let signatureResult = $state<any>(null);
	let isLoading = $state(false);
	let isSigningMessage = $state(false);
	let error = $state<string | null>(null);
	let detectedWallets = $state<string[]>([]);
	let message = $state('Hello, Sui blockchain!');

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

	const testSignMessage = async () => {
		if (!account.value) {
			error = 'Please connect your wallet first';
			return;
		}

		isSigningMessage = true;
		error = null;
		signatureResult = null;

		try {
			const result = await signMessage(message);
			signatureResult = result;
		} catch (err: any) {
			error = err.message || 'Message signing failed';
		} finally {
			isSigningMessage = false;
		}
	};

	const onConnect = () => {
		error = null;
		transactionResult = null;
		signatureResult = null;
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

		<div class="message-section">
			<h2>Message Signing</h2>
			{#if account.value}
				{#if canSignMessage()}
					<div class="message-input">
						<label for="message">Message to sign:</label>
						<input 
							id="message"
							type="text" 
							bind:value={message}
							placeholder="Enter message to sign"
							class="message-field"
						/>
					</div>
					<button 
						class="sign-btn" 
						onclick={testSignMessage}
						disabled={isSigningMessage}
					>
						{isSigningMessage ? 'Signing Message...' : 'Sign Message'}
					</button>
				{:else}
					<div class="warning-box">
						<h4>⚠️ Message Signing Not Supported</h4>
						<p>Your current wallet does not support message signing. This feature requires a wallet that implements the <code>sui:signMessage</code> standard.</p>
						<p><strong>Wallets that support message signing:</strong></p>
						<ul>
							<li>Suiet Wallet (latest version)</li>
							<li>Sui Wallet (official)</li>
							<li>Martian Wallet</li>
						</ul>
						<p>Please try connecting with a different wallet or check if your wallet has updates available.</p>
					</div>
				{/if}
			{:else}
				<p class="warning">Connect your wallet to sign messages</p>
			{/if}

			{#if signatureResult}
				<div class="result">
					<h4>Signature Result:</h4>
					<div class="signature-details">
						<p><strong>Original Message:</strong> {message}</p>
						<p><strong>Message Bytes:</strong> <code>{signatureResult.messageBytes}</code></p>
						<p><strong>Signature:</strong> <code class="signature">{signatureResult.signature}</code></p>
					</div>
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

	.wallet-section, .transaction-section, .message-section, .actions-section {
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

	.message-input {
		margin-bottom: 1rem;
	}

	.message-input label {
		display: block;
		margin-bottom: 0.5rem;
		font-weight: 600;
		color: #374151;
	}

	.message-field {
		width: 100%;
		padding: 0.75rem;
		border: 1px solid #d1d5db;
		border-radius: 6px;
		font-size: 1rem;
		font-family: inherit;
		transition: border-color 0.2s;
	}

	.message-field:focus {
		outline: none;
		border-color: #3b82f6;
		box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
	}

	.sign-btn {
		background: #8b5cf6;
		color: white;
		border: none;
		padding: 0.75rem 1.5rem;
		border-radius: 6px;
		font-size: 1rem;
		cursor: pointer;
		transition: all 0.2s;
	}

	.sign-btn:hover:not(:disabled) {
		background: #7c3aed;
	}

	.sign-btn:disabled {
		background: #9ca3af;
		cursor: not-allowed;
	}

	.signature-details {
		background: white;
		padding: 1rem;
		border-radius: 4px;
		margin-top: 0.5rem;
	}

	.signature-details p {
		margin: 0.5rem 0;
		word-break: break-all;
	}

	.signature-details code {
		background: #f3f4f6;
		padding: 0.25rem 0.5rem;
		border-radius: 3px;
		font-size: 0.8rem;
	}

	.signature {
		display: block;
		max-width: 100%;
		overflow-wrap: break-word;
	}

	.warning-box {
		background: #fef3c7;
		border: 1px solid #f59e0b;
		border-radius: 6px;
		padding: 1.5rem;
		color: #92400e;
	}

	.warning-box h4 {
		margin-top: 0;
		margin-bottom: 1rem;
		color: #b45309;
	}

	.warning-box p {
		margin: 0.75rem 0;
		line-height: 1.6;
	}

	.warning-box ul {
		margin: 0.5rem 0;
		padding-left: 1.5rem;
	}

	.warning-box li {
		margin: 0.25rem 0;
	}

	.warning-box code {
		background: #fbbf24;
		color: #78350f;
		padding: 0.125rem 0.25rem;
		border-radius: 3px;
		font-size: 0.875rem;
	}
</style>
