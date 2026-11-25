package com.ups.logistics.service.impl;

import com.ups.logistics.dto.DeliveryOrderRequest;
import com.ups.logistics.dto.DeliveryOrderResponse;
import com.ups.logistics.entity.DeliveryOrder;
import com.ups.logistics.entity.DeliveryRoute;
import com.ups.logistics.entity.Vehicle;
import com.ups.logistics.enums.OrderStatus;
import com.ups.logistics.enums.Priority;
import com.ups.logistics.enums.VehicleStatus;
import com.ups.logistics.exception.BadRequestException;
import com.ups.logistics.exception.CapacityExceededException;
import com.ups.logistics.exception.ResourceNotFoundException;
import com.ups.logistics.repository.DeliveryOrderRepository;
import com.ups.logistics.repository.DeliveryRouteRepository;
import com.ups.logistics.repository.VehicleRepository;
import com.ups.logistics.service.DeliveryOrderService;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.List;
import java.util.Random;
import java.util.stream.Collectors;

@Service
@Transactional
public class DeliveryOrderServiceImpl implements DeliveryOrderService {

    private final DeliveryOrderRepository orderRepository;
    private final VehicleRepository vehicleRepository;
    private final DeliveryRouteRepository routeRepository;
    private final Random random = new Random();

    public DeliveryOrderServiceImpl(DeliveryOrderRepository orderRepository,
                                   VehicleRepository vehicleRepository,
                                   DeliveryRouteRepository routeRepository) {
        this.orderRepository = orderRepository;
        this.vehicleRepository = vehicleRepository;
        this.routeRepository = routeRepository;
    }

    @Override
    public DeliveryOrderResponse createOrder(DeliveryOrderRequest request) {
        DeliveryOrder order = new DeliveryOrder();

        // 1. Order ID Generation
        if (request.getOrderId() != null && !request.getOrderId().trim().isEmpty()) {
            if (orderRepository.existsByOrderId(request.getOrderId().trim())) {
                throw new BadRequestException("Order ID " + request.getOrderId() + " already exists");
            }
            order.setOrderId(request.getOrderId().trim());
        } else {
            order.setOrderId(generateUniqueOrderId());
        }

        // 2. Set basic fields
        order.setCustomerName(request.getCustomerName().trim());
        order.setCustomerContact(request.getCustomerContact().trim());
        order.setPickupAddress(request.getPickupAddress().trim());
        order.setDestinationAddress(request.getDestinationAddress().trim());
        order.setPackageWeight(request.getPackageWeight());
        order.setPriority(request.getPriority() != null ? request.getPriority() : Priority.MEDIUM);
        order.setOrderDate(request.getOrderDate() != null ? request.getOrderDate() : LocalDate.now());
        order.setStatus(request.getStatus() != null ? request.getStatus() : OrderStatus.PENDING);
        order.setNotes(request.getNotes());

        // 3. Vehicle Capacity check and assignment if requested
        if (request.getVehicleId() != null) {
            assignVehicleToOrder(order, request.getVehicleId(), request.getPackageWeight());
        }

        // 4. Route assignment if requested
        if (request.getRouteId() != null) {
            DeliveryRoute route = routeRepository.findById(request.getRouteId())
                    .orElseThrow(() -> new ResourceNotFoundException("Delivery route not found with ID: " + request.getRouteId()));
            order.setAssignedRoute(route);
        }

        DeliveryOrder savedOrder = orderRepository.save(order);
        return mapToResponse(savedOrder);
    }

