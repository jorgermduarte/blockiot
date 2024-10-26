#include "Block.h"
#include <iostream>
#include <sstream>
#include <openssl/sha.h>
#include <iomanip>
#include <utility>
#include <chrono>

Block::Block(int difficulty, int nonce, std::string  previous_block_hash, const std::vector<ITransaction>& transactions)
        : difficulty(difficulty), nonce(nonce), previous_block_hash(std::move(previous_block_hash)), transactions(transactions) {
    auto now = std::chrono::system_clock::now();
    this->timestamp = std::chrono::duration_cast<std::chrono::seconds>(now.time_since_epoch()).count();
    CalculateHash();
}

bool Block::IsValid() const {
    std::string target(difficulty, '0');  // Target string with 'difficulty' leading zeros
    return block_hash.substr(0, difficulty) == target;
}

void Block::RecalculateBlock(const std::vector<ITransaction>& new_transactions, int new_nonce)  {
    transactions = new_transactions;
    auto now = std::chrono::system_clock::now();
    this->timestamp = std::chrono::duration_cast<std::chrono::seconds>(now.time_since_epoch()).count();
    this->nonce = new_nonce;
    this->CalculateHash();
}

void Block::Display() const {
    std::cout << "Block => Hash:" << block_hash << " D:" << difficulty << " N:" << nonce << " T:" << timestamp << " PBH:" << previous_block_hash << std::endl;
}

std::string Block::Hash(const std::string& data) {
    unsigned char hash[SHA256_DIGEST_LENGTH];
    SHA256_CTX sha256;
    SHA256_Init(&sha256);
    SHA256_Update(&sha256, data.c_str(), data.size());
    SHA256_Final(hash, &sha256);

    // Convert the hash to a hex string
    std::stringstream ss;
    for (int i = 0; i < SHA256_DIGEST_LENGTH; i++) {
        ss << std::hex << std::setw(2) << std::setfill('0') << static_cast<int>(hash[i]);
    }
    return ss.str();
}
void Block::CalculateHash()  {
    std::ostringstream oss;
    oss << difficulty << nonce << timestamp << previous_block_hash;
    for (ITransaction transaction : transactions) {
        oss << transaction.GetFrom()  << transaction.GetSignature();
        for(IUTXO utxo: transaction.GetUTXOS()){
            oss << utxo.GetAmount() << utxo.GetTo();
        }
    }
    this->block_hash = Hash(oss.str());
}

long long Block::GetTimestamp() const {
    return this->timestamp;
}

std::string Block::GetHash() const {
    return this->block_hash;
}

std::vector<ITransaction> Block::GetTransactions() const {
    return this->transactions;
}

std::string Block::GetPreviousBlockHash() const {
    return this->previous_block_hash;
}

std::shared_ptr<IBlock> Block::Clone() const {
    return std::make_shared<Block>(*this);
}

std::string ITransaction::GetFrom() {
    return this->from;
}

std::string ITransaction::GetSignature() {
    return this->signature;
}

std::vector<IUTXO> ITransaction::GetUTXOS() {
    return this->utxos;
}

std::string IUTXO::GetTo() {
    return this->to;
}

int IUTXO::GetAmount() {
    return this->amount;
}
