const {Keypair} = require('@solana/web3.js');
const bs58 = require("bs58");
// const {ethers} = require('ethers');

// Create Solana wallet - No 1
createSolWallet = () => {
    const keypair = Keypair.generate();
    const publicKey = keypair.publicKey.toBase58();
    const privateKey = keypair.secretKey;
    return {privateKey, publicKey};
}

// Create EVM wallet - No 2
// export const createEVMWallet = () => {
//     const wallet = ethers.Wallet.createRandom();
//     return wallet;
// }

// Create BTC wallet

// Create XRP wallet

module.exports = createSolWallet;
