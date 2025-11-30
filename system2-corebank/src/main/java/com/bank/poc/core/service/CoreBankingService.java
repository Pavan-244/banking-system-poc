package com.bank.poc.core.service;

import com.bank.poc.core.entity.Card;
import com.bank.poc.core.entity.Transaction;
import com.bank.poc.core.repository.CardRepository;
import com.bank.poc.core.repository.TransactionRepository;
import org.apache.commons.codec.digest.DigestUtils; // From commons-codec dependency
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.time.LocalDateTime;
import java.util.Optional;
import java.util.List;

@Service
public class CoreBankingService {

    @Autowired
    private CardRepository cardRepo;

    @Autowired
    private TransactionRepository transactionRepo;

    public double getBalance(String cardNumber) {
        return cardRepo.findByCardNumber(cardNumber)
                .map(Card::getBalance)
                .orElseThrow(() -> new RuntimeException("Card not found"));
    }

    public String processTransaction(String cardNumber, String rawPin, double amount, String type) {
        String status = "FAILURE";
        String reason = "";

        // 1. Find the Card
        Optional<Card> cardOpt = cardRepo.findByCardNumber(cardNumber);
        if (cardOpt.isEmpty()) {
            logTransaction(cardNumber, amount, type, "FAILURE", "Card not found");
            return "FAILURE: Card not found";
        }
        Card card = cardOpt.get();

        // 2. Validate PIN (Hash the input and compare)
        String inputHash = DigestUtils.sha256Hex(rawPin);
        if (!inputHash.equals(card.getPinHash())) {
            logTransaction(cardNumber, amount, type, "FAILURE", "Invalid PIN");
            return "FAILURE: Invalid PIN";
        }

        // 3. Process Logic based on Type
        if ("withdraw".equalsIgnoreCase(type)) {
            if (card.getBalance() < amount) {
                logTransaction(cardNumber, amount, type, "FAILURE", "Insufficient funds");
                return "FAILURE: Insufficient funds";
            }
            card.setBalance(card.getBalance() - amount);
            status = "SUCCESS";
            reason = "Withdrawal completed";
        } 
        else if ("topup".equalsIgnoreCase(type)) {
            card.setBalance(card.getBalance() + amount);
            status = "SUCCESS";
            reason = "Top-up completed";
        } 
        else {
            return "FAILURE: Invalid transaction type";
        }

        // 4. Save Updates
        cardRepo.save(card);
        logTransaction(cardNumber, amount, type, status, reason);
        
        return "SUCCESS";
        
    }

    private void logTransaction(String cardNum, double amt, String type, String status, String reason) {
        Transaction log = new Transaction();
        log.setCardNumber(cardNum);
        log.setAmount(amt);
        log.setType(type);
        log.setStatus(status);
        log.setReason(reason);
        log.setTimestamp(LocalDateTime.now());
        transactionRepo.save(log);
    }
    public List<Transaction> getAllTransactions() {
        return transactionRepo.findAll();
    }
}