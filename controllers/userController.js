const walletModel = require("../models/walletModel");
const createSolWallet = require("../utils/walletCreator");
const updateWallet = require("../utils/updateWallet");
const { getPrivateKey, getBalanceFromDB } = require("../utils/utils");
const { checkBalance, transferSOL } = require("../utils/trade");
const bs58 = require("bs58");


const { Connection, Keypair, PublicKey, LAMPORTS_PER_SOL } = require("@solana/web3.js");
// const { Market } = require("@project-serum/serum");
// const connection = new Connection("https://api.devnet.solana.com", "confirmed");

const createWallet = async (req, res) => {
  try {
    const keypair = createSolWallet();
    const solWallet = new walletModel({
      userId: req.user._id,
      privateKey: keypair.privateKey,
      address: keypair.publicKey,
      balances: [{ currencyType: "Sol", amount: 0 }],
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
      message: `${amount - feeInLamports/LAMPORTS_PER_SOL}SOL transfered successfully`,
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
    await updateWallet(
      userId,
      walletAddress,
      tokenAddress,
      amount * LAMPORTS_PER_SOL,
      1
    );
    res.status(200).send({
      message: `${amount - feeInLamports/LAMPORTS_PER_SOL}SOL withdrawn successfully`,
    });
  } catch (err) {
    console.log("withdraw error:", err);
  }
};

//req.marketAddress, req.userId, req.walletAddress, req.side, req.price, req.size
const trade = async (req, res) => {
  try {
    const marketAddress = req.marketAddress;
    const serumProgramId = new PublicKey("9xQeWvG816bUx9EPvT5MCfbw4zgKuKisEUK16tFfCQpP");

    const user = await walletModel.findOne({ userId: req.userId, address: req.walletAddress });
    const traderKeypair = Keypair.fromSecretKey(Uint8Array.from([user.privateKey]));

    const loadMarket = async () => {
      return await Market.load(connection, marketAddress, {}, serumProgramId);
    };

    const placeOrder = async (side, price, size) => {
      try {
        const market = await loadMarket();

        const orderParams = {
          owner: traderKeypair,
          payer: traderKeypair.publicKey, // Token account for USDC or SOL
          side, // "buy" or "sell"
          price, // Price per unit
          size, // Number of units
          orderType: "limit", // or 'market'
          clientId: new Date().getTime(), // Unique order identifier
        };

        const transaction = await market.makePlaceOrderTransaction(connection, orderParams);
        const signature = await connection.sendTransaction(transaction, [traderKeypair]);

        console.log("Order placed! Transaction signature:", signature);
        res.json(200).send({
          success: true,
          message: "trade performed successfully",
        });
        return signature;
      } catch (err) {
        console.error("Error placing order:", err);
      }
    };
    placeOrder(req.side, req.price, req.size);
  } catch (err) {
    console.log("Error during trading:", err);
  }
};

const test = async (req, res) => {
  try {
    // updateWallet(req.user._id, "44563rW251z6Gi1JC1icG27T3aa1puTi2P2sdSF2dcVP", "SOL", 0.19999, 0);
    const balance = await checkBalance(new PublicKey(req.body.data.walletAddress));
    console.log(balance)
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
  trade,
  test,
};
