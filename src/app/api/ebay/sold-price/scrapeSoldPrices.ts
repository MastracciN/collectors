import axios from "axios";
import * as cheerio from "cheerio";

function buildEbayUrl(query: string) {
    const encoded =  encodeURIComponent(query);
    return `https://www.ebay.com/sch`
}

export function cleanPrices(prices: number[]) {
    return prices
        .filter((p) => p > 0 && p < 10000)
        .sort((a, b) => a - b);
}

export async function scrapeSoldPrices(query: string) {
    const url = buildEbayUrl(query);

    const { data } = await axios.get(url, {
        headers: {
            "User-Agent":
            "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/120 Safari/537.36",
        Accept: "text/html",
    },
    });

    const $ = cheerio.load(data);

    const prices: number[] = [];

    $(".s-item").each((_, el) => {
        const priceText = $(el)
            .find(".s-item__price")
            .first()
            .text();
    
        const match = priceText.match(/\$([\d,.]+)/);

        if (match) {
            const price = parseFloat(match[1].replace(/,/g, ""));
            if (!isNaN(price)) prices.push(price);
        }
    });

    return prices;
}
