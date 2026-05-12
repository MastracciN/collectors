# Collectors

[collectors-two.vercel.app](https://collectors-two.vercel.app/login)

A web application for managing collections with barcodes.

Uses the html5-qrcode library to scan codes and provides those codes to [UPCitemdb](https://www.upcitemdb.com/) for a description of the item. User is able to manually enter UPC if camera is unavailable or even enter all data manually.

Provides estimated value of product by querying eBay API for current listings of the item and calculating an average based on the listing prices.

User authentication is powered by OAuth.

Deployed on Vercel using Supabase to manage user data.
