const express = require("express");
const app = express();
const port = 8080;
const Moralis = require("moralis").default;
const cors = require("cors");
const { EvmChain } = require("@moralisweb3/common-evm-utils");
const abi = require("./abi.json");


require("dotenv").config({ path: ".env" });

app.use(cors());
app.use(express.json());

const MORALIS_API_KEY = process.env.MORALIS_API_KEY;

async function getEthPrice() {
  try {
    const response = await Moralis.EvmApi.token.getTokenPrice({
      address: "0x14bb7a637fAb7Ef189Ddb052153239cf31892D8c",
      chain: "0x38",
    });

    console.log(`ETH price: ${response.price}`);

  } catch (e) {
    console.log(`Something went wrong: ${e}`);
  }
}

app.get("/getethprice", async (req, res) => {
  try {
    const response = await Moralis.EvmApi.token.getTokenPrice({
      address: "0x14bb7a637fAb7Ef189Ddb052153239cf31892D8c",
      chain: "0x38",
    });

    return res.status(200).json(response);
  } catch (e) {
    console.log(`Something went wrong: ${e}`);
    return res.status(400).json();
  }
});

app.get("/address", async (req, res) => {
  try {
    const { query } = req;
    const chain = "0x38";

    const response = await Moralis.EvmApi.transaction.getWalletTransactions({
      address: query.address,
      chain: 0x38,
    });

    return res.status(200).json(response);
  } catch (e) {
    console.log(`Something went wrong: ${e}`);
    return res.status(400).json();
  }
});

app.get("/stakingbalance", async (req, res) => {
  try {
    const chain = EvmChain.BSC_TESTNET;
    const address = "0x1c858295C0fEEbb372e2E6589CBc26D9D5DC52b7";
    const functionName = "stakingTokenBalance";

    const response = await Moralis.EvmApi.utils.runContractFunction({
      address,
      functionName,
      abi,
      chain,
    });

    return res.status(200).json({ stakingBalance: response.result });
  } catch (e) {
    console.log(`Something went wrong: ${e}`);
    return res.status(400).json();
  }
});


let stakingBalance;

Moralis.start({
  apiKey: MORALIS_API_KEY,
}).then(async () => {
  const chain = EvmChain.BSC_TESTNET;
  const address = "0x1c858295C0fEEbb372e2E6589CBc26D9D5DC52b7";
  const functionName = "stakingTokenBalance";

  stakingBalance = await Moralis.EvmApi.utils.runContractFunction({
    address,
    functionName,
    abi,
    chain,
  });

  console.log(`Staking balance: ${stakingBalance.result}`);
  
  app.listen(port, "0.0.0.0", () => {
    console.log(`Listening for API Calls`);
  });
});





