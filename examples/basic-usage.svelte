<!-- Basic Usage Example -->
<script lang="ts">
  import { SuiModule, ConnectButton, account } from 'sui-svelte';
</script>

<SuiModule>
  <div class="app">
    <h1>My Sui dApp</h1>
    
    <!-- Simple wallet connection -->
    <ConnectButton class="connect-btn" />
    
    <!-- Display wallet info when connected -->
    {#if account.value}
      <div class="wallet-info">
        <h2>Wallet Connected!</h2>
        <p>Address: {account.value.address}</p>
        <p>Chains: {account.value.chains.join(', ')}</p>
      </div>
    {/if}
  </div>
</SuiModule>

<style>
  .app {
    max-width: 600px;
    margin: 0 auto;
    padding: 2rem;
    text-align: center;
  }
  
  .connect-btn {
    background: #3b82f6;
    color: white;
    border: none;
    padding: 12px 24px;
    border-radius: 8px;
    cursor: pointer;
    font-size: 1rem;
  }
  
  .wallet-info {
    margin-top: 2rem;
    padding: 1rem;
    background: #f3f4f6;
    border-radius: 8px;
  }
</style>