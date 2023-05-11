const express = require("express");
const request = require('request');
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
const BSC_API_KEY = process.env.BSC_API_KEY;

async function getEthPrice() {
  try {
    const response = await Moralis.EvmApi.token.getTokenPrice({
      address: "0xdA2c0CDf7d764F8C587380CAdF7129E5eCb7Efb7",
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
      address: "0xdA2c0CDf7d764F8C587380CAdF7129E5eCb7Efb7",
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
    const chain = EvmChain.BSC;
    const address = "0x4951B6Cac448EE3732921DEbF5018C2AA074264a";
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
  const chain = EvmChain.BSC;
  const address = "0x4951B6Cac448EE3732921DEbF5018C2AA074264a";
  const functionName = "stakingTokenBalance";

  stakingBalance = await Moralis.EvmApi.utils.runContractFunction({
    address,
    functionName,
    abi,
    chain,
  });

  console.log(`Staking balance: ${stakingBalance.result}`);


  //******************************************************************************* */
  const app = express();

// Defina a rota para a consulta do token circulante
app.get('/circulating-supply', (req, res) => {
  // Defina as informações do token e os endereços que deseja verificar
  const token_contract_address = "0xda2c0cdf7d764f8c587380cadf7129e5ecb7efb7";
  const addresses_to_check = ["0x000000000000000000000000000000000000dead"];

  // Atribua diretamente o valor total de tokens emitidos à variável total_supply
  const total_supply = 500000000000 * 10**18;

  // Faz uma solicitação para obter os saldos das contas dos endereços específicos
  const account_balance_url_template = `https://api.bscscan.com/api?module=account&action=tokenbalance&contractaddress=${token_contract_address}&address={{address}}&apikey=${BSC_API_KEY}`;

  const address_balances = [];
  let addresses_checked = 0;
  
  addresses_to_check.forEach((address) => {
      const url = account_balance_url_template.replace("{{address}}", address);
      request(url, (error, response, body) => {
          const balance = parseInt(JSON.parse(body).result);
          address_balances.push(balance);
          addresses_checked++;
          if (addresses_checked === addresses_to_check.length) {
            // Calcula o total circulante e retorna o resultado como JSON
            const total_circulating = (total_supply - address_balances.reduce((a, b) => a + b, 0));
            const total = total_circulating / 10**18;
            res.json((total));
          }          
      });
  });
});

  //******************************************************************************* */


  app.listen(port, "0.0.0.0", () => {
    console.log(`Listening for API Calls`);
  });
});




