
export const BondingCurveAbi = [{
    "inputs": [{
        "internalType": "uint256",
        "name": "_a",
        "type": "uint256"
    }, {"internalType": "uint256", "name": "_b", "type": "uint256"}],
    "stateMutability": "nonpayable",
    "type": "constructor"
}, {
    "inputs": [],
    "name": "A",
    "outputs": [{"internalType": "uint256", "name": "", "type": "uint256"}],
    "stateMutability": "view",
    "type": "function"
}, {
    "inputs": [],
    "name": "B",
    "outputs": [{"internalType": "uint256", "name": "", "type": "uint256"}],
    "stateMutability": "view",
    "type": "function"
}, {
    "inputs": [{"internalType": "uint256", "name": "x0", "type": "uint256"}, {
        "internalType": "uint256",
        "name": "deltaY",
        "type": "uint256"
    }],
    "name": "getAmountOut",
    "outputs": [{"internalType": "uint256", "name": "deltaX", "type": "uint256"}],
    "stateMutability": "view",
    "type": "function"
}, {
    "inputs": [{"internalType": "uint256", "name": "x0", "type": "uint256"}, {
        "internalType": "uint256",
        "name": "deltaX",
        "type": "uint256"
    }],
    "name": "getFundsReceived",
    "outputs": [{"internalType": "uint256", "name": "deltaY", "type": "uint256"}],
    "stateMutability": "view",
    "type": "function"
}];