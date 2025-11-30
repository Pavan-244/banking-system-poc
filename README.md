# 🏦 PayTabs Banking POC

A secure, full-stack banking simulation demonstrating a **Two-Tier Architecture**, **Secure PIN Authentication**, and **Role-Based Dashboards**. This Proof of Concept (POC) implements industry-standard patterns for transaction routing, validation, and audit logging.

![Java](https://img.shields.io/badge/Java-21-orange?style=flat-square&logo=openjdk)
![Spring Boot](https://img.shields.io/badge/Spring_Boot-3.3.x-green?style=flat-square&logo=springboot)
![React](https://img.shields.io/badge/React-Vite-blue?style=flat-square&logo=react)
![Database](https://img.shields.io/badge/Database-H2_In_Memory-lightgrey?style=flat-square&logo=h2)
![Security](https://img.shields.io/badge/Security-SHA_256-red?style=flat-square&logo=security)

## 📖 Overview

This project simulates a core banking environment split into three distinct microservices/applications. It is designed to demonstrate how to securely handle financial transactions by separating the **Validation Layer** (Gateway) from the **Business Logic Layer** (Core Banking).

### 🏗 Architecture
The system follows a strict **Gateway Pattern**:

1.  **System 1 (Gateway API - Port 8081):**
    * **Role:** The "Gatekeeper."
    * **Responsibility:** Validates that all incoming requests use a supported Card Range (Must start with `'4'` for Visa).
    * **Routing:** Forwards valid requests to the Core; rejects invalid ones immediately.
    * **Security:** Acts as a proxy, hiding the Core system from direct client access.

2.  **System 2 (Core Banking - Port 8082):**
    * **Role:** The "System of Record."
    * **Responsibility:** Manages the H2 Database, processes withdrawals/top-ups, and maintains the ledger.
    * **Security:** Implements SHA-256 PIN hashing. **Plain text PINs are never stored or logged.**

3.  **Frontend (React UI - Port 5173):**
    * **Role:** User Interface.
    * **Customer Dashboard:** View masked card details, real-time balance, and perform transactions.
    * **Super Admin Dashboard:** Monitor global transaction history in a data grid.

---

## 🚀 Key Features

* **Secure Authentication:** All PINs are hashed using SHA-256 before verification.
* **Card Range Routing:** Automatic rejection of unsupported cards (non-Visa) at the Gateway level.
* **Transaction Logging:** Complete audit trail of every successful and failed transaction attempt.
* **Responsive UI:** Modern Material UI (MUI) dashboard that adapts to mobile and desktop screens.
* **In-Memory Database:** Zero-configuration H2 database for rapid testing and deployment.

---

## 🛠 Technology Stack

| Component | Technology | Description |
| :--- | :--- | :--- |
| **Backend** | Java 17+ (Java 21 used) | Core Logic |
| **Framework** | Spring Boot 3.x | REST APIs, Dependency Injection |
| **Database** | H2 Database | In-Memory SQL Storage |
| **Security** | Apache Commons Codec | SHA-256 Hashing |
| **Frontend** | React.js (Vite) | Client-side Application |
| **Language** | TypeScript | Type-safe Frontend logic |
| **Styling** | Material UI (MUI) | Responsive Components & Layout |
| **Build Tools** | Maven, npm | Dependency Management |

---

## ⚙️ Setup & Installation

**Prerequisites:**
* Java 17 or higher
* Node.js (v18+) & npm
* Maven

### 1. Start System 2 (Core Banking)
*This must be started **first** to initialize the database and seed the default user.*

```bash
cd system2-corebank
mvn spring-boot:run
# ✅ Server started on: http://localhost:8082
````

### 2\. Start System 1 (Gateway)

*This routes traffic to System 2.*

```bash
cd system1-gateway
mvn spring-boot:run
# ✅ Server started on: http://localhost:8081
```

### 3\. Start Frontend (UI)

*This launches the web dashboard.*

```bash
cd banking-ui
npm install
npm run dev
# ✅ App running on: http://localhost:5173
```

-----

## 🧪 How to Test

### 1\. Default Credentials (Seeded Data)

The system auto-seeds one user on startup for testing purposes.

| Role | Username / Card Number | Password / PIN |
| :--- | :--- | :--- |
| **Customer** | `4123456789012345` | `1234` |
| **Super Admin** | `admin` | `admin` |

### 2\. UI Testing Flow

1.  Navigate to `http://localhost:5173`.
2.  **Login as Customer:** Use the card number above.
3.  **Perform Transaction:** Enter an amount (e.g., `100`) and click **Withdraw** or **Top Up**.
4.  **Verify:** You will see a success message and the **Current Balance** will update immediately.
5.  **Logout & Login as Admin:** Use `admin` / `admin`.
6.  **Monitor:** You will see the transaction you just performed in the global table with a "SUCCESS" status.

### 3\. API Testing (curl)

You can bypass the UI and test the Gateway directly via terminal:

**Withdrawal Request:**

```bash
curl -X POST http://localhost:8081/transaction \
  -H "Content-Type: application/json" \
  -d '{"cardNumber": "4123456789012345", "pin": "1234", "amount": 50, "type": "withdraw"}'
```

**View History:**

```bash
curl http://localhost:8081/transaction/history
```

**Test Invalid Card Range (Should fail at Gateway):**

```bash
curl -X POST http://localhost:8081/transaction \
  -H "Content-Type: application/json" \
  -d '{"cardNumber": "5555555555555555", "pin": "1234", "amount": 50, "type": "withdraw"}'
```

-----

## 📂 Project Structure

```text
banking-system-poc/
├── system1-gateway/       # Spring Boot Gateway
│   ├── src/main/java/com/bank/poc/gateway/controller/GatewayController.java
│   └── pom.xml
├── system2-corebank/      # Spring Boot Core + Database
│   ├── src/main/java/com/bank/poc/core/service/CoreBankingService.java
│   ├── src/main/java/com/bank/poc/core/entity/Card.java
│   ├── src/main/java/com/bank/poc/core/config/DataSeeder.java
│   └── pom.xml
└── banking-ui/            # React Frontend
    ├── src/pages/CustomerDashboard.tsx
    ├── src/pages/AdminDashboard.tsx
    ├── src/services/api.ts
    └── package.json
```

## 🛡 Security & Design Decisions

  * **No Plain Text:** The `DataSeeder` hashes the initial PIN immediately on startup using `DigestUtils.sha256Hex`. The database only contains the hash.
  * **CORS:** Configured on System 1 to allow traffic strictly from `localhost:5173`.
  * **Separation of Concerns:** System 1 handles validation logic; System 2 handles business logic and storage.

-----
**Developed for PayTabs Global Assignment**
