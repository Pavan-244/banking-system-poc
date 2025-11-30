package com.bank.poc.core.controller;

import com.bank.poc.core.dto.TransactionRequest;
import com.bank.poc.core.service.CoreBankingService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

import com.bank.poc.core.entity.Transaction;
import java.util.List;

@RestController
@RequestMapping("/process")
public class ProcessingController {

    @Autowired
    private CoreBankingService coreService;

    @PostMapping
    public ResponseEntity<Map<String, String>> processTransaction(@RequestBody TransactionRequest request) {
        // Call the service
        String result = coreService.processTransaction(
            request.getCardNumber(),
            request.getPin(),
            request.getAmount(),
            request.getType()
        );

        // Construct JSON response
        Map<String, String> response = new HashMap<>();
        response.put("message", result);

        if (result.startsWith("SUCCESS")) {
            response.put("status", "SUCCESS");
            return ResponseEntity.ok(response);
        } else {
            response.put("status", "FAILURE");
            return ResponseEntity.badRequest().body(response);
        }
    }
    @GetMapping("/history")
    public ResponseEntity<List<Transaction>> getHistory() {
        List<Transaction> transactions = coreService.getAllTransactions();
        return ResponseEntity.ok(transactions);
    }
    
    @GetMapping("/balance/{cardNumber}")
    public ResponseEntity<Double> getBalance(@PathVariable String cardNumber) {
    try {
        // You also need to add getBalance() to your CoreBankingService!
        double balance = coreService.getBalance(cardNumber);
        return ResponseEntity.ok(balance);
    } catch (Exception e) {
        return ResponseEntity.notFound().build();
    }
}
}