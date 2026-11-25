package com.ups.logistics.service.impl;

import com.ups.logistics.dto.DeliveryOrderResponse;
import com.ups.logistics.dto.VehicleRequest;
import com.ups.logistics.entity.DeliveryOrder;
import com.ups.logistics.entity.DeliveryRoute;
import com.ups.logistics.entity.Vehicle;
import com.ups.logistics.enums.VehicleStatus;
import com.ups.logistics.exception.BadRequestException;
import com.ups.logistics.exception.ResourceNotFoundException;
import com.ups.logistics.repository.DeliveryOrderRepository;
import com.ups.logistics.repository.DeliveryRouteRepository;
import com.ups.logistics.repository.VehicleRepository;
import com.ups.logistics.service.VehicleService;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Random;
import java.util.stream.Collectors;

@Service
@Transactional
public class VehicleServiceImpl implements VehicleService {

    private final VehicleRepository vehicleRepository;
    private final DeliveryOrderRepository orderRepository;
    private final DeliveryRouteRepository routeRepository;
    private final Random random = new Random();

    public VehicleServiceImpl(VehicleRepository vehicleRepository,
                              DeliveryOrderRepository orderRepository,
                              DeliveryRouteRepository routeRepository) {
        this.vehicleRepository = vehicleRepository;
        this.orderRepository = orderRepository;
        this.routeRepository = routeRepository;
    }

    @Override
    @Transactional(readOnly = true)
    public List<Vehicle> getAllVehicles() {
        return vehicleRepository.findAll();
    }

    @Override
    @Transactional(readOnly = true)
    public Vehicle getVehicleById(Long id) {
        return vehicleRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Vehicle not found with ID: " + id));
    }

    @Override
    public Vehicle createVehicle(VehicleRequest request) {
        String vNumber = request.getVehicleNumber();
        if (vNumber == null || vNumber.trim().isEmpty()) {
            do {
                vNumber = "V-" + (100 + random.nextInt(900));
            } while (vehicleRepository.existsByVehicleNumber(vNumber));
        } else {
            vNumber = vNumber.trim();
            if (vehicleRepository.existsByVehicleNumber(vNumber)) {
                throw new BadRequestException("Vehicle number " + vNumber + " already exists");
            }
        }

        Vehicle vehicle = new Vehicle();
        vehicle.setVehicleNumber(vNumber);
        vehicle.setModel(request.getModel().trim());
        vehicle.setMaxCapacityKg(request.getMaxCapacityKg());
        vehicle.setCurrentLoadKg(0.0);
        vehicle.setStatus(request.getStatus() != null ? request.getStatus() : VehicleStatus.AVAILABLE);
        vehicle.setDriverName(request.getDriverName().trim());
        vehicle.setDriverContact(request.getDriverContact().trim());

        return vehicleRepository.save(vehicle);
    }

    @Override
    public Vehicle createVehicle(Vehicle vehicle) {
        return vehicleRepository.save(vehicle);
    }

    @Override
    public Vehicle updateVehicle(Long id, VehicleRequest request) {
        Vehicle vehicle = getVehicleById(id);

        if (request.getMaxCapacityKg() != null && request.getMaxCapacityKg() < vehicle.getCurrentLoadKg()) {
            throw new BadRequestException(String.format(
                    "Cannot set max capacity to %.1f kg: current active load is %.1f kg",
                    request.getMaxCapacityKg(), vehicle.getCurrentLoadKg()
            ));
        }

        if (request.getModel() != null && !request.getModel().trim().isEmpty()) {
            vehicle.setModel(request.getModel().trim());
        }
        if (request.getMaxCapacityKg() != null) {
            vehicle.setMaxCapacityKg(request.getMaxCapacityKg());
        }
        if (request.getDriverName() != null && !request.getDriverName().trim().isEmpty()) {
            vehicle.setDriverName(request.getDriverName().trim());
        }
        if (request.getDriverContact() != null && !request.getDriverContact().trim().isEmpty()) {
            vehicle.setDriverContact(request.getDriverContact().trim());
        }
        if (request.getStatus() != null) {
            vehicle.setStatus(request.getStatus());
        }

        return vehicleRepository.save(vehicle);
    }

    @Override
    public void deleteVehicle(Long id) {
        Vehicle vehicle = getVehicleById(id);
        long activeOrders = orderRepository.countByAssignedVehicleId(id);
        if (activeOrders > 0) {
            throw new BadRequestException("Cannot delete vehicle " + vehicle.getVehicleNumber() +
                    " because it has " + activeOrders + " order(s) assigned. Reassign or clear them first.");
        }

        List<DeliveryRoute> routes = routeRepository.findByVehicleId(id);
        if (!routes.isEmpty()) {
            for (DeliveryRoute r : routes) {
                r.setVehicle(null);
                routeRepository.save(r);
            }
        }

        vehicleRepository.delete(vehicle);
    }

    @Override
    public Vehicle toggleMaintenance(Long id) {
        Vehicle vehicle = getVehicleById(id);
        if (vehicle.getStatus() == VehicleStatus.MAINTENANCE) {
            Double activeLoad = orderRepository.calculateCurrentVehicleLoad(id);
            vehicle.setCurrentLoadKg(activeLoad != null ? activeLoad : 0.0);
            vehicle.setStatus(vehicle.getCurrentLoadKg() > 0 ? VehicleStatus.OCCUPIED : VehicleStatus.AVAILABLE);
        } else {
            if (vehicle.getCurrentLoadKg() > 0) {
                throw new BadRequestException("Cannot place vehicle " + vehicle.getVehicleNumber() +
                        " in maintenance while it holds active orders (" + vehicle.getCurrentLoadKg() + " kg).");
            }
            vehicle.setStatus(VehicleStatus.MAINTENANCE);
        }
        return vehicleRepository.save(vehicle);
    }

    @Override
    @Transactional(readOnly = true)
    public List<DeliveryOrderResponse> getOrdersByVehicle(Long vehicleId) {
        getVehicleById(vehicleId); // verify exists
        List<DeliveryOrder> orders = orderRepository.findByAssignedVehicleId(vehicleId);
        return orders.stream().map(this::mapOrderToResponse).collect(Collectors.toList());
    }

    @Override
    public void recalculateVehicleLoads() {
        List<Vehicle> vehicles = vehicleRepository.findAll();
        for (Vehicle v : vehicles) {
            Double activeLoad = orderRepository.calculateCurrentVehicleLoad(v.getId());
            v.setCurrentLoadKg(activeLoad != null ? activeLoad : 0.0);
            if (v.getStatus() != VehicleStatus.MAINTENANCE) {
                if (v.getCurrentLoadKg() > 0) {
                    v.setStatus(VehicleStatus.OCCUPIED);
                } else {
                    v.setStatus(VehicleStatus.AVAILABLE);
                }
            }
            vehicleRepository.save(v);
        }
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
