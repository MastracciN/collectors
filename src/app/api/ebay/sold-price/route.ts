import { NextRequest, NextResponse } from "next/server";

async function getToken() {
    const basic = Buffer.from(
        `${process.env.EBAY_CLIENT_ID}:${process.env.EBAY_CLIENT_SECRET}`
    ).toString("base64");

    const res = await fetch(
        "https://api.ebay.com/identity/v1/oauth2/token",
        {
            method: "POST",
            headers: {
                "Content-Type":
                    "application/x-www-form-urlencoded",
                Authorization: `Basic ${basic}`,
            },
            body: new URLSearchParams({
                grant_type: "client_credentials",
                scope: "https://api.ebay.com/oauth/api_scope",
            }),
        }
    );

    const data = await res.json();
    return data.access_token;
}

export async function GET(req: NextRequest) {
    const { searchParams } = new URL(req.url);
    const query = searchParams.get("q");

    if (!query) {
        return NextResponse.json(
            { error: "Missing query" },
            { status: 400 }
        );
    }

    const token = await getToken();

    const res = await fetch(
        `https://api.ebay.com/buy/browse/v1/item_summary/search?q=${encodeURIComponent(
            query
        )}`,
        {
            headers: {
                Authorization: `Bearer ${token}`,
                "X-EBAY-C-MARKETPLACE-ID": "EBAY_US",
            },
        }
    );

    const data = await res.json();

    const items = data.itemSummaries || [];

    const prices = items
        .map((i: any) => Number(i.price?.value))
        .filter((p: number) => !isNaN(p) && p > 0);

    if (!prices.length) {
        return NextResponse.json({
            result: null,
            message: "No listings found",
        });
    }

    const avg =
        prices.reduce((a: number, b: number) => a + b, 0) /
        prices.length;

    const sorted = [...prices].sort((a, b) => a - b);

    return NextResponse.json({
        query,
        result: {
            average: Number(avg.toFixed(2)),
            min: sorted[0],
            max: sorted[sorted.length - 1],
            sampleSize: prices.length,
        },
    });
}

// import { NextResponse } from "next/server";
// import { scrapeSoldPrices, cleanPrices } from "./scrapeSoldPrices";

// export async function GET(req: Request) {
//     const { searchParams } = new URL(req.url);
//     const name = searchParams.get("name");

//     if (!name) {
//         return NextResponse.json(
//             { error: "Missing name" }, 
//             { status: 400 }
//         );
//     }

//     const prices = await scrapeSoldPrices(name);

//     if (!prices.length) {
//         return NextResponse.json({
//             result: null,
//             message: "No sold listings found",
//         });
//     }

//     const cleaned = cleanPrices(prices);

//     const avg = cleaned.reduce((a, b) => a + b, 0) / cleaned.length;

//     return NextResponse.json({
//         query: name,
//         result: {
//             average: Number(avg.toFixed(2)),
//             sampleSize: prices.length,
//         },
//     });
// }

// import { NextRequest, NextResponse } from "next/server";

// const EBAY_FINDING_URL =
//   "https://svcs.ebay.com/services/search/FindingService/v1";

// /**
//  * 1. Normalize messy user input
//  */
// function normalizeQuery(input: string) {
//   return input
//     .replace(/['"]/g, "")          // remove quotes
//     .replace(/[^\w\s]/g, " ")      // remove punctuation (/ , - etc.)
//     .replace(/\s+/g, " ")          // collapse spaces
//     .trim();
// }

// /**
//  * 2. Expand query for better eBay matching
//  */
// function expandQuery(q: string) {
//   return `${q} hot wheels diecast car`;
// }

// /**
//  * FETCH SOLD ITEMS (Finding API)
//  */
// async function fetchSoldItems(query: string) {
//   const url = new URL(EBAY_FINDING_URL);

//   url.searchParams.set("OPERATION-NAME", "findCompletedItems");
//   url.searchParams.set("SERVICE-VERSION", "1.13.0");
//   url.searchParams.set("SECURITY-APPNAME", process.env.EBAY_CLIENT_ID!);
//   url.searchParams.set("RESPONSE-DATA-FORMAT", "JSON");
//   url.searchParams.set("REST-PAYLOAD", "");

//   // 🔥 FIX: normalized + expanded query
//   const clean = normalizeQuery(query);
//   const expanded = expandQuery(clean);

//   url.searchParams.set("keywords", expanded);

//   url.searchParams.set("itemFilter(0).name", "SoldItemsOnly");
//   url.searchParams.set("itemFilter(0).value", "true");

//   // 🔥 improves dataset size
//   url.searchParams.set(
//     "paginationInput.entriesPerPage",
//     "50"
//   );

//   const res = await fetch(url.toString());
//   const data = await res.json();

//   return (
//     data?.findCompletedItemsResponse?.[0]
//       ?.searchResult?.[0]?.item || []
//   );
// }

// /**
//  * EXTRACT PRICES
//  */
// function extractPrices(items: any[]) {
//   return items
//     .map((i) =>
//       Number(
//         i?.sellingStatus?.[0]
//           ?.currentPrice?.[0]?.__value__
//       )
//     )
//     .filter((p) => Number.isFinite(p) && p > 0);
// }

