const walletModel = require("../models/walletModel");
const {LAMPORTS_PER_SOL} = require('@solana/web3.js');

const updateWallet = async (userId, walletAddress, cryptoType, amountInLamports) => { //side === 0 deposit, else withdraw
  const filter = {
    userId: userId,
    address: walletAddress,
  };

  const update = {
    balances: [
      {
        cryptoType: `${cryptoType}`,
        amount: amountInLamports,
      },
    ],
  };

  const updated = await walletModel.findOneAndUpdate(filter, update, { new: true });
  console.log(userId, walletAddress);
  console.log(updated);
};

module.exports = updateWallet;
