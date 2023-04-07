const express = require("express");
const app = express();
const port = 8080;
const Moralis = require("moralis").default;
const cors = require("cors");

require("dotenv").config({ path: ".env" });

app.use(cors());
app.use(express.json());

const MORALIS_API_KEY = process.env.MORALIS_API_KEY;

app.get("/getethprice", async (req, res) => {
    try {
        const response = await Moralis.EvmApi.token.getTokenPrice({
            address: "0x14bb7a637fAb7Ef189Ddb052153239cf31892D8c",
            chain: "0x38",
        });

        return res.status(200).json(response);
    } catch (e) {
        console.log(`Somthing went wrong ${e}`);
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
        console.log(`Something went wrong ${e}`);
        return res.status(400).json();
    }
});

Moralis.start({
    apiKey: MORALIS_API_KEY,
}).then(() => {
    app.listen(port, () => {
        console.log(`Listening for API Calls`);
    });
});