const walletModel = require("../models/walletModel");
const createSolWallet = require("../utils/walletCreator");
const updateWallet = require("../utils/updateWallet");
const { getPrivateKey, getBalanceFromDB } = require("../utils/utils");
const { checkBalance, transferSOL } = require("../utils/transfer");
const bs58 = require("bs58");
const swap = require("../utils/trade");

const {Keypair, PublicKey, LAMPORTS_PER_SOL } = require("@solana/web3.js");

const createWallet = async (req, res) => {
  try {
    const keypair = createSolWallet();
    const solWallet = new walletModel({
      userId: req.user._id,
      privateKey: keypair.privateKey,
      address: keypair.publicKey,
      balances: [{ token: "So11111111111111111111111111111111111111112", amount: 0 }],
    });
    await solWallet.save();

    res.status(200).send({
      message: "Wallet created successfully",
      address: keypair.publicKey,
    });
  } catch (err) {
    console.log("wallet creation error:", err);
  }
};

const deposit = async (req, res) => {
  try {
    const userId = req.user._id;
    let { walletAddress, tokenAddress, amount } = req.body.data;
    walletAddress = new PublicKey(walletAddress);
    const balance = await checkBalance(walletAddress);

    if (balance < amount) {
      res.status(424).send({
        message: "Balance is inefficient",
      });
      return;
    }

    const privateKey = await getPrivateKey(userId, walletAddress);
    const senderKeypair = Keypair.fromSecretKey(Uint8Array.from(privateKey));
    const hotWalletAddress = new PublicKey(process.env.MASTER_WALLET_ADDRESS);
    const feeInLamports = await transferSOL(senderKeypair, hotWalletAddress, amount, 0);
    await updateWallet(
      userId,
      walletAddress,
      tokenAddress,
      amount * LAMPORTS_PER_SOL - feeInLamports,
      0
    );
    res.status(200).send({
      message: `${amount - feeInLamports / LAMPORTS_PER_SOL}SOL transfered successfully`,
    });
  } catch (err) {
    console.log("deposit error:", err);
  }
};

const withdraw = async (req, res) => {
  try {
    const userId = req.user._id;
    let { walletAddress, tokenAddress, amount } = req.body.data;
    const balance = await getBalanceFromDB(userId, walletAddress, tokenAddress);

    if (balance < amount) {
      res.json(424).send({
        message: "Balance is inefficient",
      });
      return;
    }

    const base58PrivateKey = process.env.MASTER_WALLET_BS58_PRIVATE_KEY;
    const senderPrivateKey = Uint8Array.from(bs58.decode(base58PrivateKey));
    const senderKeyPair = Keypair.fromSecretKey(senderPrivateKey);
    walletAddress = new PublicKey(walletAddress);
    const feeInLamports = await transferSOL(senderKeyPair, walletAddress, amount);
    await updateWallet(userId, walletAddress, tokenAddress, amount * LAMPORTS_PER_SOL, 1);
    res.status(200).send({
      message: `${amount - feeInLamports / LAMPORTS_PER_SOL}SOL withdrawn successfully`,
    });
  } catch (err) {
    console.log("withdraw error:", err);
  }
};

const tradeIn = async (req, res) => {
  await swap();
};

const test = async (req, res) => {
  try {
    await res.status(200).send({
      message: "test is ok",
    });
  } catch (err) {
    console.log("test error:", err);
  }
};

module.exports = {
  createWallet,
  deposit,
  withdraw,
  tradeIn,
  test,
};
