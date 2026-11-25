package com.ups.logistics.config;

import com.ups.logistics.entity.DeliveryOrder;
import com.ups.logistics.entity.DeliveryRoute;
import com.ups.logistics.entity.Vehicle;
import com.ups.logistics.enums.OrderStatus;
import com.ups.logistics.enums.Priority;
import com.ups.logistics.enums.RouteStatus;
import com.ups.logistics.enums.VehicleStatus;
import com.ups.logistics.repository.DeliveryOrderRepository;
import com.ups.logistics.repository.DeliveryRouteRepository;
import com.ups.logistics.repository.VehicleRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.Arrays;
import java.util.List;

@Component
public class DataInitializer implements CommandLineRunner {

    private static final Logger logger = LoggerFactory.getLogger(DataInitializer.class);

    private final VehicleRepository vehicleRepository;
    private final DeliveryRouteRepository routeRepository;
    private final DeliveryOrderRepository orderRepository;

    public DataInitializer(VehicleRepository vehicleRepository,
                           DeliveryRouteRepository routeRepository,
                           DeliveryOrderRepository orderRepository) {
        this.vehicleRepository = vehicleRepository;
        this.routeRepository = routeRepository;
        this.orderRepository = orderRepository;
    }

    @Override
    @Transactional
    public void run(String... args) {
        if (vehicleRepository.count() == 0) {
            logger.info("Seeding initial fleet vehicles...");
            Vehicle v1 = new Vehicle("V-101", "Freightliner Custom Chassis MT45", 1500.0, 0.0, VehicleStatus.AVAILABLE, "Marcus Reed", "+1-404-555-0144");
            Vehicle v2 = new Vehicle("V-102", "Ford E-450 Super Duty Van", 2200.0, 0.0, VehicleStatus.AVAILABLE, "Elena Rostova", "+1-404-555-0178");
            Vehicle v3 = new Vehicle("V-103", "Mercedes-Benz Sprinter 3500", 1800.0, 0.0, VehicleStatus.AVAILABLE, "Jamal Washington", "+1-404-555-0199");
            Vehicle v4 = new Vehicle("V-104", "Navistar International DuraStar", 4500.0, 0.0, VehicleStatus.AVAILABLE, "Carlos Santana", "+1-404-555-0211");
            Vehicle v5 = new Vehicle("V-105", "Freightliner MT55 Heavy Duty", 3200.0, 0.0, VehicleStatus.AVAILABLE, "Liam Gallagher", "+1-404-555-0233");
            Vehicle v6 = new Vehicle("V-106", "Ford Transit High Roof 250", 1200.0, 0.0, VehicleStatus.MAINTENANCE, "Sarah Connor", "+1-404-555-0255");

            List<Vehicle> savedVehicles = vehicleRepository.saveAll(Arrays.asList(v1, v2, v3, v4, v5, v6));

            logger.info("Seeding initial delivery routes...");
            DeliveryRoute r1 = new DeliveryRoute("RT-ATL-HUB-01", "Atlanta Sorting Hub, GA", "Downtown Business District, GA", 42.5, 1.8, RouteStatus.IN_PROGRESS, savedVehicles.get(0));
            DeliveryRoute r2 = new DeliveryRoute("RT-ATL-METRO-02", "Atlanta Sorting Hub, GA", "Buckhead Commercial Plaza, GA", 68.0, 2.5, RouteStatus.IN_PROGRESS, savedVehicles.get(1));
            DeliveryRoute r3 = new DeliveryRoute("RT-SAV-CORR-03", "Atlanta Sorting Hub, GA", "Savannah Industrial Terminal, GA", 395.0, 5.2, RouteStatus.PLANNED, savedVehicles.get(3));
            DeliveryRoute r4 = new DeliveryRoute("RT-AUG-EXPR-04", "Atlanta Sorting Hub, GA", "Augusta Regional Distribution, GA", 235.0, 3.8, RouteStatus.COMPLETED, savedVehicles.get(2));

            routeRepository.saveAll(Arrays.asList(r1, r2, r3, r4));

            if (orderRepository.count() == 0) {
                logger.info("Seeding initial delivery orders...");

                DeliveryOrder o1 = new DeliveryOrder(
                        "ORD-1001",
                        "Acme Industrial Corp",
                        "+1-404-555-8821",
                        "1200 Techwood Dr NW, Atlanta, GA 30318",
                        "450 Peachtree St NE, Atlanta, GA 30308",
                        85.5,
                        Priority.HIGH,
                        LocalDate.now().minusDays(1),
                        OrderStatus.IN_TRANSIT
                );
                o1.setAssignedVehicle(savedVehicles.get(0));
                o1.setAssignedRoute(r1);
                o1.setNotes("Critical server hardware parts. Handle with fragile tag.");

                DeliveryOrder o2 = new DeliveryOrder(
                        "ORD-1002",
                        "Apex Medical Supplies",
                        "+1-404-555-9932",
                        "80 Jesse Hill Jr Dr SE, Atlanta, GA 30303",
                        "3400 Howell Mill Rd NW, Atlanta, GA 30327",
                        120.0,
                        Priority.HIGH,
                        LocalDate.now().minusDays(1),
                        OrderStatus.IN_TRANSIT
                );
                o2.setAssignedVehicle(savedVehicles.get(0));
                o2.setAssignedRoute(r1);
                o2.setNotes("Temperature-controlled diagnostic supplies.");

                DeliveryOrder o3 = new DeliveryOrder(
                        "ORD-1003",
                        "Global Retail Distribution",
                        "+1-678-555-1243",
                        "500 Southlake Pkwy, Morrow, GA 30260",
                        "3393 Peachtree Rd NE, Atlanta, GA 30326",
                        340.0,
                        Priority.MEDIUM,
                        LocalDate.now(),
                        OrderStatus.ASSIGNED
                );
                o3.setAssignedVehicle(savedVehicles.get(1));
                o3.setAssignedRoute(r2);
                o3.setNotes("Bulk retail consumer electronics.");

                DeliveryOrder o4 = new DeliveryOrder(
                        "ORD-1004",
                        "BioTech Laboratories",
                        "+1-404-555-4411",
                        "1510 Clifton Rd, Atlanta, GA 30322",
                        "2200 Century Pkwy NE, Atlanta, GA 30345",
                        15.0,
                        Priority.HIGH,
                        LocalDate.now(),
                        OrderStatus.PENDING
                );
                o4.setNotes("Special handling: refrigerate upon delivery.");

                DeliveryOrder o5 = new DeliveryOrder(
                        "ORD-1005",
                        "Pinnacle Publishing Group",
                        "+1-770-555-7765",
                        "100 Galleria Pkwy, Atlanta, GA 30339",
                        "75 5th St NW, Atlanta, GA 30308",
                        45.0,
                        Priority.LOW,
                        LocalDate.now(),
                        OrderStatus.PENDING
                );
                o5.setNotes("Standard carton books.");

                DeliveryOrder o6 = new DeliveryOrder(
                        "ORD-1006",
                        "Starlight Office Furnishings",
                        "+1-404-555-3344",
                        "200 Northside Dr NW, Atlanta, GA 30313",
                        "1180 W Peachtree St NW, Atlanta, GA 30309",
                        210.0,
                        Priority.MEDIUM,
                        LocalDate.now().minusDays(2),
                        OrderStatus.DELIVERED
                );
                o6.setAssignedVehicle(savedVehicles.get(2));
                o6.setAssignedRoute(r4);
                o6.setNotes("Signature required on delivery. Received by security.");

                DeliveryOrder o7 = new DeliveryOrder(
                        "ORD-1007",
                        "Horizon Aerospace Logistics",
                        "+1-912-555-6677",
                        "100 Hartsfield Center Pkwy, Atlanta, GA 30354",
                        "1400 Aviation Way, Savannah, GA 31408",
                        520.0,
                        Priority.HIGH,
                        LocalDate.now(),
                        OrderStatus.ASSIGNED
                );
                o7.setAssignedVehicle(savedVehicles.get(3));
                o7.setAssignedRoute(r3);
                o7.setNotes("Aircraft replacement components.");

                DeliveryOrder o8 = new DeliveryOrder(
                        "ORD-1008",
                        "Metro Legal Services",
                        "+1-404-555-2288",
                        "191 Peachtree St NE, Atlanta, GA 30303",
                        "104 Marietta St NW, Atlanta, GA 30303",
                        3.5,
                        Priority.LOW,
                        LocalDate.now().minusDays(3),
                        OrderStatus.DELIVERED
                );
                o8.setNotes("Legal affidavits dossier. Completed successfully.");

                orderRepository.saveAll(Arrays.asList(o1, o2, o3, o4, o5, o6, o7, o8));

                // Update vehicle loads based on assigned active orders
                // v1: o1 (85.5) + o2 (120.0) = 205.5 kg
                savedVehicles.get(0).setCurrentLoadKg(205.5);
                savedVehicles.get(0).setStatus(VehicleStatus.OCCUPIED);

                // v2: o3 (340.0) = 340.0 kg
                savedVehicles.get(1).setCurrentLoadKg(340.0);
                savedVehicles.get(1).setStatus(VehicleStatus.OCCUPIED);

                // v4 (index 3): o7 (520.0) = 520.0 kg
                savedVehicles.get(3).setCurrentLoadKg(520.0);
                savedVehicles.get(3).setStatus(VehicleStatus.OCCUPIED);

                vehicleRepository.saveAll(savedVehicles);

                logger.info("Sample UPS logistics data initialized successfully.");
            }
        }
    }
}