// /**
//  * OUTLIER REMOVAL
//  */
// function cleanPrices(prices: number[]) {
//   if (prices.length < 5) return prices;

//   const sorted = [...prices].sort((a, b) => a - b);

//   const low = Math.floor(prices.length * 0.15);
//   const high = Math.ceil(prices.length * 0.85);

//   return sorted.slice(low, high);
// }

// /**
//  * WEIGHTED AVERAGE
//  */
// function weightedAverage(prices: number[]) {
//   const sorted = [...prices].sort((a, b) => a - b);

//   let sum = 0;
//   let weightSum = 0;

//   for (let i = 0; i < sorted.length; i++) {
//     const weight = i / sorted.length + 0.5;
//     sum += sorted[i] * weight;
//     weightSum += weight;
//   }

//   return sum / weightSum;
// }

// /**
//  * CONFIDENCE SCORE
//  */
// function confidence(prices: number[]) {
//   if (prices.length < 5) return "low";
//   if (prices.length < 12) return "medium";
//   return "high";
// }

// /**
//  * API ROUTE
//  */
// export async function GET(req: NextRequest) {
//   try {
//     const { searchParams } = new URL(req.url);
//     const query = searchParams.get("name");

//     if (!query) {
//       return NextResponse.json(
//         { error: "Missing name" },
//         { status: 400 }
//       );
//     }

//     const items = await fetchSoldItems(query);

//     const prices = extractPrices(items);
//     const cleaned = cleanPrices(prices);

//     if (!cleaned.length) {
//       return NextResponse.json({
//         query,
//         result: null,
//         message: "No sold comps found",
//       });
//     }

//     const avg = weightedAverage(cleaned);

//     return NextResponse.json({
//       query,
//       result: {
//         average: Number(avg.toFixed(2)),
//         sampleSize: prices.length,
//         trimmedSize: cleaned.length,
//         confidence: confidence(cleaned),
//       },
//     });
//   } catch (err: any) {
//     return NextResponse.json(
//       { error: err.message },
//       { status: 500 }
//     );
//   }
// }


// import { Average } from "next/font/google";
// import { NextRequest, NextResponse } from "next/server";

// const EBAY_TOKEN_URL = "https://api.ebay.com/identity/v1/oauth2/token";

// const EBAY_SOLD_URL = "https://api.ebay.com/buy/browse/v1/item_summary/search";

// async function getAccessToken() {
//     const basic = Buffer.from(
//         `${process.env.EBAY_CLIENT_ID}:${process.env.EBAY_CLIENT_SECRET}`
//     ).toString("base64");

//     const res = await fetch(EBAY_TOKEN_URL, {
//         method: "POST",
//         headers: {
//             "Content-Type": "application/x-www-form-urlencoded",
//             Authorization: `Basic ${basic}`,
//         },
//         body: new URLSearchParams({
//             grant_type: "client_credentials",
//             scope: "https://api.ebay.com/oauth/api_scope",
//         }),
//     });

//     if (!res.ok) {
//         throw new Error("Failed to get eBay token");
//     }

//     const data = await res.json();
//     return data.access_token as string;
// }

// function computeTrimmedAverage(prices: number[]) {
//     if (!prices.length) return null;

//     prices.sort((a, b) => a - b);

//     const trim = Math.floor(prices.length * 0.1);

//     const trimmed = prices.slice(trim, prices.length - trim);

//     const avg = trimmed.reduce((sum, p) => sum + p, 0) / trimmed.length;

//     return {
//         average: Number(avg.toFixed(2)),
//         sampleSize: prices.length,
//         trimmedSize: trimmed.length,
//     };
// }

// export async function GET(req: NextRequest) {
//     try {
//         const { searchParams } = new URL(req.url);
//         const name = searchParams.get("name");

//         if (!name) {
//             return NextResponse.json(
//                 { error: "Missing item name" },
//                 { status: 400 }
//             );
//         }

//         const cleanName = name.replace(/[^\w\s]/g, "").trim();

//         const token = await getAccessToken();

//         const url = new URL(EBAY_SOLD_URL);

//         url.searchParams.set("q", cleanName);

//         url.searchParams.set(
//             "filter",
//             "buyingOptions:{FIXED_PRICE}, conditionIds:{1000|1500|3000}",
//         );

//         const res = await fetch(url.toString(), {
//             headers: {
//                 Authorization: `Bearer ${token}`,
//                 "X-EBAY-C-MARKETPLACE-ID": "EBAY_US",
//             },
//         });

//         if (!res.ok) {
//             const err = await res.text();
//             return NextResponse.json(
//                 { error: "eBay API error", details: err },
//                 { status: 500 },
//             );
//         }

//         const data = await res.json();

//         const items = data.itemSales || [];

//         const prices = items
//             .map((item: any) =>
//                 Number(item.price?.value)
//             )
//             .filter(Boolean);

//         const result = computeTrimmedAverage(prices);

//         return NextResponse.json({
//             cleanName,
//             result,
//         });
//     } catch (err: any) {
//         return NextResponse.json(
//             { error: err.message },
//             { status: 500 },
//         );
//     }
// }