const walletModel = require("../models/walletModel");
const {LAMPORTS_PER_SOL} = require('@solana/web3.js');

const updateWallet = async (userId, walletAddress, tokenAddress, amountInLamports, side) => { //side === 0 deposit, else withdraw
  const filter = {
    userId: userId,
    address: walletAddress,
  };

  const wallet = await walletModel.findOne(filter);
  const prevAmount = wallet.balances[0].amount;

  let newAmount = 0;
  if(side === 0){
    newAmount = prevAmount + amountInLamports;
  }else{
    newAmount = prevAmount - amountInLamports;
  }

  const update = {
    balances: [
      {
        tokenAddress: `${tokenAddress}`,
        amount: newAmount,
      },
    ],
  };

  const updated = await walletModel.findOneAndUpdate(filter, update, { new: true });
  console.log(userId, walletAddress);
  console.log(updated);
};

module.exports = updateWallet;
