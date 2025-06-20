<!-- Advanced Usage Example with Transactions -->
<script lang="ts">
  import { 
    SuiModule, 
    ConnectButton, 
    account, 
    signAndExecuteTransaction,
    connectWithModal,
    disconnect 
  } from 'sui-svelte';
  import { Transaction } from '@mysten/sui/transactions';
  
  let transactionResult = $state<any>(null);
  let isLoading = $state(false);
  let error = $state<string | null>(null);
  let recipient = $state('0x1234...'); // Example recipient address
  let amount = $state(1000000); // 0.001 SUI in MIST
  
  const handleTransaction = async () => {
    if (!account.value) {
      error = 'Please connect your wallet first';
      return;
    }
    
    isLoading = true;
    error = null;
    transactionResult = null;
    
    try {
      const tx = new Transaction();
      
      // Transfer SUI to recipient
      tx.transferObjects(
        [tx.splitCoins(tx.gas, [amount])],
        recipient
      );
      
      const result = await signAndExecuteTransaction(tx);
      transactionResult = result;
    } catch (err: any) {
      error = err.message || 'Transaction failed';
    } finally {
      isLoading = false;
    }
  };
  
  const handleMoveCall = async () => {
    if (!account.value) {
      error = 'Please connect your wallet first';
      return;
    }
    
    isLoading = true;
    error = null;
    
    try {
      const tx = new Transaction();
      
      // Example Move call (replace with your contract details)
      tx.moveCall({
        target: '0x2::coin::split',
        arguments: [
          tx.object('0x123...'), // Coin object
          tx.pure.u64(1000000)   // Amount to split
        ],
        typeArguments: ['0x2::sui::SUI']
      });
      
      const result = await signAndExecuteTransaction(tx);
      transactionResult = result;
    } catch (err: any) {
      error = err.message || 'Move call failed';
    } finally {
      isLoading = false;
    }
  };
  
  const onWalletConnect = () => {
    console.log('Wallet connected successfully!');
    error = null;
  };
</script>

