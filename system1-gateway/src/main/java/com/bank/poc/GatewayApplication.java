package com.bank.poc;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.client.RestTemplate;

public class GatewayApplication {
    @GetMapping("/balance/{cardNumber}")
    public ResponseEntity<Double> getBalance(@PathVariable String cardNumber) {
        // Validation: Ensure it's a Visa card
        if (!cardNumber.startsWith("4")) {
            return ResponseEntity.badRequest().build();
        }

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