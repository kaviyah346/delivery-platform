package com.ups.logistics.service.impl;

import com.ups.logistics.dto.DeliveryOrderResponse;
import com.ups.logistics.dto.RouteAssignmentRequest;
import com.ups.logistics.dto.RouteRequest;
import com.ups.logistics.dto.RouteResponse;
import com.ups.logistics.entity.DeliveryOrder;
import com.ups.logistics.entity.DeliveryRoute;
import com.ups.logistics.entity.Vehicle;
import com.ups.logistics.enums.OrderStatus;
import com.ups.logistics.enums.RouteStatus;
import com.ups.logistics.enums.VehicleStatus;
import com.ups.logistics.exception.BadRequestException;
import com.ups.logistics.exception.CapacityExceededException;
import com.ups.logistics.exception.ResourceNotFoundException;
import com.ups.logistics.repository.DeliveryOrderRepository;
import com.ups.logistics.repository.DeliveryRouteRepository;
import com.ups.logistics.repository.VehicleRepository;
import com.ups.logistics.service.DeliveryRouteService;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.*;
import java.util.stream.Collectors;

@Service
@Transactional
public class DeliveryRouteServiceImpl implements DeliveryRouteService {

    private final DeliveryRouteRepository routeRepository;
    private final VehicleRepository vehicleRepository;
    private final DeliveryOrderRepository orderRepository;
    private final Random random = new Random();

    public DeliveryRouteServiceImpl(DeliveryRouteRepository routeRepository,
                                    VehicleRepository vehicleRepository,
                                    DeliveryOrderRepository orderRepository) {
        this.routeRepository = routeRepository;
        this.vehicleRepository = vehicleRepository;
        this.orderRepository = orderRepository;
    }

