import { Blockchain } from '../network/blockchain.ts';
import { ThreadMessage } from './communication.ts';

let blockchain: Blockchain | null = null;

self.onmessage = (event: MessageEvent<ThreadMessage>) => {
  const { action, data } = event.data;

  switch (action) {
    case 'initializeBlockchain':
      blockchain = new Blockchain(data.name, data.mempool);
      self.postMessage({
        action: 'blockchainInitialized',
        data: { blockchain }
      });
      break;

    case 'addBlock':
      if (blockchain) {
        blockchain.AddBlock(data.block);
        self.postMessage({
          action: 'addBlockResponse',
          data: { block: data.block }
        });
      }
      break;

    case 'checkIntegrity':
      if (blockchain) {
        const integrity = blockchain.CheckChainIntegrity();
        self.postMessage({
          action: 'chainIntegrityResponse',
          data: { integrity }
        });
      }
      break;

    default:
      console.warn(`Unhandled action: ${action}`);
  }
};

