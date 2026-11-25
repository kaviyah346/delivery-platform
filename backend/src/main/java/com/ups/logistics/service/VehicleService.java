package com.ups.logistics.service;

import com.ups.logistics.dto.DeliveryOrderResponse;
import com.ups.logistics.dto.VehicleRequest;
import com.ups.logistics.entity.Vehicle;

import java.util.List;

public interface VehicleService {

    List<Vehicle> getAllVehicles();

    Vehicle getVehicleById(Long id);

    Vehicle createVehicle(VehicleRequest request);

    Vehicle createVehicle(Vehicle vehicle);

    Vehicle updateVehicle(Long id, VehicleRequest request);

    void deleteVehicle(Long id);

    Vehicle toggleMaintenance(Long id);

    List<DeliveryOrderResponse> getOrdersByVehicle(Long vehicleId);

    void recalculateVehicleLoads();
}