    @Override
    @Transactional(readOnly = true)
    public List<RouteResponse> getAllRoutes(String search, RouteStatus status) {
        List<DeliveryRoute> routes = routeRepository.findAll();

        return routes.stream()
                .filter(r -> {
                    if (status != null && r.getStatus() != status) {
                        return false;
                    }
                    if (search != null && !search.trim().isEmpty()) {
                        String s = search.trim().toLowerCase();
                        return r.getRouteCode().toLowerCase().contains(s) ||
                               r.getOrigin().toLowerCase().contains(s) ||
                               r.getDestination().toLowerCase().contains(s);
                    }
                    return true;
                })
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public RouteResponse getRouteById(Long id) {
        DeliveryRoute route = routeRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Route not found with ID: " + id));
        return mapToResponse(route);
    }

    @Override
    public RouteResponse createRoute(RouteRequest request) {
        String routeCode = request.getRouteCode();
        if (routeCode == null || routeCode.trim().isEmpty()) {
            do {
                routeCode = "RT-" + (1000 + random.nextInt(9000));
            } while (routeRepository.existsByRouteCode(routeCode));
        } else {
            routeCode = routeCode.trim();
            if (routeRepository.existsByRouteCode(routeCode)) {
                throw new BadRequestException("Route code " + routeCode + " already exists");
            }
        }

        DeliveryRoute route = new DeliveryRoute();
        route.setRouteCode(routeCode);
        route.setOrigin(request.getOrigin().trim());
        route.setDestination(request.getDestination().trim());
        route.setTotalDistanceKm(request.getTotalDistanceKm());
        route.setEstimatedDurationHours(request.getEstimatedDurationHours());
        route.setStatus(request.getStatus() != null ? request.getStatus() : RouteStatus.PLANNED);

        if (request.getVehicleId() != null) {
            Vehicle vehicle = vehicleRepository.findById(request.getVehicleId())
                    .orElseThrow(() -> new ResourceNotFoundException("Vehicle not found with ID: " + request.getVehicleId()));
            route.setVehicle(vehicle);
        }

        DeliveryRoute savedRoute = routeRepository.save(route);

        // Assign orders if provided
        if (request.getOrderIds() != null && !request.getOrderIds().isEmpty()) {
            assignOrdersToRoute(savedRoute.getId(), new RouteAssignmentRequest(request.getOrderIds()));
        }

        return mapToResponse(savedRoute);
    }

    @Override
    public RouteResponse updateRoute(Long id, RouteRequest request) {
        DeliveryRoute route = routeRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Route not found with ID: " + id));

        if (request.getOrigin() != null && !request.getOrigin().trim().isEmpty()) {
            route.setOrigin(request.getOrigin().trim());
        }
        if (request.getDestination() != null && !request.getDestination().trim().isEmpty()) {
            route.setDestination(request.getDestination().trim());
        }
        if (request.getTotalDistanceKm() != null) {
            route.setTotalDistanceKm(request.getTotalDistanceKm());
        }
        if (request.getEstimatedDurationHours() != null) {
            route.setEstimatedDurationHours(request.getEstimatedDurationHours());
        }
        if (request.getStatus() != null) {
            route.setStatus(request.getStatus());
        }

        if (request.getVehicleId() != null) {
            Vehicle vehicle = vehicleRepository.findById(request.getVehicleId())
                    .orElseThrow(() -> new ResourceNotFoundException("Vehicle not found with ID: " + request.getVehicleId()));
            route.setVehicle(vehicle);

            // Also update vehicle on all orders currently assigned to this route
            List<DeliveryOrder> assignedOrders = orderRepository.findByAssignedRouteId(id);
            for (DeliveryOrder o : assignedOrders) {
                o.setAssignedVehicle(vehicle);
                orderRepository.save(o);
            }
            recalculateVehicleLoad(vehicle);
        }

        DeliveryRoute updated = routeRepository.save(route);
        return mapToResponse(updated);
    }

    @Override
    public void deleteRoute(Long id) {
        DeliveryRoute route = routeRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Route not found with ID: " + id));

        // Detach orders from this route
        List<DeliveryOrder> assignedOrders = orderRepository.findByAssignedRouteId(id);
        for (DeliveryOrder o : assignedOrders) {
            o.setAssignedRoute(null);
            orderRepository.save(o);
        }

        routeRepository.delete(route);
    }

    @Override
    public RouteResponse assignOrdersToRoute(Long routeId, RouteAssignmentRequest request) {
        DeliveryRoute route = routeRepository.findById(routeId)
                .orElseThrow(() -> new ResourceNotFoundException("Route not found with ID: " + routeId));

        if (request.getOrderIds() == null || request.getOrderIds().isEmpty()) {
            return mapToResponse(route);
        }

        Vehicle vehicle = route.getVehicle();
        double additionalWeight = 0.0;

        List<DeliveryOrder> ordersToAssign = new ArrayList<>();
        for (Long orderId : request.getOrderIds()) {
            DeliveryOrder order = orderRepository.findById(orderId)
                    .orElseThrow(() -> new ResourceNotFoundException("Order not found with ID: " + orderId));
            ordersToAssign.add(order);
            // If the order wasn't already assigned to this vehicle, add to additional weight
            if (vehicle != null && (order.getAssignedVehicle() == null || !order.getAssignedVehicle().getId().equals(vehicle.getId()))) {
                additionalWeight += order.getPackageWeight();
            }
        }

        if (vehicle != null) {
            Double currentLoad = orderRepository.calculateCurrentVehicleLoad(vehicle.getId());
            double safeCurrent = currentLoad != null ? currentLoad : 0.0;
            double projectedLoad = safeCurrent + additionalWeight;

            if (projectLoadExceeds(vehicle.getMaxCapacityKg(), projectedLoad)) {
                throw new CapacityExceededException(
                        vehicle.getId(),
                        vehicle.getMaxCapacityKg(),
                        safeCurrent,
                        additionalWeight
                );
            }
        }

        for (DeliveryOrder order : ordersToAssign) {
            order.setAssignedRoute(route);
            if (vehicle != null) {
                order.setAssignedVehicle(vehicle);
                if (order.getStatus() == OrderStatus.PENDING) {
                    order.setStatus(OrderStatus.ASSIGNED);
                }
            }
            orderRepository.save(order);
        }

        if (vehicle != null) {
            recalculateVehicleLoad(vehicle);
        }

        return mapToResponse(route);
    }

    @Override
    public Map<String, Object> autoAllocateOrders() {
        List<DeliveryOrder> pendingOrders = orderRepository.findByAssignedVehicleIsNull();
        List<Vehicle> availableVehicles = vehicleRepository.findAll().stream()
                .filter(v -> v.getStatus() != VehicleStatus.MAINTENANCE)
                .collect(Collectors.toList());

        List<DeliveryRoute> activeRoutes = routeRepository.findAll();

        int allocatedCount = 0;
        int skippedCount = 0;
        List<String> allocationLogs = new ArrayList<>();

        // Sort pending orders by weight descending to fit larger items first
        pendingOrders.sort((a, b) -> Double.compare(b.getPackageWeight(), a.getPackageWeight()));

        for (DeliveryOrder order : pendingOrders) {
            boolean allocated = false;
            for (Vehicle vehicle : availableVehicles) {
                Double currentLoad = orderRepository.calculateCurrentVehicleLoad(vehicle.getId());
                double safeLoad = currentLoad != null ? currentLoad : 0.0;
                double remaining = vehicle.getMaxCapacityKg() - safeLoad;

                if (remaining >= order.getPackageWeight()) {
                    order.setAssignedVehicle(vehicle);
                    order.setStatus(OrderStatus.ASSIGNED);

                    // Find route associated with vehicle or default route
                    DeliveryRoute matchingRoute = activeRoutes.stream()
                            .filter(r -> r.getVehicle() != null && r.getVehicle().getId().equals(vehicle.getId()))
                            .findFirst()
                            .orElse(null);

                    if (matchingRoute != null) {
                        order.setAssignedRoute(matchingRoute);
                    }

                    orderRepository.save(order);
                    recalculateVehicleLoad(vehicle);

                    allocationLogs.add("Order " + order.getOrderId() + " (" + order.getPackageWeight() +
                            " kg) assigned to " + vehicle.getVehicleNumber() + " (Remaining: " +
                            String.format("%.1f", remaining - order.getPackageWeight()) + " kg)");
                    allocated = true;
                    allocatedCount++;
                    break;
                }
            }
            if (!allocated) {
                skippedCount++;
            }
        }

        Map<String, Object> result = new HashMap<>();
        result.put("allocatedCount", allocatedCount);
        result.put("unallocatedCount", skippedCount);
        result.put("totalPendingEvaluated", pendingOrders.size());
        result.put("logs", allocationLogs);
        return result;
    }

    private boolean projectLoadExceeds(Double maxCap, double projected) {
        return projected > maxCap;
    }

    private void recalculateVehicleLoad(Vehicle vehicle) {
        Double activeLoad = orderRepository.calculateCurrentVehicleLoad(vehicle.getId());
        vehicle.setCurrentLoadKg(activeLoad != null ? activeLoad : 0.0);
        if (vehicle.getStatus() != VehicleStatus.MAINTENANCE) {
            vehicle.setStatus(vehicle.getCurrentLoadKg() > 0 ? VehicleStatus.OCCUPIED : VehicleStatus.AVAILABLE);
        }
        vehicleRepository.save(vehicle);
    }

    private RouteResponse mapToResponse(DeliveryRoute route) {
        RouteResponse res = new RouteResponse();
        res.setId(route.getId());
        res.setRouteCode(route.getRouteCode());
        res.setOrigin(route.getOrigin());
        res.setDestination(route.getDestination());
        res.setTotalDistanceKm(route.getTotalDistanceKm());
        res.setEstimatedDurationHours(route.getEstimatedDurationHours());
        res.setStatus(route.getStatus());
        res.setCreatedAt(route.getCreatedAt());
        res.setUpdatedAt(route.getUpdatedAt());

        if (route.getVehicle() != null) {
            Vehicle v = route.getVehicle();
            res.setVehicleId(v.getId());
            res.setVehicleNumber(v.getVehicleNumber());
            res.setVehicleModel(v.getModel());
            res.setVehicleMaxCapacityKg(v.getMaxCapacityKg());
            res.setVehicleCurrentLoadKg(v.getCurrentLoadKg());
            res.setDriverName(v.getDriverName());
            res.setDriverContact(v.getDriverContact());
        }

        List<DeliveryOrder> orders = orderRepository.findByAssignedRouteId(route.getId());
        res.setAssignedOrdersCount(orders.size());
        double totalWeight = orders.stream().mapToDouble(DeliveryOrder::getPackageWeight).sum();
        res.setTotalAssignedWeightKg(totalWeight);
        res.setAssignedOrders(orders.stream().map(this::mapOrderToResponse).collect(Collectors.toList()));

        return res;
    }

    private DeliveryOrderResponse mapOrderToResponse(DeliveryOrder order) {
        DeliveryOrderResponse response = new DeliveryOrderResponse();
        response.setId(order.getId());
        response.setOrderId(order.getOrderId());
        response.setCustomerName(order.getCustomerName());
        response.setCustomerContact(order.getCustomerContact());
        response.setPickupAddress(order.getPickupAddress());
        response.setDestinationAddress(order.getDestinationAddress());
        response.setPackageWeight(order.getPackageWeight());
        response.setPriority(order.getPriority());
        response.setOrderDate(order.getOrderDate());
        response.setStatus(order.getStatus());
        response.setNotes(order.getNotes());
        response.setCreatedAt(order.getCreatedAt());
        response.setUpdatedAt(order.getUpdatedAt());

        if (order.getAssignedVehicle() != null) {
            response.setVehicleId(order.getAssignedVehicle().getId());
            response.setVehicleNumber(order.getAssignedVehicle().getVehicleNumber());
        }

        if (order.getAssignedRoute() != null) {
            response.setRouteId(order.getAssignedRoute().getId());
            response.setRouteCode(order.getAssignedRoute().getRouteCode());
        }

        return response;
    }
}
