package com.bank.poc.core.repository;

import com.bank.poc.core.entity.Transaction;
import org.springframework.data.jpa.repository.JpaRepository;

public interface TransactionRepository extends JpaRepository<Transaction, Long> {
    // This is used to save transaction logs to the database
}