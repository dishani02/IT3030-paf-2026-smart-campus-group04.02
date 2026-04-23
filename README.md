# UniSphere- Smart Campus Operations Hub 🎓

[![Spring Boot](https://img.shields.io/badge/Spring%20Boot-3.2.3-brightgreen.svg)](https://spring.io/projects/spring-boot)
[![React](https://img.shields.io/badge/React-19.0-blue.svg)](https://react.dev/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind%20CSS-4.0-38B2AC.svg)](https://tailwindcss.com/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

A comprehensive, full-stack campus facility and asset management system designed to streamline operations, resource allocation, and communication within a modern educational environment. Built for **SLIIT IT3030 - PAF 2026**.

---

## 🚀 Overview

The **Smart Campus Operations Hub** is an integrated platform that empowers students, faculty, and administrators to efficiently manage campus resources. From booking labs to tracking maintenance issues via a ticketing system, the platform provides a centralized solution for all campus operational needs.

### Key Features

-   **🔐 Secure Authentication**: Integrated Google OAuth2 login with JWT-based session management.
-   **📦 Resource Management**: Centralized registry for campus assets, equipment, and facilities.
-   **📅 Booking System**: Real-time reservation system for labs, lecture halls, and shared equipment.
-   **🎫 Ticket Management**: Comprehensive support desk for reporting and tracking maintenance issues.
-   **📊 Analytics Dashboard**: Visualized data insights for resource utilization and system metrics.
-   **🔔 Smart Notifications**: Real-time alerts and user-configurable notification preferences.
-   **📱 QR Integration**: QR code generation and scanning for quick resource identification and tracking.

---

## 🛠️ Technology Stack

### Backend
-   **Framework**: Java 17, Spring Boot 3.2.3
-   **Security**: Spring Security, OAuth2, JWT (JSON Web Tokens)
-   **Database**: H2 (Dev) / MySQL (Prod) with Spring Data JPA
-   **Utilities**: Lombok, Maven, ZXing (QR Codes), Google API Client

### Frontend
-   **Framework**: React 19 (Vite)
-   **Styling**: Tailwind CSS 4.0, PostCSS
-   **Routing**: React Router DOM 7
-   **API Client**: Axios with JWT Interceptors

---

## 🏁 Getting Started

### Prerequisites
-   **Java 17** or higher
-   **Node.js 18** or higher
-   **Maven** (optional, uses `./mvnw` wrapper)

### Installation

1.  **Clone the repository**:
    ```bash
    git clone https://github.com/your-repo/smart-campus.git
    cd smart-campus
    ```

2.  **Backend Setup**:
    ```bash
    cd backend
    # Update application.yml with your Google Client ID if needed
    ./mvnw spring-boot:run
    ```
    *The backend will be available at `http://localhost:8080`*

3.  **Frontend Setup**:
    ```bash
    cd ../frontend
    npm install
    npm run dev
    ```
    *The frontend will be available at `http://localhost:5173`*

---

## 📂 Project Structure

```text
smart-campus/
├── backend/                # Spring Boot Application
│   ├── src/main/java       # Java Source Files
│   ├── src/main/resources  # Configuration (application.yml)
│   └── pom.xml             # Backend dependencies
├── frontend/               # React Application
│   ├── src/                # UI Components & Logic
│   ├── public/             # Static Assets
│   └── package.json        # Frontend dependencies
└── README.md               # Project Documentation
```

---

## 🛡️ Security Configuration

The application uses a dual-layer security approach:
1.  **Google OAuth2**: For seamless user onboarding and identity verification.
2.  **JWT**: For stateless, secure session management between the frontend and backend.

Ensure you update the `google.client-id` in `backend/src/main/java/com/sliit/smartcampus/resources/application.yml` for production use.

---

## 👥 Contributors

-   **SLIIT IT3030 - Group 04.02**
-   *Dishani Navanjana*

---

## 📄 License

This project is licensed under the MIT License.
