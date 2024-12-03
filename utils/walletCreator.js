const { Keypair } = require('@solana/web3.js');
// const {ethers} = require('ethers');

// Create Solana wallet - No 1
export const createSolWallet = () => {
    const keypair = Keypair.generate();
    const publickKey = keypair.publickKey.toBase58();
    const privateKey = keypair.secretKey;
    return {privateKey, publickKey};
}

// Create EVM wallet - No 2
// export const createEVMWallet = () => {
//     const wallet = ethers.Wallet.createRandom();
//     return wallet;
// }

// Create BTC wallet

// Create XRP wallet
