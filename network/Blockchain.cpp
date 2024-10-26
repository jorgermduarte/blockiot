#include "Blockchain.h"
#include <algorithm>
#include <cmath>
#include <iostream>
#include <memory>

Blockchain::Blockchain(const std::string& chain_name, IMempool* mempool)
        : chain(chain_name), difficulty(1), mempool(mempool), adjustment_interval(2016) {
    if (!mempool) {
        std::cerr << "Aviso: Mempool é nullptr. Blockchain não terá acesso à mempool." << std::endl;
    }
}

double Blockchain::GetDifficulty() const {
    return this->difficulty;
}

void Blockchain::AddBlock(const IBlock& block) {
    if (block.IsValid()) {
        blocks.Add(block.Clone());
        AdjustDifficulty();
    }
}

bool Blockchain::CheckChainIntegrity() const {
    bool status = true;

    for (int i = 0; i < blocks.Size(); ++i) {
        auto currentBlock = blocks.Get(i);
        if (!currentBlock || !currentBlock.get()->IsValid()) {
            status = false;
            break;
        }
    }
    return status;
}

std::shared_ptr<IBlock> Blockchain::GetLastChainBlock() const {
    return (blocks.Size() > 0) ? blocks.Get(blocks.Size() - 1) : nullptr;
}


void Blockchain::DisplayChain() const {
    std::cout << "===================[ BLOCKCHAIN INFO ]=====================" << std::endl;
    std::cout << "Total Blocks in the blockchain: " << this->blocks.Size() << std::endl;
    std::cout << "Current Difficulty:  " << this->difficulty << std::endl;
    std::cout << "Total Transactions pending in the mempool: " << this->mempool->GetPendingTransactions().size() << std::endl;
    std::cout << "===========================================================" << std::endl;
    /*
    for (int i = 0; i < blocks.Size(); ++i) {
        auto block = blocks.Get(i);
        if (block) {
            auto blockData = block.get();
            std::cout << "Block #" << i << " => Hash: " << blockData->GetHash()
                      << ", Previous Hash: " << blockData->GetPreviousBlockHash()  << " Timestamp: " << blockData->GetTimestamp() << std::endl;
        }
    }
     */
}

void Blockchain::AdjustDifficulty() {
    int blockCount = this->blocks.Size();

    if (blockCount % adjustment_interval == 0 && blockCount > 0) {
        std::vector<long long> timestamps = GetLastNBlockTimestamps(adjustment_interval);
        if (timestamps.size() > 1) {

            long long lastBlockTimestamp = timestamps.back();
            long long firstBlockTimestamp = timestamps.front();

            long long totalTimeTakenSeconds = lastBlockTimestamp - firstBlockTimestamp;
            double totalExpectedTime = 60.0 * adjustment_interval;

            double newDifficulty = difficulty * (totalExpectedTime / totalTimeTakenSeconds);

            if (newDifficulty > difficulty + 1) {
                newDifficulty = difficulty + 1;
            } else if (newDifficulty < difficulty * 0.75) {
                newDifficulty = difficulty * 0.75;
            }

            this->difficulty = newDifficulty;

            std::cout << "=====================[ MINER INFO ]========================" << std::endl;
            std::cout << "Last timestamp: " << lastBlockTimestamp << " First Timestamp:" << firstBlockTimestamp << std::endl;
            std::cout << "Time taken for " << adjustment_interval << " blocks: " << totalTimeTakenSeconds << " seconds" << std::endl;
            std::cout << "Expected total time for interval: " << totalExpectedTime << " seconds" << std::endl;
            std::cout << "Ratio (expected/actual): " << totalExpectedTime / totalTimeTakenSeconds << std::endl;
            std::cout << "===========================================================" << std::endl;
        }
    }
}




std::vector<long long> Blockchain::GetLastNBlockTimestamps(int n) const {
    std::vector<long long> timestamps;
    int start = std::max(0, this->blocks.Size() - n);
    for (int i = start; i < this->blocks.Size(); ++i) {
        timestamps.push_back(blocks.Get(i)->GetTimestamp());
    }
    return timestamps;
}

std::vector<long long> Blockchain::CalculateTimeDifferences(const std::vector<long long>& timestamps) const {
    std::vector<long long> timeDifferences;
    for (size_t i = 1; i < timestamps.size(); ++i) {
        timeDifferences.push_back(timestamps[i] - timestamps[i - 1]);
    }
    return timeDifferences;
}

double Blockchain::GetAverageTime(const std::vector<long long>& values) const {
    if (values.empty()) return 0;
    long long sum = 0;
    for (const auto& value : values) {
        sum += value;
    }
    return static_cast<double>(sum) / values.size();
}


IMempool *Blockchain::GetMempool() const {
    return this->mempool;
}
