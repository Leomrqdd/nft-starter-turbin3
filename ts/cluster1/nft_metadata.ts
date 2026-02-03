import { createUmi } from "@metaplex-foundation/umi-bundle-defaults"
import { createGenericFile, createSignerFromKeypair, signerIdentity } from "@metaplex-foundation/umi"
import { irysUploader } from "@metaplex-foundation/umi-uploader-irys"



// Same as: import wallet from "$HOME/.config/solana/id.json" (path must be resolved at runtime)
const wallet = require(`${process.env.HOME}/.config/solana/id.json`)

// Create a devnet connection
const umi = createUmi('https://api.devnet.solana.com');

let keypair = umi.eddsa.createKeypairFromSecretKey(new Uint8Array(wallet));
const signer = createSignerFromKeypair(umi, keypair);
console.log(signer.publicKey);

umi.use(irysUploader());
umi.use(signerIdentity(signer));

(async () => {
    try {
        // Follow this JSON structure
        // https://docs.metaplex.com/programs/token-metadata/changelog/v1.0#json-structure

        const image = "https://devnet.irys.xyz/6g2RQ5hBaio85v44BSUW5VxcthLovNWcB4oSSZKJ9hff"
        const metadata = {
            name: "HonestRug",
            symbol: "HRUG",
            description: "This may be the best rug in the world",
            image: image,
            attributes: [
                {trait_type: 'Type', value: 'Rug'}
            ],
            properties: {
                files: [
                    {
                        type: "image/png",
                        uri: image
                    },
                ]
            },
            creators: []
        };
        const metadataUri = await umi.uploader.uploadJson(metadata).catch(err => {
            throw new Error(err)
        }) 
        console.log("Your metadata URI: ", metadataUri);

        
    }
    catch(error) {
        console.log("Oops.. Something went wrong", error);
    }
})();