<SuiModule onConnect={onWalletConnect}>
  <div class="container">
    <header>
      <h1>Advanced Sui dApp</h1>
      <p>Example with transactions and Move calls</p>
    </header>
    
    <!-- Wallet Section -->
    <section class="wallet-section">
      <h2>Wallet Connection</h2>
      
      {#if account.value}
        <div class="connected">
          <div class="account-details">
            <h3>Connected Account</h3>
            <p><strong>Address:</strong> {account.value.address}</p>
            <p><strong>Label:</strong> {account.value.label || 'N/A'}</p>
            <p><strong>Chains:</strong> {account.value.chains.join(', ')}</p>
          </div>
          
          <div class="wallet-actions">
            <button class="btn btn-secondary" onclick={disconnect}>
              Disconnect
            </button>
          </div>
        </div>
      {:else}
        <div class="disconnected">
          <p>Connect your wallet to start using the dApp</p>
          <div class="connect-options">
            <ConnectButton class="btn btn-primary" />
            <button class="btn btn-outline" onclick={connectWithModal}>
              Connect with Modal
            </button>
          </div>
        </div>
      {/if}
    </section>
    
    <!-- Transaction Section -->
    {#if account.value}
      <section class="transaction-section">
        <h2>Transactions</h2>
        
        <!-- Transfer Form -->
        <div class="transaction-form">
          <h3>Transfer SUI</h3>
          <div class="form-group">
            <label for="recipient">Recipient Address:</label>
            <input 
              id="recipient"
              type="text" 
              bind:value={recipient}
              placeholder="0x..."
              class="input"
            />
          </div>
          
          <div class="form-group">
            <label for="amount">Amount (MIST):</label>
            <input 
              id="amount"
              type="number" 
              bind:value={amount}
              placeholder="1000000"
              class="input"
            />
          </div>
          
          <button 
            class="btn btn-success"
            onclick={handleTransaction}
            disabled={isLoading || !recipient}
          >
            {isLoading ? 'Sending...' : 'Send Transaction'}
          </button>
        </div>
        
        <!-- Move Call Example -->
        <div class="move-call">
          <h3>Move Call Example</h3>
          <p>Execute a Move function on the Sui blockchain</p>
          <button 
            class="btn btn-warning"
            onclick={handleMoveCall}
            disabled={isLoading}
          >
            {isLoading ? 'Executing...' : 'Execute Move Call'}
          </button>
        </div>
      </section>
    {/if}
    
    <!-- Results Section -->
    {#if error || transactionResult}
      <section class="results-section">
        {#if error}
          <div class="error">
            <h3>Error</h3>
            <p>{error}</p>
          </div>
        {/if}
        
        {#if transactionResult}
          <div class="success">
            <h3>Transaction Successful!</h3>
            <details>
              <summary>View Details</summary>
              <pre>{JSON.stringify(transactionResult, null, 2)}</pre>
            </details>
          </div>
        {/if}
      </section>
    {/if}
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
    color: #1e293b;
    margin-bottom: 0.5rem;
  }
  
  section {
    background: #f8fafc;
    border: 1px solid #e2e8f0;
    border-radius: 12px;
    padding: 2rem;
    margin-bottom: 2rem;
  }
  
  h2 {
    color: #334155;
    margin-bottom: 1.5rem;
    border-bottom: 2px solid #e2e8f0;
    padding-bottom: 0.5rem;
  }
  
  .account-details {
    background: white;
    padding: 1.5rem;
    border-radius: 8px;
    margin-bottom: 1rem;
  }
  
  .account-details p {
    margin: 0.5rem 0;
    font-family: monospace;
    font-size: 0.9rem;
  }
  
  .connect-options {
    display: flex;
    gap: 1rem;
    flex-wrap: wrap;
  }
  
  .wallet-actions {
    display: flex;
    justify-content: center;
  }
  
  .transaction-form, .move-call {
    background: white;
    padding: 1.5rem;
    border-radius: 8px;
    margin-bottom: 1rem;
  }
  
  .form-group {
    margin-bottom: 1rem;
  }
  
  .form-group label {
    display: block;
    margin-bottom: 0.5rem;
    font-weight: 600;
    color: #374151;
  }
  
  .input {
    width: 100%;
    padding: 0.75rem;
    border: 1px solid #d1d5db;
    border-radius: 6px;
    font-size: 1rem;
  }
  
  .input:focus {
    outline: none;
    border-color: #3b82f6;
    box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
  }
  
  /* Button Styles */
  .btn {
    padding: 0.75rem 1.5rem;
    border: none;
    border-radius: 6px;
    font-size: 1rem;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.2s;
    text-decoration: none;
    display: inline-block;
  }
  
  .btn:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
  
  .btn-primary {
    background: #3b82f6;
    color: white;
  }
  
  .btn-primary:hover:not(:disabled) {
    background: #2563eb;
  }
  
  .btn-secondary {
    background: #6b7280;
    color: white;
  }
  
  .btn-secondary:hover:not(:disabled) {
    background: #4b5563;
  }
  
  .btn-outline {
    background: transparent;
    color: #3b82f6;
    border: 2px solid #3b82f6;
  }
  
  .btn-outline:hover:not(:disabled) {
    background: #3b82f6;
    color: white;
  }
  
  .btn-success {
    background: #10b981;
    color: white;
  }
  
  .btn-success:hover:not(:disabled) {
    background: #059669;
  }
  
  .btn-warning {
    background: #f59e0b;
    color: white;
  }
  
  .btn-warning:hover:not(:disabled) {
    background: #d97706;
  }
  
  /* Results Styles */
  .error {
    background: #fef2f2;
    border: 1px solid #fecaca;
    color: #dc2626;
    padding: 1.5rem;
    border-radius: 8px;
  }
  
  .success {
    background: #f0fdf4;
    border: 1px solid #bbf7d0;
    color: #166534;
    padding: 1.5rem;
    border-radius: 8px;
  }
  
  pre {
    background: #1f2937;
    color: #f9fafb;
    padding: 1rem;
    border-radius: 6px;
    overflow-x: auto;
    font-size: 0.8rem;
    margin-top: 1rem;
  }
  
  details summary {
    cursor: pointer;
    font-weight: 600;
    margin-bottom: 0.5rem;
  }
</style>