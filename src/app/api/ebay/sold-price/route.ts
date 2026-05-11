import { NextRequest, NextResponse } from "next/server";

const cache = new Map<
    string,
    {
        data: any;
        expires: number;
    }
>();

const CACHE_TIME = 1000 * 60 * 60;

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

    const normalized = query.toLowerCase().trim();

    const cached = cache.get(normalized);

    if (
        cached && cached.expires > Date.now()
    ) {
        return NextResponse.json({
            query,
            result: cached.data,
            cached: true,
        });
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

    const result = {
        average: Number(avg.toFixed(2)),
        min: sorted[0],
        max: sorted[sorted.length - 1],
        sampleSize: prices.length,
    };

    cache.set(normalized, {
        data: result,
        expires: Date.now() + CACHE_TIME,
    });

    return NextResponse.json({
        query,
        result,
        cached: false,
    });
}