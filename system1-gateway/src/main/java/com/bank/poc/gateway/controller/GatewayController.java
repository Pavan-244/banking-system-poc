package com.bank.poc.gateway.controller;

import com.bank.poc.gateway.dto.TransactionRequest;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.client.RestTemplate;
import java.util.Map;
import java.util.List;
import java.util.Arrays;

@RestController
@RequestMapping("/transaction")
public class GatewayController {

    // CHANGE 1: Use 127.0.0.1 here
    private final String CORE_BANK_URL = "http://127.0.0.1:8082/process";

    @PostMapping
    public ResponseEntity<?> handleTransaction(@RequestBody TransactionRequest request) {
        
        if (request.getCardNumber() == null || !request.getCardNumber().startsWith("4")) {
            return ResponseEntity.badRequest().body(
                Map.of("status", "FAILURE", "reason", "Card range not supported")
            );
        }

        RestTemplate restTemplate = new RestTemplate();
        try {
            return restTemplate.postForEntity(CORE_BANK_URL, request, Object.class);
        } catch (Exception e) {
            e.printStackTrace(); // Print error to console
            return ResponseEntity.badRequest().body(
                Map.of("status", "FAILURE", "reason", "Transaction Declined by Core")
            );
        }
    }

    @GetMapping("/history")
    public ResponseEntity<List<Object>> getTransactionHistory() {
        RestTemplate restTemplate = new RestTemplate();
        try {
            // CHANGE 2: Use 127.0.0.1 here too
            String coreHistoryUrl = "http://127.0.0.1:8082/process/history";
            
            Object[] transactions = restTemplate.getForObject(coreHistoryUrl, Object[].class);
            return ResponseEntity.ok(Arrays.asList(transactions));
        } catch (Exception e) {
            e.printStackTrace(); // This will show you exactly why it failed in the terminal
            return ResponseEntity.internalServerError().build();
        }
    }
    @GetMapping("/balance/{cardNumber}")
    public ResponseEntity<Double> getBalance(@PathVariable String cardNumber) {
        RestTemplate restTemplate = new RestTemplate();
        try {
            String coreUrl = "http://127.0.0.1:8082/process/balance/" + cardNumber;
            ResponseEntity<Double> response = restTemplate.getForEntity(coreUrl, Double.class);
            return ResponseEntity.ok(response.getBody());
        } catch (Exception e) {
            return ResponseEntity.status(500).build();
        }
    }
}