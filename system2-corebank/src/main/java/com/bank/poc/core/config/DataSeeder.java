package com.bank.poc.core.config;

import com.bank.poc.core.entity.Card;
import com.bank.poc.core.repository.CardRepository;
import org.apache.commons.codec.digest.DigestUtils;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class DataSeeder {

    @Bean
    CommandLineRunner initDatabase(CardRepository repository) {
        return args -> {
            if (repository.count() == 0) {
                Card card = new Card();
                card.setCardNumber("4123456789012345"); // Supported Range
                card.setPinHash(DigestUtils.sha256Hex("1234")); // Secure Hash
                card.setBalance(1000.00);
                card.setCustomerName("Alice Doe");

                repository.save(card);
                System.out.println("✅ SYSTEM 2: Seeded Card 4123... with Balance 1000.00");
            }
        };
    }
}