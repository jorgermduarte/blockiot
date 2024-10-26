import { Miner } from '../network/miner.ts';
import { ThreadMessage } from './communication.ts';

let miner: Miner | null = null;

self.onmessage = (event: MessageEvent<ThreadMessage>) => {
  const { action, data } = event.data;

  switch (action) {
    case 'initializeMiner':
      miner = new Miner(data.blockchain);  // Initialize miner with blockchain reference
      self.postMessage({
        action: 'initializeMinerResponse'
      });
      break;

    case 'startMining':
      if (miner) {
        miner.StartMining();
        self.postMessage({
          action: 'startMiningResponse'
        });
      }
      break;

    case 'stopMining':
      if (miner) {
        miner.StopMining();
        self.postMessage({
          action: 'stopMiningResponse'
        });
      }
      break;

    default:
      console.warn(`Unhandled action: ${action}`);
  }
};

