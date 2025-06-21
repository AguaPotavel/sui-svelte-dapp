import {
	getAvailableWallets,
	connectToWallet,
	disconnectWallet,
	signAndExecuteTransactionHeadless,
	signMessageHeadless,
	canSignMessageHeadless,
	openWalletSelectionModal,
	connectWithModalHeadless
} from 'sui-svelte-dapp';

// Exemplo 1: Listar carteiras disponíveis
function listAvailableWallets() {
	const wallets = getAvailableWallets();
	console.log('Carteiras disponíveis:', wallets);
	
	wallets.forEach(wallet => {
		console.log(`- ${wallet.name}: ${wallet.installed ? 'Instalada' : 'Não instalada'}`);
	});
	
	return wallets;
}

// Exemplo 2: Conectar a uma carteira específica
async function connectToSpecificWallet() {
	const wallets = getAvailableWallets();
	
	if (wallets.length === 0) {
		console.log('Nenhuma carteira encontrada');
		return;
	}
	
	// Conecta à primeira carteira disponível
	const result = await connectToWallet(wallets[0]);
	
	if (result.success) {
		console.log('Conectado com sucesso!');
		console.log('Endereço da conta:', result.account.address);
		
		// Salvar adapter para uso posterior
		window.currentWalletAdapter = result.adapter;
		window.currentAccount = result.account;
		
		return result;
	} else {
		console.error('Erro ao conectar:', result.error);
	}
}

// Exemplo 3: Abrir modal de seleção de carteira
async function openWalletModal() {
	const selectedWallet = await openWalletSelectionModal();
	
	if (selectedWallet) {
		console.log('Carteira selecionada:', selectedWallet.name);
		
		// Conectar à carteira selecionada
		const result = await connectToWallet(selectedWallet);
		
		if (result.success) {
			console.log('Conectado com sucesso!');
			window.currentWalletAdapter = result.adapter;
			window.currentAccount = result.account;
		}
		
		return result;
	} else {
		console.log('Usuário cancelou a seleção');
	}
}

// Exemplo 4: Conectar com modal automático
async function connectWithAutoModal() {
	const result = await connectWithModalHeadless();
	
	if (result.success) {
		console.log('Conectado via modal!');
		console.log('Carteira:', result.wallet.name);
		console.log('Conta:', result.account.address);
		
		window.currentWalletAdapter = result.adapter;
		window.currentAccount = result.account;
		
		return result;
	} else {
		console.error('Erro na conexão:', result.error);
	}
}

// Exemplo 5: Assinar mensagem
async function signMessage(message) {
	if (!window.currentWalletAdapter || !window.currentAccount) {
		console.error('Carteira não conectada');
		return;
	}
	
	try {
		const result = await signMessageHeadless(
			message,
			window.currentAccount,
			window.currentWalletAdapter
		);
		
		console.log('Mensagem assinada:');
		console.log('Assinatura:', result.signature);
		console.log('Mensagem em bytes:', result.messageBytes);
		
		return result;
	} catch (error) {
		console.error('Erro ao assinar mensagem:', error.message);
	}
}

// Exemplo 6: Verificar se pode assinar mensagens
function checkCanSignMessage() {
	const canSign = canSignMessageHeadless(window.currentWalletAdapter);
	console.log('Pode assinar mensagens:', canSign);
	return canSign;
}

// Exemplo 7: Desconectar carteira
function disconnect() {
	if (window.currentWalletAdapter) {
		disconnectWallet(window.currentWalletAdapter);
		window.currentWalletAdapter = null;
		window.currentAccount = null;
		console.log('Desconectado da carteira');
	}
}

// Exemplo 8: Criar componente personalizado
function createCustomWalletButton() {
	const button = document.createElement('button');
	button.textContent = 'Conectar Carteira';
	button.style.cssText = `
		background: #3b82f6;
		color: white;
		border: none;
		padding: 12px 24px;
		border-radius: 8px;
		cursor: pointer;
		font-size: 16px;
	`;
	
	button.onclick = async () => {
		button.textContent = 'Conectando...';
		button.disabled = true;
		
		const result = await connectWithAutoModal();
		
		if (result.success) {
			button.textContent = `Conectado: ${result.account.address.slice(0, 6)}...`;
			button.onclick = disconnect;
		} else {
			button.textContent = 'Conectar Carteira';
			button.disabled = false;
		}
	};
	
	return button;
}

// Exemplo 9: Lista de carteiras personalizada
function createCustomWalletList() {
	const container = document.createElement('div');
	const wallets = getAvailableWallets();
	
	const title = document.createElement('h3');
	title.textContent = 'Selecione uma carteira:';
	container.appendChild(title);
	
	wallets.forEach(wallet => {
		const button = document.createElement('button');
		button.style.cssText = `
			display: flex;
			align-items: center;
			gap: 12px;
			padding: 12px;
			margin: 8px 0;
			border: 1px solid #e5e7eb;
			border-radius: 8px;
			background: white;
			cursor: pointer;
			width: 100%;
		`;
		
		button.innerHTML = `
			<img src="${wallet.iconUrl}" alt="${wallet.name}" style="width: 24px; height: 24px;">
			<span>${wallet.name}</span>
		`;
		
		button.onclick = async () => {
			const result = await connectToWallet(wallet);
			if (result.success) {
				alert(`Conectado a ${wallet.name}!`);
				window.currentWalletAdapter = result.adapter;
				window.currentAccount = result.account;
			}
		};
		
		container.appendChild(button);
	});
	
	return container;
}

// Exportar exemplos para uso
window.walletExamples = {
	listAvailableWallets,
	connectToSpecificWallet,
	openWalletModal,
	connectWithAutoModal,
	signMessage,
	checkCanSignMessage,
	disconnect,
	createCustomWalletButton,
	createCustomWalletList
};

console.log('Exemplos de uso headless carregados! Use window.walletExamples para testar.');