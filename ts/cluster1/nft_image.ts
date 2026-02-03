import { createUmi } from "@metaplex-foundation/umi-bundle-defaults"
import { createGenericFile, createSignerFromKeypair, signerIdentity } from "@metaplex-foundation/umi"
import { irysUploader } from "@metaplex-foundation/umi-uploader-irys"
import fs from "fs"
import path from "path"

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

        //1. Load image
        console.log(path.join(__dirname, "..","generug.png"))
        const imageFile = fs.readFileSync(path.join(__dirname, "..","generug.png"))
        //2. Convert image to generic file.
        const umiImageFile = createGenericFile(imageFile,"generug.png", {
            tags: [{name: "Content-Type", value: "image/png"}]
        })
        //3. Upload image

        const imageUri = await umi.uploader.upload([umiImageFile]).catch((err) => {
            throw new Error(err)
        })

        const [myUri] = imageUri
        console.log("Your image URI: ", myUri);
    }
    catch(error) {
        console.log("Oops.. Something went wrong", error);
    }
})();
