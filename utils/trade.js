const { Connection, PublicKey, Keypair, LAMPORTS_PER_SOL, Transaction, SystemProgram } = require('@solana/web3.js');
const bs58 = require("bs58");

const connection = new Connection("https://api.devnet.solana.com", "confirmed");

const airdropSOL = async (publicKey, lamports = 1 * LAMPORTS_PER_SOL) => {
    try {
        const signature = await connection.requestAirdrop(publicKey, lamports);
        await connection.confirmTransaction(signature, "confirmed");
        console.log(`Airdrop successful: ${signature}`);
    } catch (error) {
        console.error("Airdrop failed:", error);
    }
};

const checkBalance = async (publicKey) => {
    try {
        const balance = await connection.getBalance(publicKey);
        const solBalance = balance / LAMPORTS_PER_SOL;

        console.log(`Balance for ${publicKey.toString()}: ${solBalance} SOL`);
        return solBalance;
    } catch (error) {
        console.error("Failed to fetch balance:", error);
    }
};

// Transfer Function
const transferSOL = async (senderKeyPair, receiverAddress, amountInSOL) => {
    try {
        const amountInLamports = amountInSOL * LAMPORTS_PER_SOL;

        let preTransaction = new Transaction().add(
            SystemProgram.transfer({
                fromPubkey: senderKeyPair.publicKey,
                toPubkey: receiverAddress,
                lamports: amountInLamports,
            }),
        );

        let blockhash = (await connection.getLatestBlockhash('finalized')).blockhash;
        preTransaction.recentBlockhash = blockhash;
        preTransaction.feePayer = senderKeyPair.publicKey

        const response = await connection.getFeeForMessage(
            preTransaction.compileMessage(),
            'confirmed',
        );
        const feeInLamports = response.value;

        const transaction = new Transaction().add(
            SystemProgram.transfer({
                fromPubkey: senderKeyPair.publicKey,
                toPubkey: receiverAddress,
                lamports: amountInLamports - feeInLamports,
            })
        );

        const signature = await connection.sendTransaction(transaction, [senderKeyPair]);
        await connection.confirmTransaction(signature, "confirmed");

        return feeInLamports;
    } catch (error) {
        console.error("Error transferring SOL:", error);
    }
};

module.exports = {
    airdropSOL,
    checkBalance,
    transferSOL,
}