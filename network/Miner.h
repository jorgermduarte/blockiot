//
// Created by Duarte on 26/10/2024.
//

#ifndef BLOCKIOT_MINER_H
#define BLOCKIOT_MINER_H


#include <iostream>
#include <memory>
#include "Blockchain.h"

class IMiner {
public:
    virtual ~IMiner() = default;
    virtual void StartMining() = 0;
    virtual void StopMining() = 0;
    virtual bool IsMining() const = 0;
};

class Miner : public IMiner {
public:
    explicit Miner(IBlockchain* blockchain);

    void StartMining() override;
    void StopMining() override;
    bool IsMining() const override;

private:
    bool turnedOn;
    IBlockchain* blockchain;

    void InitializeMiner();
    std::unique_ptr<IBlock> MineBlock(std::shared_ptr<IBlock> latestBlock, int bits);
};


#endif //BLOCKIOT_MINER_H
