# NFT minting scripts (cluster1)

Simple pipeline to mint an NFT on Solana devnet using Metaplex UMI and Irys for uploads.

## Scripts

### `nft_image.ts`

Uploads the NFT image to Arweave. It:

1. Loads the image file (`generug.png` at repo root in `ts/`)
2. Wraps it as a UMI generic file with `Content-Type: image/png`
3. Uploads it via `umi.uploader.upload()` and prints the **image URI**

Run first; use the returned URI in `nft_metadata.ts`.

### `nft_metadata.ts`

Uploads the **NFT metadata JSON** to Arweave. It:

1. Builds a Metaplex-compliant metadata object (name, symbol, description, image URI, attributes, properties, creators)
2. Uploads it with `umi.uploader.uploadJson()`
3. Prints the **metadata URI**

Use this URI in `nft_mint.ts` when creating the NFT.

### `nft_mint.ts`

Mints the NFT on Solana devnet. It:

1. Creates a new mint keypair with `generateSigner(umi)`
2. Calls `createNft()` with name, symbol, metadata URI and 0% royalty
3. Sends the transaction on devnet and prints the Explorer link and mint address

Run after you have the metadata URI from `nft_metadata.ts`.

## Order to run

1. `nft_image.ts` → get image URI  
2. `nft_metadata.ts` → set image URI in metadata, get metadata URI  
3. `nft_mint.ts` → set metadata URI, then run to mint  

## Mint transaction

![NFT mint screenshot](ts/mint_screenshot.png)

**Transaction (devnet):**  
https://explorer.solana.com/tx/5gsA3ewcZqdzj6fFDjF747J5odHvauAEM5XpjnYw2oqGfjB5Xf83wvYh3dDkhQj6cMxuhWiTVKPKN6yfJGSrqQV7?cluster=devnet
