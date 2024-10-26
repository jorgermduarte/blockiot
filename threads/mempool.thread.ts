import { Mempool } from '../network/mempool.ts';
import { ThreadMessage } from './communication.ts';

const mempool = new Mempool();

self.onmessage = (event: MessageEvent<ThreadMessage>) => {
  const { action, data } = event.data;

  switch (action) {
    case 'initializeMempool':
      // Assuming no additional data needed to initialize mempool
      self.postMessage({
        action: 'mempoolInitialized',
        data: { mempool }  // Send mempool reference to main thread
      });
      break;

    case 'addTransaction':
      mempool.AddTransaction(data.transaction);
      self.postMessage({
        action: 'transactionAdded',
        data: { transaction: data.transaction }
      });
      break;

    default:
      console.warn(`Unhandled action: ${action}`);
  }
};

