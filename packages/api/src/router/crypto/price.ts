import { router, publicProcedure } from "../../trpc";
import { z } from "zod";
import CoinGecko from "coingecko-api";

const getCoinGeckoPrice = async () => {
    //1. Import coingecko-api

    //2. Initiate the CoinGecko API Client
    const CoinGeckoClient = new CoinGecko();
    // const list = await CoinGeckoClient.coins.list();
    const data = await CoinGeckoClient.simple.price({
        ids: ["solana"],
        vs_currencies: ["usd"],
    });
    console.log(data);
    return data;
};

export const coinPriceRouter = router({
    get: publicProcedure.input(z.object({})).query(async ({}) => {
        const data = await getCoinGeckoPrice();
        return data;
    }),
});
