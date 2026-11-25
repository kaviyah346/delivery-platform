# Delivery Route and Vehicle Capacity Management Platform
**Inspired by UPS Logistics Operations**

A full-stack, enterprise-grade logistics and vehicle capacity management platform designed with a modern, UPS-inspired user interface. The platform tracks parcel shipments, calculates vehicle carrying capacity in real time, and ensures that vehicle payload limits are never exceeded.

---

## 1. Project Overview & Deliverables

This submission represents the **First Project Review** deliverables:

- **Fully functional React.js Frontend** implementing:
  - **Page 1: Operations Dashboard** with live statistics cards, Recharts visualizations (Pie chart, Bar chart, Fleet capacity utilization bars), and recent deliveries table.
  - **Page 2: Delivery Order Management** with structured tabular listing, live search, multi-criteria filtering (Status & Priority), detailed order inspection, order creation with validation, inline editing, and deletion with confirmation.
- **Layered Spring Boot 3 Backend** (Java 21, Spring Data JPA, Hibernate, Bean Validation, Global Exception Handling).
- **PostgreSQL Database (`ups_logistics`) Integration** ensuring complete data persistence across restarts without reliance on browser storage.
- **Dynamic synchronization**: All dashboard statistics and charts update automatically whenever orders are created, updated, or deleted.
- **Postman API Testing Collection** included in `ups_logistics_postman_collection.json`.
- **Extensible Architecture** for the remaining three modules (*Fleet Management*, *Route Planning*, *Delivery Tracking*).

---

## 2. Technology Stack

| Layer | Technologies |
|---|---|
| **Frontend** | React.js 18, Tailwind CSS, React Router v6, Axios, Recharts, Lucide Icons, Vite |
| **Backend** | Java 21, Spring Boot 3.3.5, Spring Data JPA, Hibernate, Jakarta Bean Validation, Maven |
| **Database** | PostgreSQL 16 (Database name: `ups_logistics`) |
| **API Testing** | Postman (Collection schema v2.1.0) |

---

## 3. UPS Color Theme & UI Design

The user interface adheres to a clean, minimal, and professional logistics design system:

- **Dark UPS Brown (`#351C15`)**: Used for the sidebar, top navigation accents, table headers, and primary emphasis.
- **Golden Yellow (`#FFB500`)**: Used for primary action buttons, hover highlights, active navigation indicators, and key operational metrics.
- **Neutral White (`#FFFFFF`) & Light Gray (`#F4F4F6`)**: Used for page background, card containers, and alternating table rows.
- **Dark Gray (`#1F2937`)**: High-contrast typography for readability.
- **Visual Status Badges**:
  - `Pending`: Amber / Golden Yellow
  - `Assigned`: Blue
  - `In Transit`: Purple
  - `Delivered`: Emerald Green
- **Priority Indicators**: High (Rose Red), Medium (Amber), Low (Slate/Gray).

---

## 4. Application Structure – Five Modules

| Module # | Page Title | Status in Review 1 | Description |
|---|---|---|---|
| **1** | **Operations Dashboard** | **Fully Implemented** | Live metrics, delivery status pie chart, priority bar chart, vehicle capacity utilization bars, recent shipments table. |
| **2** | **Delivery Order Management** | **Fully Implemented** | Full CRUD operations, auto-generated order IDs (`UPS-ORD-XXXX`), search & filter, customer info, address routing, and capacity validation. |
| **3** | Fleet & Vehicle Capacity | Prepared / Foundation | Vehicle capacity data models, live fleet status querying, load calculation rules. |
| **4** | Route Planning & Allocation | Prepared / Foundation | Route models (`DeliveryRoute`), distance, duration, and vehicle allocation hooks. |
| **5** | Delivery Tracking & Reports | Prepared / Foundation | Analytics aggregation hooks and SLA metrics foundation. |

---

## 5. Backend Layered Architecture

