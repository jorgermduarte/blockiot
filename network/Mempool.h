//
// Created by Duarte on 26/10/2024.
//

#ifndef BLOCKIOT_MEMPOOL_H
#define BLOCKIOT_MEMPOOL_H

#include <vector>
#include "Block.h"

class IMempool {
public:
    virtual ~IMempool() = default;
    virtual void AddTransaction(const ITransaction& transaction) = 0;
    virtual std::vector<ITransaction> GetPendingTransactions() const = 0;
    virtual void Clear() = 0;
};

class Mempool : public IMempool {
public:
    void AddTransaction(const ITransaction& transaction) override;
    std::vector<ITransaction> GetPendingTransactions() const override;
    void Clear() override;

private:
    std::vector<ITransaction> transactions;
};

#endif //BLOCKIOT_MEMPOOL_H
