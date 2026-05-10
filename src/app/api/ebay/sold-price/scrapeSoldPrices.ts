
// import * as cheerio from "cheerio";

// function buildEbayUrl(query: string) {
//     const encoded = encodeURIComponent(query);

//     return `https://www.ebay.com/sch/i.html?_nkw=${encoded}&LH_Sold=1&LH_Complete=1`;
// }

// export function cleanPrices(prices: number[]) {
//     return prices
//         .filter((p) => p > 0 && p < 10000)
//         .sort((a, b) => a - b);
// }

// export async function scrapeSoldPrices(query: string) {
//     const browser = await chromium.launch({
//         headless: true, // set false if you want to debug visually
//     });

//     try {
//         const page = await browser.newPage();

//         const url = buildEbayUrl(query);

//         await page.goto(url, {
//             waitUntil: "domcontentloaded",
//         });

//         // give JS time to render listings
//         await page.waitForTimeout(2000);

//         const html = await page.content();

//         const $ = cheerio.load(html);

//         const prices: number[] = [];

//         $(".s-item").each((_, el) => {
//             const text = $(el)
//                 .find(".s-item__price")
//                 .first()
//                 .text();

//             const match = text.match(/\$([\d,.]+)/);

//             if (match) {
//                 const price = parseFloat(
//                     match[1].replace(/,/g, "")
//                 );

//                 if (!isNaN(price)) {
//                     prices.push(price);
//                 }
//             }
//         });

//         return prices;
//     } finally {
//         await browser.close();
//     }
// }

// import * as cheerio from "cheerio";

// function buildEbayUrl(query: string) {
//     const encoded = encodeURIComponent(query);

//     return `https://www.ebay.com/sch/i.html?_nkw=${encoded}&LH_Sold=1&LH_Complete=1`;
// }

// export function cleanPrices(prices: number[]) {
//     return prices
//         .filter((p) => p > 0 && p < 10000)
//         .sort((a, b) => a - b);
// }

// export async function scrapeSoldPrices(query: string) {
//     try {
//         const url = buildEbayUrl(query);

//         const res = await fetch(url, {
//             headers: {
//                 "User-Agent":
//                     "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/120 Safari/537.36",
//                 Accept: "text/html",
//             },
//         });

//         const html = await res.text();

//         if (!html || typeof html !== "string") {
//             throw new Error("Invalid eBay response");
//         }

//         // basic bot detection guard
//         if (
//             html.includes("Robot") ||
//             html.includes("captcha") ||
//             html.includes("Access Denied")
//         ) {
//             throw new Error("Blocked by eBay bot protection");
//         }

//         const $ = cheerio.load(html);

//         const prices: number[] = [];

//         $(".s-item").each((_, el) => {
//             const priceText = $(el)
//                 .find(".s-item__price")
//                 .first()
//                 .text();

//             const match = priceText.match(/\$([\d,.]+)/);

//             if (match) {
//                 const price = parseFloat(
//                     match[1].replace(/,/g, "")
//                 );

//                 if (!isNaN(price)) {
//                     prices.push(price);
//                 }
//             }
//         });

//         return prices;
//     } catch (err: any) {
//         console.error("SCRAPE ERROR:", err?.message);

//         throw new Error(
//             typeof err === "string"
//                 ? err
//                 : err?.message || "Scrape failed"
//         );
//     }
// }

// import axios from "axios";
// import * as cheerio from "cheerio";

// function buildEbayUrl(query: string) {
//     const encoded =  encodeURIComponent(query);
//     return `https://www.ebay.com/sch/i.html?_nkw=${encoded}&LH_Sold=1&LH_Complete=1`
// }

// export function cleanPrices(prices: number[]) {
//     return prices
//         .filter((p) => p > 0 && p < 10000)
//         .sort((a, b) => a - b);
// }

// export async function scrapeSoldPrices(query: string) {
//     try {
//         const url = buildEbayUrl(query);

//         const { data } = await axios.get(url, {
//             headers: {
//                 "User-Agent":
//                     "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/120 Safari/537.36",
//             Accept: "text/html",
//             },
//             timeout: 10000,
//         });

//         if (!data || typeof data !== "string"){
//             throw new Error("Invalid eBay response");
//         }

//         if (data.includes("Robot") || data.includes("captcha")){
//             throw new Error("Blocked by eBay bot protection");
//         }

//         const $ = cheerio.load(data);

//         const prices: number[] = [];

//         $(".s-item").each((_, el) => {
//             const priceText = $(el)
//                 .find(".s-item__price")
//                 .first()
//                 .text();
        
//             const match = priceText.match(/\$([\d,.]+)/);

//             if (match) {
//                 const price = parseFloat(match[1].replace(/,/g, ""));
//                 if (!isNaN(price)) prices.push(price);
//             }
//         });

//         return prices;
//     } catch (err: any) {
//         console.error("SCRAPE ERROR:", err?.message);
//         console.error("FULL ERROR:", err);

//         throw new Error(
//             err?.response?.status
//                 ? `ebay blocked request (${err.response.status})`
//                 : err
//         )
//     }
// }
