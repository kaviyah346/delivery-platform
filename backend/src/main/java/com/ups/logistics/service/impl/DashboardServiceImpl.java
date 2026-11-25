package com.ups.logistics.service.impl;

import com.ups.logistics.dto.*;
import com.ups.logistics.entity.DeliveryOrder;
import com.ups.logistics.entity.Vehicle;
import com.ups.logistics.enums.OrderStatus;
import com.ups.logistics.enums.Priority;
import com.ups.logistics.enums.RouteStatus;
import com.ups.logistics.enums.VehicleStatus;
import com.ups.logistics.repository.DeliveryOrderRepository;
import com.ups.logistics.repository.DeliveryRouteRepository;
import com.ups.logistics.repository.VehicleRepository;
import com.ups.logistics.service.DashboardService;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

@Service
@Transactional(readOnly = true)
public class DashboardServiceImpl implements DashboardService {

    private final DeliveryOrderRepository orderRepository;
    private final VehicleRepository vehicleRepository;
    private final DeliveryRouteRepository routeRepository;

    public DashboardServiceImpl(DeliveryOrderRepository orderRepository,
                                VehicleRepository vehicleRepository,
                                DeliveryRouteRepository routeRepository) {
        this.orderRepository = orderRepository;
        this.vehicleRepository = vehicleRepository;
        this.routeRepository = routeRepository;
    }

    @Override
    public DashboardStatsResponse getDashboardStats() {
        DashboardStatsResponse stats = new DashboardStatsResponse();

        // 1. Order counts
        long totalOrders = orderRepository.count();
        long pending = orderRepository.countByStatus(OrderStatus.PENDING);
        long assigned = orderRepository.countByStatus(OrderStatus.ASSIGNED);
        long inTransit = orderRepository.countByStatus(OrderStatus.IN_TRANSIT);
        long delivered = orderRepository.countByStatus(OrderStatus.DELIVERED);

        stats.setTotalDeliveryOrders(totalOrders);
        stats.setPendingDeliveries(pending);
        stats.setAssignedDeliveries(assigned);
        stats.setInTransitDeliveries(inTransit);
        stats.setDeliveredOrders(delivered);

        // 2. Vehicle counts
        long availableVehicles = vehicleRepository.countByStatus(VehicleStatus.AVAILABLE);
        long occupiedVehicles = vehicleRepository.countByStatus(VehicleStatus.OCCUPIED);
        long maintenanceVehicles = vehicleRepository.countByStatus(VehicleStatus.MAINTENANCE);
        long totalVehicles = vehicleRepository.count();

        stats.setAvailableVehicles(availableVehicles);
        stats.setOccupiedVehicles(occupiedVehicles);
        stats.setMaintenanceVehicles(maintenanceVehicles);
        stats.setTotalVehicles(totalVehicles);

        // 3. Route counts
        long activeRoutes = routeRepository.countByStatus(RouteStatus.IN_PROGRESS);
        long totalRoutes = routeRepository.count();

        stats.setActiveDeliveryRoutes(activeRoutes);
        stats.setTotalRoutes(totalRoutes);

        // 4. Capacity utilization
        Double totalCap = vehicleRepository.sumTotalMaxCapacity();
        double totalCapacity = totalCap != null ? totalCap : 0.0;

        Double currentLoad = vehicleRepository.sumTotalCurrentLoad();
        double assignedLoad = currentLoad != null ? currentLoad : 0.0;

        double utilization = totalCapacity > 0 ? (assignedLoad / totalCapacity) * 100.0 : 0.0;

        stats.setTotalFleetCapacityKg(Math.round(totalCapacity * 10.0) / 10.0);
        stats.setCurrentAssignedLoadKg(Math.round(assignedLoad * 10.0) / 10.0);
        stats.setFleetUtilizationPercentage(Math.round(utilization * 10.0) / 10.0);

        // 5. Status distribution
        stats.setStatusDistribution(getStatusDistribution());

        // 6. Priority distribution
        stats.setPriorityDistribution(getPriorityDistribution());

        // 7. Vehicle utilization list
        stats.setVehicleUtilizationList(getVehicleCapacityUtilization());

        // 8. Recent orders
        stats.setRecentOrders(getRecentOrders(6));

        return stats;
    }

    @Override
    public long getTotalOrders() {
        return orderRepository.count();
    }

    @Override
    public List<StatusDistributionDTO> getStatusDistribution() {
        List<StatusDistributionDTO> list = new ArrayList<>();
        // UPS Palette: Amber / Golden Yellow, Dark Brown, Blue, Green
        list.add(new StatusDistributionDTO("Pending", orderRepository.countByStatus(OrderStatus.PENDING), "#F59E0B"));
        list.add(new StatusDistributionDTO("Assigned", orderRepository.countByStatus(OrderStatus.ASSIGNED), "#3B82F6"));
        list.add(new StatusDistributionDTO("In Transit", orderRepository.countByStatus(OrderStatus.IN_TRANSIT), "#8B5CF6"));
        list.add(new StatusDistributionDTO("Delivered", orderRepository.countByStatus(OrderStatus.DELIVERED), "#10B981"));
        return list;
    }

    private List<PriorityDistributionDTO> getPriorityDistribution() {
        List<PriorityDistributionDTO> list = new ArrayList<>();
        list.add(new PriorityDistributionDTO("High", orderRepository.countByPriority(Priority.HIGH), "#EF4444"));
        list.add(new PriorityDistributionDTO("Medium", orderRepository.countByPriority(Priority.MEDIUM), "#F59E0B"));
        list.add(new PriorityDistributionDTO("Low", orderRepository.countByPriority(Priority.LOW), "#10B981"));
        return list;
    }

    @Override
    public List<VehicleCapacityDTO> getVehicleCapacityUtilization() {
        List<Vehicle> vehicles = vehicleRepository.findAll();
        return vehicles.stream().map(v -> {
            double util = v.getMaxCapacityKg() > 0 ? (v.getCurrentLoadKg() / v.getMaxCapacityKg()) * 100.0 : 0.0;
            return new VehicleCapacityDTO(
                    v.getId(),
                    v.getVehicleNumber(),
                    v.getModel(),
                    v.getMaxCapacityKg(),
                    v.getCurrentLoadKg(),
                    Math.round(util * 10.0) / 10.0,
                    v.getStatus().name()
            );
        }).collect(Collectors.toList());
    }

    @Override
    public List<DeliveryOrderResponse> getRecentOrders(int limit) {
        List<DeliveryOrder> orders = orderRepository.findTop10ByOrderByCreatedAtDesc();
        return orders.stream()
                .limit(limit)
                .map(this::mapToResponse)
                .collect(Collectors.toList());
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
