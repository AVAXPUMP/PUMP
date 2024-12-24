import {createStore} from 'vuex'
import {ethers} from "ethers";
import axios from "@/utils/axios";
import {ChainId} from "@uniswap/sdk-core";

export const factory_address = "0xcc2efEC49DD1Df0845536419639B4Ee6Df1e82Ec";
export const uni_router_address = "0x4752ba5dbc23f44d87826276bf6fd6b1c372ad24";
export const uni_factory_address = "0x9e5A52f57b3038F1B8EeE45F28b3C1967e22799C"
export const weth_address = "0x4200000000000000000000000000000000000006"
export const FUNDING_GOAL = 6;

export default createStore({
    state: {
        wallet_address: "",
        signger: null,
        wallet_type: null,
    },
    getters: {},
    mutations: {
        SET_WALLET_ADDRESS(state, address) {
            state.wallet_address = address
        },
        SET_SIGNER(state, signer) {
            state.signger = signer
        },
        SET_WALLET_TYPE(state, wallet_type) {
            state.wallet_type = wallet_type
        }
    },
    actions: {
        async connect_wallet({commit}, wallet_type) {

            console.log("wallet_type", wallet_type)

            let provider;
            let signer;
            let address;

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
                const chainId = ChainId.AVALANCHE; // BSC mainnet chain ID
                //
                await provider.send('wallet_switchEthereumChain', [{chainId: '0xa86a'}]);
            }
            if (provider) {
                const accounts = await provider.send("eth_requestAccounts", []);
                signer = await provider.getSigner();
                console.log('signer', signer)
                address = accounts[0];
                console.log('accounts', accounts);

                //保存 address 到 state的 wallet_address
                commit('SET_WALLET_ADDRESS', address)

                //保存 signer 到 state的 signger
                commit('SET_SIGNER', signer)

                commit('SET_WALLET_TYPE', wallet_type)


                const invitor = localStorage.getItem("invitor")
                // if (invitor) {
                console.log("invitor", invitor)
                axios.post('/api/create_user', {
                    wallet: address,
                    invitor: invitor
                })
                // }


            }
        },
    },
    modules: {}
})
