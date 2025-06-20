# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.0.0] - 2025-01-20

### Added
- Initial release of Sui Svelte library
- `SuiModule` component for wallet state management
- `ConnectButton` component for easy wallet connection
- `ConnectModal` component for wallet selection
- Full TypeScript support with complete type definitions
- Svelte 5 compatibility with runes and modern features
- Support for all major Sui wallets (Sui Wallet, Suiet, Slush, etc.)
- Transaction signing and execution capabilities
- Responsive wallet selection modal
- Comprehensive documentation and examples
- NPM package configuration for easy installation

### Components
- **SuiModule**: Main wrapper component providing wallet context
- **ConnectButton**: Pre-styled button for wallet connection/disconnection  
- **ConnectModal**: Modal for wallet selection with automatic wallet detection

### Functions
- `connectWithModal()`: Opens wallet selection modal
- `connect(wallet)`: Connects to specific wallet
- `disconnect()`: Disconnects current wallet
- `signAndExecuteTransaction(tx)`: Signs and executes transactions
- `account`: Reactive state for wallet account information

### Features
- Automatic wallet detection and filtering
- Enhanced wallet support including Slush wallet recognition
- Error handling and loading states
- Custom styling support
- Mobile-friendly responsive design
- TypeScript definitions for all exports
- Comprehensive examples and documentation

### Development
- Built with SvelteKit and Vite
- Full TypeScript configuration
- ESLint and Prettier setup
- Automated building and packaging
- NPM publish ready configuration