    @Override
    @Transactional(readOnly = true)
    public List<DeliveryOrderResponse> getAllOrders(String search, OrderStatus status, Priority priority) {
        List<DeliveryOrder> orders = orderRepository.searchAndFilter(
                (search != null && !search.trim().isEmpty()) ? search.trim() : null,
                status,
                priority
        );
        return orders.stream().map(this::mapToResponse).collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public Page<DeliveryOrderResponse> getAllOrdersPaged(String search, OrderStatus status, Priority priority, Pageable pageable) {
        Page<DeliveryOrder> orderPage = orderRepository.searchAndFilterPaged(
                (search != null && !search.trim().isEmpty()) ? search.trim() : null,
                status,
                priority,
                pageable
        );
        return orderPage.map(this::mapToResponse);
    }

    @Override
    @Transactional(readOnly = true)
    public DeliveryOrderResponse getOrderById(Long id) {
        DeliveryOrder order = orderRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Delivery order not found with ID: " + id));
        return mapToResponse(order);
    }

    @Override
    @Transactional(readOnly = true)
    public DeliveryOrderResponse getOrderByOrderId(String orderId) {
        DeliveryOrder order = orderRepository.findByOrderId(orderId)
                .orElseThrow(() -> new ResourceNotFoundException("Delivery order not found with Order ID: " + orderId));
        return mapToResponse(order);
    }

    @Override
    public DeliveryOrderResponse updateOrder(Long id, DeliveryOrderRequest request) {
        DeliveryOrder order = orderRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Delivery order not found with ID: " + id));

        // If order ID is changed, verify uniqueness
        if (request.getOrderId() != null && !request.getOrderId().equalsIgnoreCase(order.getOrderId())) {
            if (orderRepository.existsByOrderId(request.getOrderId().trim())) {
                throw new BadRequestException("Order ID " + request.getOrderId() + " is already in use");
            }
            order.setOrderId(request.getOrderId().trim());
        }

        order.setCustomerName(request.getCustomerName().trim());
        order.setCustomerContact(request.getCustomerContact().trim());
        order.setPickupAddress(request.getPickupAddress().trim());
        order.setDestinationAddress(request.getDestinationAddress().trim());
        order.setPackageWeight(request.getPackageWeight());
        order.setPriority(request.getPriority());
        if (request.getOrderDate() != null) {
            order.setOrderDate(request.getOrderDate());
        }
        order.setStatus(request.getStatus());
        order.setNotes(request.getNotes());

        // Vehicle Assignment & Capacity Check
        Vehicle previousVehicle = order.getAssignedVehicle();
        if (request.getVehicleId() != null) {
            if (previousVehicle == null || !previousVehicle.getId().equals(request.getVehicleId())) {
                // If previous vehicle existed, subtract current order weight from it
                if (previousVehicle != null && order.getStatus() != OrderStatus.DELIVERED) {
                    double updatedLoad = Math.max(0.0, previousVehicle.getCurrentLoadKg() - order.getPackageWeight());
                    previousVehicle.setCurrentLoadKg(updatedLoad);
                    if (updatedLoad == 0.0) {
                        previousVehicle.setStatus(VehicleStatus.AVAILABLE);
                    }
                    vehicleRepository.save(previousVehicle);
                }
                // Assign new vehicle
                assignVehicleToOrder(order, request.getVehicleId(), request.getPackageWeight());
            } else {
                // Same vehicle, recalculate load if weight changed or status changed
                recalculateLoadForVehicle(previousVehicle);
            }
        } else if (previousVehicle != null) {
            // Vehicle removed
            order.setAssignedVehicle(null);
            recalculateLoadForVehicle(previousVehicle);
        }

        // Route assignment
        if (request.getRouteId() != null) {
            DeliveryRoute route = routeRepository.findById(request.getRouteId())
                    .orElseThrow(() -> new ResourceNotFoundException("Delivery route not found with ID: " + request.getRouteId()));
            order.setAssignedRoute(route);
        } else {
            order.setAssignedRoute(null);
        }

        // If order is delivered, release vehicle load
        if (order.getStatus() == OrderStatus.DELIVERED && order.getAssignedVehicle() != null) {
            recalculateLoadForVehicle(order.getAssignedVehicle());
        }

        DeliveryOrder updatedOrder = orderRepository.save(order);
        return mapToResponse(updatedOrder);
    }

    @Override
    public void deleteOrder(Long id) {
        DeliveryOrder order = orderRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Delivery order not found with ID: " + id));

        Vehicle vehicle = order.getAssignedVehicle();
        orderRepository.delete(order);

        if (vehicle != null) {
            recalculateLoadForVehicle(vehicle);
        }
    }

    private void assignVehicleToOrder(DeliveryOrder order, Long vehicleId, Double packageWeight) {
        Vehicle vehicle = vehicleRepository.findById(vehicleId)
                .orElseThrow(() -> new ResourceNotFoundException("Vehicle not found with ID: " + vehicleId));

        if (vehicle.getStatus() == VehicleStatus.MAINTENANCE) {
            throw new BadRequestException("Vehicle " + vehicle.getVehicleNumber() + " is currently under maintenance");
        }

        double currentActiveLoad = orderRepository.calculateCurrentVehicleLoad(vehicleId);
        double projectedLoad = currentActiveLoad + packageWeight;

        if (projectedLoad > vehicle.getMaxCapacityKg()) {
            throw new CapacityExceededException(String.format(
                    "Vehicle capacity exceeded! Vehicle %s maximum capacity is %.1f kg, currently loaded with %.1f kg. Adding package of %.1f kg would reach %.1f kg.",
                    vehicle.getVehicleNumber(), vehicle.getMaxCapacityKg(), currentActiveLoad, packageWeight, projectedLoad
            ));
        }

        order.setAssignedVehicle(vehicle);
        vehicle.setCurrentLoadKg(projectedLoad);
        vehicle.setStatus(VehicleStatus.OCCUPIED);
        vehicleRepository.save(vehicle);
    }

    private void recalculateLoadForVehicle(Vehicle vehicle) {
        Double activeLoad = orderRepository.calculateCurrentVehicleLoad(vehicle.getId());
        vehicle.setCurrentLoadKg(activeLoad != null ? activeLoad : 0.0);
        if (vehicle.getCurrentLoadKg() <= 0.0) {
            vehicle.setStatus(VehicleStatus.AVAILABLE);
        } else {
            vehicle.setStatus(VehicleStatus.OCCUPIED);
        }
        vehicleRepository.save(vehicle);
    }

    private String generateUniqueOrderId() {
        String generated;
        do {
            int randomNum = 1000 + random.nextInt(9000);
            generated = "ORD-" + randomNum;
        } while (orderRepository.existsByOrderId(generated));
        return generated;
    }

    private DeliveryOrderResponse mapToResponse(DeliveryOrder order) {
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
