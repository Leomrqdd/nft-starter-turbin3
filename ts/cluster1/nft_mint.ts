import { createUmi } from "@metaplex-foundation/umi-bundle-defaults"
import { createSignerFromKeypair, signerIdentity, generateSigner, percentAmount } from "@metaplex-foundation/umi"
import { createNft, mplTokenMetadata } from "@metaplex-foundation/mpl-token-metadata";
import base58 from "bs58";


// Same as: import wallet from "$HOME/.config/solana/id.json" (path must be resolved at runtime)
const wallet = require(`${process.env.HOME}/.config/solana/id.json`)


const RPC_ENDPOINT = "https://api.devnet.solana.com";
const umi = createUmi(RPC_ENDPOINT);

let keypair = umi.eddsa.createKeypairFromSecretKey(new Uint8Array(wallet));
const signer= createSignerFromKeypair(umi, keypair);
console.log(signer.publicKey);
umi.use(signerIdentity(signer));
umi.use(mplTokenMetadata())

const mint = generateSigner(umi);

(async () => {
    const metadataUri = "https://devnet.irys.xyz/4qrows9QxCBtwFztkBqsyoKvUyU3Eouky6hZhHXT4Sa8"

    let tx = createNft(umi,{mint,
        name: "HonestRug",
        symbol:"HRUG",
        uri:metadataUri,
        sellerFeeBasisPoints: percentAmount(0),
    })
    let result = await tx.sendAndConfirm(umi);
    const signature = base58.encode(result.signature);
    
    console.log(`Succesfully Minted! Check out your TX here:\nhttps://explorer.solana.com/tx/${signature}?cluster=devnet`)

    console.log("Mint Address: ", mint.publicKey);
})();