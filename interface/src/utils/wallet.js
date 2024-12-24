import {ethers} from "ethers";

export async function getSigner(wallet_type) {
    let provider;
    let signer;
    switch (wallet_type) {
        case 'metamask':
            if (window.ethereum && window.ethereum.isMetaMask) {
                provider = new ethers.BrowserProvider(window.ethereum);
                // 请求用户连接钱包
                await window.ethereum.request({method: 'eth_requestAccounts'});
            } else {
                // 弹出新窗口到 MetaMask 官网
                window.open('https://metamask.io/', '_blank');
                console.error('MetaMask is not installed!');
            }
            break;
        case 'okx':
            if (window.okxwallet) {
                provider = new ethers.BrowserProvider(window.okxwallet);
                await window.okxwallet.request({method: 'eth_requestAccounts'});
            } else {
                // 弹出新窗口到 OKX 官网
                window.open('https://www.okx.com/', '_blank');
                console.error('OKX Wallet is not installed!');
            }
            break;
        case 'gate':
            if (window.gatewallet) {
                provider = new ethers.BrowserProvider(window.gatewallet);
                await window.gatewallet.request({method: 'eth_requestAccounts'});
            } else {
                // 弹出新窗口到 Gate Wallet 官网
                window.open('https://www.gate.io/', '_blank');
                console.error('Gate Wallet is not installed!');
            }
            break;
        default:
            console.error('Unsupported wallet type!');
            break;
    }

    if (provider) {
        // const chainId = 56; // BSC mainnet chain ID
        // await provider.send('wallet_switchEthereumChain', [{chainId: '0x38'}]);
    }
    if (provider) {
        const accounts = await provider.send("eth_requestAccounts", []);
         signer = await provider.getSigner();
    }

    return [
        provider,
        signer
    ]
}