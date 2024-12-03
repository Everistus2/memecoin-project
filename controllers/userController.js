import walletModel from "../models/walletModel";
import createSolWallet from "../utils/walletCreator";

const { Connection, Keypair, PublicKey } = require("@solana/web3.js");
const { Market } = require("@project-serum/serum");
const connection = new Connection("https://api.devnet.solana.com", "confirmed");

export const createWallet = async (req, res) => {
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
      success: true,
      message: "Wallet created successfully",
      address: keypair.publicKey,
    });
  } catch (err) {
    console.log("wallet creation error:", err);
  }
};

export const deposit = async (req, res) => {};

export const withdraw = async (req, res) => {};


//req.marketAddress, req.userId, req.walletAddress, req.side, req.price, req.size
export const trade = async (req, res) => {
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
