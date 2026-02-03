import { create, mplCore } from '@metaplex-foundation/mpl-core'
import {
  createGenericFile,
  generateSigner,
  signerIdentity,
  sol,
  createSignerFromKeypair,
} from '@metaplex-foundation/umi'
import { createUmi } from '@metaplex-foundation/umi-bundle-defaults'
import { irysUploader } from '@metaplex-foundation/umi-uploader-irys'
import { base58 } from '@metaplex-foundation/umi/serializers'
// Same as: import wallet from "$HOME/.config/solana/id.json" (path must be resolved at runtime)
const wallet = require(`${process.env.HOME}/.config/solana/id.json`)


const RPC_ENDPOINT = "https://api.devnet.solana.com";
const umi = createUmi(RPC_ENDPOINT);

let keypair = umi.eddsa.createKeypairFromSecretKey(new Uint8Array(wallet));
const signer= createSignerFromKeypair(umi, keypair);
console.log(signer.publicKey);
umi.use(signerIdentity(signer));

const mint = generateSigner(umi);
const metadataUri = "https://devnet.irys.xyz/4qrows9QxCBtwFztkBqsyoKvUyU3Eouky6hZhHXT4Sa8"

// Create the wrapper function
const createNft = async () => {

  const tx = await create(umi, {
  asset: mint,
  name: 'My NFT',
  uri: metadataUri,
  }).sendAndConfirm(umi)

  const signature = base58.deserialize(tx.signature)[0]

  // Log out the signature and the links to the transaction and the NFT.
  console.log('\nNFT Created')
  console.log('View Transaction on Solana Explorer')
  console.log(`https://explorer.solana.com/tx/${signature}?cluster=devnet`)
  console.log('\n')
  console.log('View NFT on Metaplex Explorer')
  console.log(`https://core.metaplex.com/explorer/${mint.publicKey}?env=devnet`)
}



// run the wrapper function
createNft()