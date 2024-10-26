import { IBlock } from './block.ts'
import { LinkedList } from './linkedlist.ts';
import { IMempool } from './mempool.ts';

export interface IBlockchain {
	chain: string; // ex: main, testnet
	difficulty: number;
	blocks: LinkedList<IBlock>;
	mempool: IMempool;

	CheckChainIntegrity(): boolean;
	AddBlock(block: IBlock): void;
	GetLastChainBlock(): IBlock | null;
}

export class Blockchain implements IBlockchain{
	chain: string;
	blocks: LinkedList<IBlock>;
	difficulty: number;
	mempool: IMempool;

	private adjustment_interval: number;
	

	constructor(chain_name: string, mempool: IMempool){
		this.chain = chain_name;
		this.difficulty = 1;
		this.blocks = new LinkedList<IBlock>();
		this.adjustment_interval = 2016;
		this.mempool = mempool;
	}
	
	AddBlock(block: IBlock){
		if(block.IsValid()){
			this.blocks.Add(block);
			this.AdjustDifficulty();
		}
	}

	CheckChainIntegrity(): boolean{
		let status = true;
			
		for(let i = 0; i < this.blocks.Size(); i++){
			const currentBlock = this.blocks.Get(i);
			if(currentBlock == null || (currentBlock?.value != null && !currentBlock?.value.IsValid())){
				status = false;
				break;
			}
		}

		return status;

	}
	
	GetLastChainBlock(): IBlock | null{
		if(this.blocks.Size() === 0){
			return null;
		}
		return this.blocks.Get(this.blocks.Size()-1)?.value || null;
	}

	public DisplayChain(): void {
        	for (let i = 0; i < this.blocks.Size(); i++) {
	        	const block = this.blocks.Get(i)?.value;
        		if (block) {
                		console.log(`Block #${i} => Hash: ${block.block_hash}, Previous Hash: ${block.previous_block_hash}`);
            		}
        	}
    	}


	private AdjustDifficulty() {
        	const blockCount = this.blocks.Size();

        	if (blockCount % this.adjustment_interval === 0) {
	        	const timestamps = this.GetLastNBlockTimestamps(this.adjustment_interval);
            		if (timestamps.length > 1) {
                		const timeDifferences = this.CalculateTimeDifferences(timestamps);
                		const medianActualTime = this.GetMedian(timeDifferences);
                		const expectedTime = 60; // 1 block per minute in seconds (target time per block)

                		const newDifficulty = this.difficulty * (expectedTime / medianActualTime);
				
				// prevent the increase of more than 100%
				if(newDifficulty - this.difficulty > 1){
					this.difficulty++;
				}
                		console.log(`New Difficulty: ${this.difficulty}`);
            		}
        	}	
    	}
	private GetLastNBlockTimestamps(n: number): number[] {
        	const timestamps: number[] = [];
        	const start = Math.max(0, this.blocks.Size() - n);
        	for (let i = start; i < this.blocks.Size(); i++) {
            		const block = this.blocks.Get(i)?.value;
            		if (block) {
                		timestamps.push(block.timestamp);
            		}
        	}
        	return timestamps;
	}

    	private CalculateTimeDifferences(timestamps: number[]): number[] {
        	const timeDifferences: number[] = [];
        	for (let i = 1; i < timestamps.length; i++) {
            		timeDifferences.push(timestamps[i] - timestamps[i - 1]);
        	}
        	return timeDifferences;
    	}

    	private GetMedian(values: number[]): number {
        	values.sort((a, b) => a - b); // Sort values in ascending order
        	const middle = Math.floor(values.length / 2);

        	if (values.length % 2 === 0) {
            		// If even, return the average of the two middle values
            		return (values[middle - 1] + values[middle]) / 2;
        	} else {
            		// If odd, return the middle value
            		return values[middle];
        	}
    	}

}
