const walletModel = require("../models/walletModel");
const {LAMPORTS_PER_SOL} = require('@solana/web3.js');

const getPrivateKey = async (userId, walletAddress) => {
    const user = await walletModel.findOne({ userId: userId, address: walletAddress });
    const privateKey = user.privateKey.split(',').map(Number);
    return privateKey;
}

const getBalanceFromDB = async (userId, walletAddress, tokenAddress) => {
    const user = await walletModel.findOne({ userId: userId, address: walletAddress });
    let balance = user.balances[0].amount;
    balance = balance/LAMPORTS_PER_SOL;
    return balance;
}

const { AMM_V4, AMM_STABLE, DEVNET_PROGRAM_ID } = require('@raydium-io/raydium-sdk-v2')

const VALID_PROGRAM_ID = new Set([
  AMM_V4.toBase58(),
  AMM_STABLE.toBase58(),
  DEVNET_PROGRAM_ID.AmmV4.toBase58(),
  DEVNET_PROGRAM_ID.AmmStable.toBase58(),
])

const isValidAmm = (id) => VALID_PROGRAM_ID.has(id)

module.exports = {
    getPrivateKey,
    getBalanceFromDB,
    isValidAmm
};