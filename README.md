# Sui Svelte

A comprehensive Svelte library for building dApps on the Sui blockchain. This library provides easy-to-use components and utilities for wallet connection, transaction signing, and account management in Svelte applications.

## Features

- 🔌 **Easy Wallet Connection** - Support for all major Sui wallets (Sui Wallet, Suiet, Slush, etc.)
- 🎨 **Pre-built Components** - Ready-to-use Connect Button and Modal components
- 📱 **Responsive Design** - Mobile-friendly wallet selection modal
- 🔐 **Secure Transactions** - Built-in transaction signing and execution
- 🎯 **Type-Safe** - Full TypeScript support
- ⚡ **Svelte 5 Ready** - Built with the latest Svelte features (runes, snippets)

## Installation

```bash
npm install sui-svelte
# or
pnpm install sui-svelte
# or
yarn add sui-svelte
```

### Peer Dependencies

Make sure you have the required peer dependencies installed:

```bash
npm install svelte@^5.0.0
```

## Quick Start

### 1. Basic Setup

Wrap your app with the `SuiModule` component:

```svelte
<script>
  import { SuiModule, ConnectButton } from 'sui-svelte';
</script>

<SuiModule>
  <h1>My Sui dApp</h1>
  <ConnectButton />
</SuiModule>
```

### 2. Using the Connect Button

The simplest way to add wallet connection:

```svelte
<script>
  import { ConnectButton } from 'sui-svelte';
</script>

<ConnectButton class="my-custom-class" style="color: blue;" />
```

### 3. Custom Connection Logic

```svelte
<script>
  import { SuiModule, connectWithModal, disconnect, account } from 'sui-svelte';
  
  const handleConnect = async () => {
    await connectWithModal();
  };
  
  const handleDisconnect = () => {
    disconnect();
  };
</script>

<SuiModule>
  {#if account.value}
    <p>Connected: {account.value.address}</p>
    <button onclick={handleDisconnect}>Disconnect</button>
  {:else}
    <button onclick={handleConnect}>Connect Wallet</button>
  {/if}
</SuiModule>
```

## Components

### SuiModule

The main wrapper component that provides wallet connection state and functionality.

```svelte
<script>
  import { SuiModule } from 'sui-svelte';
  
  const onConnect = () => {
    console.log('Wallet connected!');
  };
</script>

<SuiModule {onConnect}>
  <!-- Your app content -->
</SuiModule>
```

**Props:**
- `onConnect?: () => void` - Callback when wallet successfully connects

### ConnectButton

A pre-styled button that handles wallet connection/disconnection.

```svelte
<script>
  import { ConnectButton } from 'sui-svelte';
</script>

<ConnectButton 
  class="btn btn-primary" 
  style="padding: 12px 24px;" 
/>
```

**Props:**
- `class?: string` - CSS classes to apply
- `style?: string` - Inline styles

### ConnectModal

A modal component for wallet selection (used internally by other components).

```svelte
<script>
  import { ConnectModal } from 'sui-svelte';
  
  let modal;
  let availableWallets = []; // Your wallet list
  
  const openModal = async () => {
    const selectedWallet = await modal.openAndWaitForResponse();
    console.log('Selected:', selectedWallet);
  };
</script>

<ConnectModal 
  bind:this={modal}
  {availableWallets}
  isCustom={false}
/>
```

## API Reference

### Functions

#### `connectWithModal()`
Opens the wallet selection modal and connects to the selected wallet.

```svelte
<script>
  import { connectWithModal } from 'sui-svelte';
  
  const connect = async () => {
    await connectWithModal();
  };
</script>
```

#### `connect(wallet: IWallet)`
Connects to a specific wallet directly.

```svelte
<script>
  import { connect } from 'sui-svelte';
  
  const connectToWallet = async (wallet) => {
    await connect(wallet);
  };
</script>
```

#### `disconnect()`
Disconnects the current wallet.

```svelte
<script>
  import { disconnect } from 'sui-svelte';
  
  const handleDisconnect = () => {
    disconnect();
  };
</script>
```

#### `signAndExecuteTransaction(transaction: Transaction)`
Signs and executes a transaction with the connected wallet.

```svelte
<script>
  import { signAndExecuteTransaction } from 'sui-svelte';
  import { Transaction } from '@mysten/sui/transactions';
  
  const sendTransaction = async () => {
    const tx = new Transaction();
    // ... build your transaction
    
    try {
      const result = await signAndExecuteTransaction(tx);
      console.log('Transaction result:', result);
    } catch (error) {
      console.error('Transaction failed:', error);
    }
  };
</script>
```

