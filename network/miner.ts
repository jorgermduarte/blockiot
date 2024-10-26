import { IBlock, Block } from './block.ts';
import type { IUTXO } from './utxo.ts';

export interface IMiner{
	MineBlock(latestBlock: IBlock | null, bits: number): IBlock;
}

export class Miner implements IMiner{
	
	MineBlock(latestBlock: IBlock | null, bits: number): IBlock {
		// grab the
		const transactions: IUTXO[] = [];
		let startingNonce = 0;
		const newBlock: IBlock = new Block(bits, startingNonce, Date.now(), latestBlock?.block_hash || "0", transactions);
			
		while(!newBlock.IsValid()){
			//console.log(`block still not valid`);
			//console.log(`nonce: ${newBlock.nonce}`);
			newBlock.RecalculateBlock(transactions, Date.now(), startingNonce);
			startingNonce++;
		}

		return newBlock;
	}

}
