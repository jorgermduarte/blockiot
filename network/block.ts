import { createHash } from 'node:crypto';
import type { IUTXO } from './utxo.ts';

export interface IBlock {
    difficulty: number;           // Block difficulty
    nonce: number;                // Nonce used to mine the block
    timestamp: number;            // Block Timestamp
    block_hash: string;           // Block Identifier
    previous_block_hash: string;  // Previous Block Identifier
    transactions: IUTXO[];
    IsValid(): boolean;
    RecalculateBlock(transactions: IUTXO[], timestamp: number, nonce: number): void;
}

export class Block implements IBlock {
	difficulty: number;
	nonce: number;
	timestamp: number;
	block_hash: string;
	previous_block_hash: string;
	transactions: IUTXO[];

	constructor(difficulty: number, nonce: number, timestamp: number, previous_block_hash: string, transactions: IUTXO[]) {
        	this.difficulty = difficulty;
        	this.nonce = nonce;
        	this.timestamp = timestamp;
        	this.previous_block_hash = previous_block_hash;
		this.transactions = transactions;
		this.block_hash = "";
		this.CalculateHash();
	}

	private Hash(data: string): string{
		const firstHash = createHash('sha256').update(data).digest('hex');

		const finalHash = createHash('sha256').update(firstHash).digest('hex');	
		return finalHash;
	}

	private CalculateHash(){
		const transactionsData = JSON.stringify(this.transactions);
		const data = `${this.difficulty}${this.nonce}${this.timestamp}${this.previous_block_hash}${transactionsData}`;
		this.block_hash = this.Hash(data);
	}

	RecalculateBlock(transactions: IUTXO[], timestamp: number, nonce: number){
		this.timestamp = timestamp;
		this.nonce = nonce;
		this.transactions = transactions;
		this.CalculateHash();
	}

	Display(){
		console.log(`Block => ${this.block_hash} ${this.difficulty} ${this.nonce} ${this.timestamp} ${this.previous_block_hash}`);
	}


	public IsValid(): boolean {
		const target = '0'.repeat(this.difficulty);
    		if(this.block_hash.startsWith(target)){
			return true;
		}else{
			return false;
		}
	}
	
}

