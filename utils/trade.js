const { Raydium } = require("@raydium-io/raydium-sdk-v2");
const { NATIVE_MINT } = require("@solana/spl-token");
const {Connection, Keypair, clusterApiUrl, LAMPORTS_PER_SOL} = require('@solana/web3.js');
const { isValidAmm } = require("./utils");
const BN = require('bn.js');
const bs58 = require("bs58");

const privateKey = "3HmkKznMHtdtkg7NMATUQTdjhAC9WfR2yENwwPNaVNtZNu7n2UYeXYQg1EAM53e6ZAhsbiQAwB124nLm4EcBeKmn";
const senderPrivateKey = Uint8Array.from(bs58.decode(privateKey));
const walletKeyPair = Keypair.fromSecretKey(senderPrivateKey);
const owner = walletKeyPair;

const connection = new Connection("https://distinguished-solemn-panorama.SOLANA_MAINNET.quiknode.pro/c181e0c542b12255df17b59a0cba314840b9717f");

const cluster = "mainnet"; // 'mainnet' | 'devnet'
const txVersion = "V0"

let raydium;
const initSdk = async (params) => {
  if (raydium) return raydium;
  if (connection.rpcEndpoint === clusterApiUrl("mainnet-beta"))
    console.warn(
      "using free rpc node might cause unexpected error, strongly suggest uses paid rpc node"
    );

  console.log(`connect to rpc ${connection.rpcEndpoint} in ${cluster}`);
  raydium = await Raydium.load({
    owner,
    connection,
    cluster,
    disableFeatureCheck: true,
    disableLoadToken: !params?.loadToken,
    blockhashCommitment: "finalized",
  });

  return raydium;
};

const computeAmountOut = (tokenIn, amountInSOL, tokenOut) => {
  const amountIn = amountInSOL*LAMPORTS_PER_SOL;
  const inputMint = tokenIn;
  
}

const swap = async () => {
  try {
    const raydium = await initSdk();
    console.log("Raydium init")
    const amountIn = 1*LAMPORTS_PER_SOL;
    const inputMint = NATIVE_MINT.toBase58();
    const poolId = "58oQChx4yWmvKdwLLZzBi4ChoCc2fqCUWBkwMihLYQo2"; // SOL-USDC pool
    let poolInfo;
    let poolKeys;
    let rpcData;
  
    if (raydium.cluster === "mainnet") {
      // note: api doesn't support get devnet pool info, so in devnet else we go rpc method
      // if you wish to get pool info from rpc, also can modify logic to go rpc method directly
      const data = await raydium.api.fetchPoolById({ ids: poolId });
      console.log("Data fetch: ", data)
      poolInfo = data[0];
      if (!isValidAmm(poolInfo.programId)) throw new Error("target pool is not AMM pool");
      poolKeys = await raydium.liquidity.getAmmPoolKeys(poolId);
      console.log("poolKeys: ", poolKeys)
      try {
        
      rpcData = await raydium.liquidity.getRpcPoolInfo(poolId);
      console.log("rpcData: ", rpcData)
      } catch (err) {
        console.log("RPC error: ", err)
        throw(err)
      }
    } else {
      // note: getPoolInfoFromRpc method only return required pool data for computing not all detail pool info
      const data = await raydium.liquidity.getPoolInfoFromRpc({ poolId });
      poolInfo = data.poolInfo;
      poolKeys = data.poolKeys;
      rpcData = data.poolRpcData;
    }
  
    const [baseReserve, quoteReserve, status] = [
      rpcData.baseReserve,
      rpcData.quoteReserve,
      rpcData.status.toNumber(),
    ];
  
    if (poolInfo.mintA.address !== inputMint && poolInfo.mintB.address !== inputMint)
      throw new Error("input mint does not match pool");
  
    const baseIn = inputMint === poolInfo.mintA.address;
    const [mintIn, mintOut] = baseIn
      ? [poolInfo.mintA, poolInfo.mintB]
      : [poolInfo.mintB, poolInfo.mintA];
  
    const out = raydium.liquidity.computeAmountOut({
      poolInfo: {
        ...poolInfo,
        baseReserve,
        quoteReserve,
        status,
        version: 4,
      },
      amountIn: new BN(amountIn),
      mintIn: mintIn.address,
      mintOut: mintOut.address,
      slippage: 0.01, // range: 1 ~ 0.0001, means 100% ~ 0.01%
    });
  
    console.log(
      `computed swap ${(amountIn / Math.pow(10, mintIn.decimals)).toFixed(mintIn.decimals)} ${
        mintIn.symbol || mintIn.address
      } to ${(out.amountOut / Math.pow(10, mintOut.decimals)).toFixed(mintOut.decimals)} ${
        mintOut.symbol || mintOut.address
      }, minimum amount out ${(out.minAmountOut / Math.pow(10, mintOut.decimals)).toFixed(
        mintOut.decimals
      )} ${mintOut.symbol || mintOut.address}`
    );
  
  
    console.log("before swap")
  
    const { execute } = await raydium.liquidity.swap({
      poolInfo,
      poolKeys,
      amountIn: new BN(amountIn),
      amountOut: out.minAmountOut, // out.amountOut means amount 'without' slippage
      fixedSide: "in",
      inputMint: mintIn.address,
      txVersion,
      computeBudgetConfig: {
        units: 600000,
        microLamports: 56591500,
      },
    });
  
    console.log("before executing: ", execute)
    // don't want to wait confirm, set sendAndConfirm to false or don't pass any params to execute
    const { txId } = await execute({ sendAndConfirm: true });
    console.log(`swap successfully in amm pool:`, { txId: `https://explorer.solana.com/tx/${txId}` });
  
  } catch(err) {
    console.log("Swap Error: ", err)
    return
  }

};


module.exports = swap;
