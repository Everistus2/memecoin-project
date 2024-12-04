const walletModel = require("../models/walletModel");
const {LAMPORTS_PER_SOL} = require('@solana/web3.js');

const getPrivateKey = async (userId, walletAddress) => {
    const user = await walletModel.findOne({ userId: userId, address: walletAddress });
    const privateKey = user.privateKey.split(',').map(Number);
    return privateKey;
}

const getBalanceFromDB = async (userId, walletAddress, cryptoType) => {
    const user = await walletModel.findOne({ userId: userId, address: walletAddress });
    let balance = user.balances[0].amount;
    balance = balance/LAMPORTS_PER_SOL;
    return balance;
}

module.exports = {
    getPrivateKey,
    getBalanceFromDB
};