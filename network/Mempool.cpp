//
// Created by Duarte on 26/10/2024.
//

#include "Mempool.h"
void Mempool::AddTransaction(const ITransaction& transaction) {
    transactions.push_back(transaction);
}

std::vector<ITransaction> Mempool::GetPendingTransactions() const {
    return transactions;
}

void Mempool::Clear() {
    transactions.clear();
}