```
backend/src/main/java/com/ups/logistics/
├── config/
│   ├── CorsConfig.java            # Cross-Origin configuration for frontend
│   └── DataInitializer.java       # Database seed data (Vehicles, Routes, Orders)
├── controller/
│   ├── DeliveryOrderController.java # Order CRUD, search, filter, and pagination APIs
│   ├── DashboardController.java     # Operational statistics and chart data APIs
│   └── VehicleController.java       # Fleet listing and vehicle capacity APIs
├── dto/
│   ├── ApiResponse.java             # Standard API response wrapper
│   ├── DeliveryOrderRequest.java    # Input validation DTO
│   ├── DeliveryOrderResponse.java   # Serialized order response DTO
│   ├── DashboardStatsResponse.java  # Consolidated dashboard metrics DTO
│   ├── StatusDistributionDTO.java   # Chart distribution DTO
│   ├── PriorityDistributionDTO.java # Priority bar chart DTO
│   └── VehicleCapacityDTO.java      # Capacity utilization DTO
├── entity/
│   ├── DeliveryOrder.java           # Order entity with JPA relationships
│   ├── Vehicle.java                 # Vehicle entity with max capacity limits
│   └── DeliveryRoute.java           # Delivery route entity
├── enums/
│   ├── OrderStatus.java             # PENDING, ASSIGNED, IN_TRANSIT, DELIVERED
│   ├── Priority.java                # LOW, MEDIUM, HIGH
│   ├── VehicleStatus.java           # AVAILABLE, OCCUPIED, MAINTENANCE
│   └── RouteStatus.java             # PLANNED, IN_PROGRESS, COMPLETED
├── exception/
│   ├── GlobalExceptionHandler.java  # ControllerAdvice for clean error responses
│   ├── ResourceNotFoundException.java # 404 handling
│   ├── BadRequestException.java       # 400 validation handling
│   ├── CapacityExceededException.java # Business rule validation
│   └── ErrorResponse.java           # Error JSON payload model
├── repository/
│   ├── DeliveryOrderRepository.java # JPA repository with custom JPQL queries
│   ├── VehicleRepository.java       # Vehicle repository with capacity aggregations
│   └── DeliveryRouteRepository.java # Route repository
└── service/
    ├── DeliveryOrderService.java
    ├── DashboardService.java
    ├── VehicleService.java
    └── impl/
        ├── DeliveryOrderServiceImpl.java
        ├── DashboardServiceImpl.java
        └── VehicleServiceImpl.java
```

---

## 6. Database Setup (PostgreSQL)

1. Ensure PostgreSQL is installed and running on `localhost:5432`.
2. Connect to PostgreSQL and create the database:
   ```sql
   CREATE DATABASE ups_logistics;
   ```
3. Database configuration in `backend/src/main/resources/application.properties`:
   ```properties
   spring.datasource.url=jdbc:postgresql://localhost:5432/ups_logistics
   spring.datasource.username=postgres
   spring.datasource.password=postgres
   spring.jpa.hibernate.ddl-auto=update
   ```
4. On startup, Hibernate automatically creates the tables (`vehicles`, `delivery_routes`, `delivery_orders`) and `DataInitializer` seeds initial UPS fleet and order data for testing.

---

## 7. How to Run the Platform

### A. Run the Spring Boot Backend

Open a terminal in the `backend` folder:

```bash
cd backend
mvn clean compile
mvn spring-boot:run
```

The backend starts at: **`http://localhost:8080`**

### B. Run the React Frontend

Open a second terminal in the `frontend` folder:

```bash
cd frontend
npm install
npm run dev
```

The frontend will be accessible at: **`http://localhost:5173`**

---

## 8. REST API Documentation

| HTTP Method | Endpoint | Description |
|---|---|---|
| `GET` | `/api/dashboard/stats` | Retrieves all dashboard KPIs, charts distribution, and recent orders. |
| `GET` | `/api/dashboard/total-orders` | Returns total order count. |
| `GET` | `/api/dashboard/status-distribution` | Returns order counts categorized by status for pie charts. |
| `GET` | `/api/dashboard/vehicle-stats` | Returns capacity utilization % per vehicle. |
| `GET` | `/api/dashboard/recent-orders` | Returns the 6 most recent orders. |
| `GET` | `/api/orders` | Retrieves all orders with optional `search`, `status`, `priority` filters. |
| `GET` | `/api/orders/paged` | Retrieves orders with pagination and sorting. |
| `GET` | `/api/orders/{id}` | Retrieves a single order by primary key ID. |
| `GET` | `/api/orders/tracking/{orderId}` | Retrieves order by tracking ID (e.g., `UPS-ORD-1001`). |
| `POST` | `/api/orders` | Creates a new order with automated ID generation and validation. |
| `PUT` | `/api/orders/{id}` | Updates an existing order and recalculates vehicle capacity. |
| `DELETE` | `/api/orders/{id}` | Deletes an order and relieves allocated vehicle load. |
| `GET` | `/api/vehicles` | Returns all fleet vehicles with capacity and driver details. |

---

## 9. Core Business Rules

1. **Vehicle Capacity Protection**:
   - Every vehicle has a fixed `maxCapacityKg`.
   - When assigning a delivery package to a vehicle, the system computes `currentLoad + newPackageWeight`.
   - If the projected weight exceeds `maxCapacityKg`, the system rejects the transaction with `CapacityExceededException` (HTTP 400) and displays a clear warning to the user.
2. **Delivery Status Progression**:
   - Orders begin as `PENDING`.
   - When allocated to an available vehicle, the order transitions to `ASSIGNED` and the vehicle state becomes `OCCUPIED`.
   - When dispatched, status updates to `IN_TRANSIT`.
   - Upon delivery (`DELIVERED`), the weight is deducted from the vehicle's active load.
3. **Data Persistence**:
   - All records are saved directly to PostgreSQL. Restarting the backend or refreshing the browser preserves all changes.

---

## 10. Postman Testing

Import the provided file `ups_logistics_postman_collection.json` into Postman:
- Pre-configured with the base URL `http://localhost:8080/api`.
- Includes complete sample request payloads for creating, updating, searching, filtering, and deleting orders, as well as checking all dashboard endpoints.
