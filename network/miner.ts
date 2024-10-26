import { IBlock, Block } from './block.ts';
import type { IBlockchain } from './blockchain.ts';
import type { IUTXO } from './utxo.ts';

export interface IMiner{
	StartMining(): void;
	StopMining(): void;
	IsMining(): boolean;
}

export class Miner implements IMiner{
	
	private turnedOn: boolean;
	private blockchain: IBlockchain;

	constructor(blockchain: IBlockchain){
		this.turnedOn = false;
		this.blockchain = blockchain;
	}

	StartMining(){
		if(!this.turnedOn){
			this.turnedOn = true;
			this.InitializeMiner();
		}
	}

	StopMining(){
		this.turnedOn = false;
	}

	IsMining(){
		return this.turnedOn;
	}

	private InitializeMiner(){
		while(this.turnedOn){
			console.log(`blockchain info: ` + this.blockchain);
			console.log(`blockchain difficulty: ${this.blockchain.difficulty}`);
			const newBlock = this.MineBlock(this.blockchain.GetLastChainBlock(),this.blockchain.difficulty);
			this.blockchain.AddBlock(newBlock);	
		}
	}

	private MineBlock(latestBlock: IBlock | null, bits: number): IBlock {
		const transactions: IUTXO[] = [];
		let startingNonce = 0;
		const newBlock: IBlock = new Block(bits, startingNonce, Date.now(), latestBlock?.block_hash || "0", transactions);
			
		while(!newBlock.IsValid()){
			newBlock.RecalculateBlock(transactions, Date.now(), startingNonce);
			startingNonce++;
		}

		return newBlock;
	}

}
