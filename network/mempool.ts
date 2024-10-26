import type { IUTXO } from "./utxo.ts";

export interface IMempool{
	AddTransaction(transaction: IUTXO): void;
	GetPendingTransactions(): IUTXO[];
	Clear(): void;
}

export class Mempool implements IMempool{
  private transactions: IUTXO[] = [];

  public AddTransaction(transaction: IUTXO) {
    this.transactions.push(transaction);
  }

  public GetPendingTransactions(): IUTXO[] {
    return this.transactions;
  }

  public Clear() {
    this.transactions = [];
  }
}
