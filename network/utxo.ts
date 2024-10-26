export interface IUTXO {
	to: string;
	amount: number;
}

export interface ITransaction {
  	from: string;
  	signature: string;
  	utxos: IUTXO[];
}



