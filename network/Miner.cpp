//
// Created by Duarte on 26/10/2024.
//

#include "Miner.h"
#include <chrono>
#include <memory>

Miner::Miner(IBlockchain* blockchain)
        : turnedOn(false), blockchain(blockchain) {}

void Miner::StartMining() {
    if (!turnedOn) {
        turnedOn = true;
        InitializeMiner();
    }
}

void Miner::StopMining() {
    turnedOn = false;
}

bool Miner::IsMining() const {
    return turnedOn;
}

void Miner::InitializeMiner() {
    while (turnedOn) {
        auto newBlock = MineBlock(blockchain->GetLastChainBlock(), blockchain->GetDifficulty());
        blockchain->AddBlock(*newBlock);
    }
}



std::unique_ptr<IBlock> Miner::MineBlock(std::shared_ptr<IBlock> latestBlock, int bits) {
    std::vector<ITransaction> transactions = this->blockchain->GetMempool()->GetPendingTransactions();

    int startingNonce = 0;
    auto newBlock = std::make_unique<Block>(bits, startingNonce,
                                                     latestBlock ? latestBlock.get()->GetHash() : "0",
                                                     transactions);
    while (!newBlock->IsValid()) {
        newBlock->RecalculateBlock(transactions, startingNonce);
        startingNonce++;
    }
    return newBlock;
}
