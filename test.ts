import { Miner } from './network/miner.ts';
import { Blockchain } from './network/blockchain.ts';


const miner = new Miner();
const block_chain = new Blockchain('testnet');

let maxBlocksTest = 100000;
let i = 0;
while(i < maxBlocksTest){
   const newBlock = miner.MineBlock(block_chain.GetLastChainBlock(),block_chain.difficulty);
   block_chain.AddBlock(newBlock);
   i++;
   
}

block_chain.DisplayChain();

// check chain integrity
console.log(`Is Chain Valid ? ${block_chain.CheckChainIntegrity()}`);


