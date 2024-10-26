//
// Created by Duarte on 26/10/2024.
//

#ifndef BLOCKIOT_BLOCK_H
#define BLOCKIOT_BLOCK_H

#include <string>
#include <vector>
#include <memory>

class IUTXO {
public:
    IUTXO(const std::string& toAddress, int amt) : to(toAddress), amount(amt) {}
    std::string GetTo();
    int GetAmount();
private:
    std::string to;
    int amount;
};

class ITransaction {
public:
    ITransaction(const std::string& fromAddress, const std::string& sig, const std::vector<IUTXO>& utxoList)
            : from(fromAddress), signature(sig), utxos(utxoList) {}
    std::string GetFrom();
    std::string GetSignature();
    std::vector<IUTXO> GetUTXOS();
private:
    std::string from;
    std::string signature;
    std::vector<IUTXO> utxos;
};

class IBlock {
public:
    virtual ~IBlock() = default;
    virtual bool IsValid() const = 0;
    virtual void RecalculateBlock(const std::vector<ITransaction>& new_transactions, int new_nonce) = 0;
    virtual void Display() const = 0;
    virtual long long GetTimestamp() const = 0;
    virtual std::string GetHash() const = 0;
    virtual std::string GetPreviousBlockHash() const = 0;
    virtual std::vector<ITransaction> GetTransactions() const = 0;
    virtual std::shared_ptr<IBlock> Clone() const = 0;
};

class Block : public IBlock {
public:
    Block(int difficulty, int nonce, std::string  previous_block_hash, const std::vector<ITransaction>& transactions);
    bool IsValid() const override;
    void RecalculateBlock(const std::vector<ITransaction>& new_transactions, int new_nonce) override;
    void Display() const override;
    long long GetTimestamp() const override;
    std::string GetHash() const override;
    std::vector<ITransaction> GetTransactions() const override;
    std::string GetPreviousBlockHash() const override;
    std::shared_ptr<IBlock> Clone() const override;
private:
    int difficulty;
    int nonce;
    long long timestamp;
    std::string block_hash;
    std::string previous_block_hash;
    std::vector<ITransaction> transactions;

    std::string Hash(const std::string& data);
    void CalculateHash();
};


#endif //BLOCKIOT_BLOCK_H