### State

#### `account`
Reactive account information for the connected wallet.

```svelte
<script>
  import { account } from 'sui-svelte';
</script>

{#if account.value}
  <div>
    <p>Address: {account.value.address}</p>
    <p>Label: {account.value.label || 'N/A'}</p>
    <p>Chains: {account.value.chains.join(', ')}</p>
  </div>
{:else}
  <p>No wallet connected</p>
{/if}
```

## Advanced Usage

### Custom Modal

You can create a custom wallet selection modal:

```svelte
<script>
  import { SuiModule } from 'sui-svelte';
</script>

<SuiModule>
  <slot name="modal">
    <!-- Your custom modal content -->
    <div class="custom-modal">
      <h2>Choose Your Wallet</h2>
      <!-- Custom wallet selection UI -->
    </div>
  </slot>
  
  <!-- Your app content -->
</SuiModule>
```

### Transaction Examples

#### Simple Transfer

```svelte
<script>
  import { signAndExecuteTransaction, account } from 'sui-svelte';
  import { Transaction } from '@mysten/sui/transactions';
  
  const transferSui = async (recipient, amount) => {
    if (!account.value) throw new Error('No wallet connected');
    
    const tx = new Transaction();
    tx.transferObjects(
      [tx.splitCoins(tx.gas, [amount])],
      recipient
    );
    
    const result = await signAndExecuteTransaction(tx);
    return result;
  };
</script>
```

#### Move Call

```svelte
<script>
  import { signAndExecuteTransaction } from 'sui-svelte';
  import { Transaction } from '@mysten/sui/transactions';
  
  const callMoveFunction = async () => {
    const tx = new Transaction();
    tx.moveCall({
      target: 'package::module::function',
      arguments: [/* your arguments */],
    });
    
    const result = await signAndExecuteTransaction(tx);
    return result;
  };
</script>
```

## Styling

The components come with basic styling that you can customize:

### Override Default Styles

```css
/* Your global styles */
.connect-button {
  background: linear-gradient(45deg, #667eea 0%, #764ba2 100%);
  border: none;
  border-radius: 8px;
  color: white;
  padding: 12px 24px;
  font-weight: 600;
  cursor: pointer;
  transition: transform 0.2s;
}

.connect-button:hover {
  transform: translateY(-2px);
}
```

### Custom Modal Styling

```svelte
<style>
  :global(.sui-modal) {
    /* Custom modal styles */
  }
  
  :global(.wallet-item) {
    /* Custom wallet item styles */
  }
</style>
```

## Supported Wallets

- **Sui Wallet** (Official Sui wallet)
- **Suiet** (Popular community wallet)
- **Slush** (Formerly Sui Wallet, by Mysten Labs)
- **Ethos** (Ethos wallet)
- **Surf** (Surf wallet)
- **Glass** (Glass wallet)
- And more...

The library automatically detects installed wallets and displays them in the connection modal.

## TypeScript Support

This library is built with TypeScript and provides full type definitions:

```typescript
import type { IWallet, WalletAccount } from 'sui-svelte';
import type { SuiSignAndExecuteTransactionOutput } from '@mysten/wallet-standard';

// All exports are fully typed
const handleTransaction = async (): Promise<SuiSignAndExecuteTransactionOutput> => {
  // Type-safe transaction handling
};
```

## Examples

Check out the `/src/routes/+page.svelte` file for a complete working example with:

- Wallet connection
- Account information display
- Transaction signing
- Error handling
- Loading states

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

MIT License - see LICENSE file for details.

## Support

- **Documentation**: [GitHub Repository](https://github.com/your-username/sui-svelte)
- **Issues**: [Report bugs](https://github.com/your-username/sui-svelte/issues)
- **Discord**: [Sui Developer Community](https://discord.gg/sui)

## Development

### Building the Library

```bash
# Install dependencies
pnpm install

# Build the library
pnpm run prepack

# Check if ready for publication
./scripts/publish-check.sh
```

### Publishing to NPM

1. **Update package details** in `package.json`:
   - Change `author` field
   - Update `repository` URLs  
   - Verify `name` is available on NPM

2. **Build and test**:
   ```bash
   pnpm run prepack
   ./scripts/publish-check.sh
   ```

3. **Publish**:
   ```bash
   npm login
   npm publish
   ```

## Changelog

### v1.0.0
- Initial release
- Basic wallet connection
- Transaction signing
- Svelte 5 support
- TypeScript definitions