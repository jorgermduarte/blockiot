import { ThreadMessage } from './threads/communication.ts';

const mempoolWorker = new Worker(new URL('./threads/mempool.thread.ts', import.meta.url).href, { type: "module" });
const blockchainWorker = new Worker(new URL('./threads/blockchain.thread.ts', import.meta.url).href, { type: "module" });
const minerWorker = new Worker(new URL('./threads/miner.thread.ts', import.meta.url).href, { type: "module" });

// Step 1: Initialize Mempool
mempoolWorker.postMessage(<ThreadMessage>{ action: 'initializeMempool' });


// Handle Mempool worker messages
mempoolWorker.onmessage = (event: MessageEvent<ThreadMessage>) => {
  const { action, data } = event.data;

  if (action === 'mempoolInitialized') {
    console.log('Mempool initialized');
    // Step 2: Initialize Blockchain with Mempool
    blockchainWorker.postMessage(<ThreadMessage>{ action: 'initializeBlockchain', data: { name: 'testnet', mempool: data.mempool } });
  } else if (action === 'transactionAdded') {
    console.log('Transaction added to mempool:', data.transaction);
  }
};

// Handle Blockchain worker messages
blockchainWorker.onmessage = (event: MessageEvent<ThreadMessage>) => {
  const { action, data } = event.data;

  if (action === 'blockchainInitialized') {
    console.log('Blockchain initialized');
    // Step 3: Initialize Miner with Blockchain
    minerWorker.postMessage(<ThreadMessage>{ action: 'initializeMiner', data: { blockchain: data.blockchain } });
  } else if (action === 'addBlockResponse') {
    console.log('Block added to blockchain:', data.block);
  } else if (action === 'chainIntegrityResponse') {
    console.log(`Blockchain integrity: ${data.integrity}`);
  }
};

// Handle Miner worker messages
minerWorker.onmessage = (event: MessageEvent<ThreadMessage>) => {
  const { action } = event.data;

  if (action === 'initializeMinerResponse') {
    console.log('Miner initialized');
    // Start mining
    minerWorker.postMessage(<ThreadMessage>{ action: 'startMining' });
  } else if (action === 'startMiningResponse') {
    console.log('Mining has started');
  } else if (action === 'stopMiningResponse') {
    console.log('Mining has stopped');
  }
};

// Periodic integrity check on the blockchain every 10 seconds
setInterval(() => {
  blockchainWorker.postMessage(<ThreadMessage>{ action: 'checkIntegrity' });
}, 10000);

