import { generateMnemonic, mnemonicToSeedSync } from "https://esm.sh/bip39@3.0.2";

export class Wallet{
	public public_key!: string;
	private private_key!: CryptoKey;
	public mnemonic!: string;

	constructor(){}

	static async Create(wordCount: 16 | 32): Promise<Wallet>{
		const wallet = new Wallet();
		wallet.GenerateMnemonic(wordCount);
		await wallet.GenerateKeyPairFormMnemonic(wallet.mnemonic);
		return wallet;
	}

	public  async LoadFromMnemonic(mnemonic: string){
		this.mnemonic = mnemonic;
		await this.GenerateKeyPairFormMnemonic(mnemonic);
	}

	private GenerateMnemonic(wordCount: 16 | 32){
		const entropySize = wordCount === 16 ? 128: 256; // 128 bits for 16 words, 256 bits for 32 words
		this.mnemonic = generateMnemonic(entropySize);
		this.GenerateKeyPairFormMnemonic(this.mnemonic);
	}

	private async GenerateKeyPairFormMnemonic(mnemonic: string){
		const seed = mnemonicToSeedSync(mnemonic);
		const keyMaterial = await crypto.subtle.importKey(
	      		'raw',
	      		seed.slice(0, 32), // Use first 32 bytes as key material
	      		{ name: 'PBKDF2' },
	      		false,
	      		['deriveKey']
	    	);

	    const derivedKey = await crypto.subtle.deriveKey(
      	{
       	 name: 'PBKDF2',
        	salt: new TextEncoder().encode('mnemonic'), // Salt to secure the derivation
       	 iterations: 2048,
        hash: 'SHA-256',
      },
      keyMaterial,
      { name: 'HMAC', hash: 'SHA-256', length: 256 }, // Derive an HMAC key for signing
      true,
      ['sign', 'verify']
    );

    this.private_key = derivedKey; // Assign derived key as the private key
    const publicKeyBuffer = await crypto.subtle.exportKey("raw", derivedKey);
    this.public_key = this.ArrayBufferToBase64(publicKeyBuffer); // Public key in Base64 formation
	}

	 private ArrayBufferToBase64(buffer: ArrayBuffer): string {
    const byteArray = new Uint8Array(buffer);
    const binaryString = String.fromCharCode(...byteArray);
    return btoa(binaryString);
  }

}
