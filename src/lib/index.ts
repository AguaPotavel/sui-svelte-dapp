// Reexport your entry components here
export { ConnectButton } from './ConnectButton/index.js';
export { ConnectModal } from './ConnectModal/index.js';
export { SuiModule, account, connectWithModal, connect, disconnect, signAndExecuteTransaction, signMessage, canSignMessage } from './SuiModule/index.js';

// Headless wallet methods (also available from SuiModule)
export {
	getAvailableWallets,
	connectToWallet,
	disconnectWallet,
	signAndExecuteTransactionHeadless,
	signMessageHeadless,
	canSignMessageHeadless,
	openWalletSelectionModal,
	connectWithModalHeadless
} from './SuiModule/headless.js';
