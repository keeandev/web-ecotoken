import CoinGecko from "coingecko-api";
import { z } from "zod";

import { publicProcedure, router } from "../trpc";

const getCoinGeckoPrice = async () => {
    //1. Import coingecko-api

    //2. Initiate the CoinGecko API Client
    const client = new CoinGecko();
    // const list = await CoinGeckoClient.coins.list();
    const data = await client.simple.price({
        ids: ["solana"],
        vs_currencies: ["usd"],
    });
    console.log(data);
    return data;
};

export const coinPriceRouter = router({
    get: publicProcedure.query(async ({}) => {
        const data = await getCoinGeckoPrice();
        return data;
    }),
});
