#ifndef BLOCKIOT_BLOCKCHAIN_H
#define BLOCKIOT_BLOCKCHAIN_H

#include <string>
#include <vector>
#include <iostream>
#include "Block.h"
#include "Mempool.h"
#include "../structures/LinkedList.h"

class IBlockchain {
public:
    virtual ~IBlockchain() = default;
    virtual bool CheckChainIntegrity() const = 0;
    virtual void AddBlock(const IBlock& block) = 0;
    virtual std::shared_ptr<IBlock> GetLastChainBlock() const = 0;
    virtual double GetDifficulty() const = 0;
    virtual void DisplayChain() const = 0;
    virtual IMempool* GetMempool() const = 0;
};

class Blockchain : public IBlockchain {
public:
    Blockchain(const std::string& chain_name, IMempool* mempool);  // Alterado para receber ponteiro

    bool CheckChainIntegrity() const override;
    void AddBlock(const IBlock& block) override;
    std::shared_ptr<IBlock> GetLastChainBlock() const override;
    void DisplayChain() const override;
    double GetDifficulty() const override;
    IMempool* GetMempool() const override;

private:
    std::string chain;
    double difficulty;
    LinkedList<IBlock> blocks;
    IMempool* mempool;  // Alterado para ponteiro

    int adjustment_interval;

    void AdjustDifficulty();
    std::vector<long long> GetLastNBlockTimestamps(int n) const;
    std::vector<long long> CalculateTimeDifferences(const std::vector<long long>& timestamps) const;
    double GetAverageTime(const std::vector<long long>& values)  const;
};

#endif //BLOCKIOT_BLOCKCHAIN_H
