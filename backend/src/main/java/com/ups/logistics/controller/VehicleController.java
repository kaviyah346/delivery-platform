package com.ups.logistics.controller;

import com.ups.logistics.dto.ApiResponse;
import com.ups.logistics.dto.DeliveryOrderResponse;
import com.ups.logistics.dto.VehicleRequest;
import com.ups.logistics.entity.Vehicle;
import com.ups.logistics.service.VehicleService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/vehicles")
@CrossOrigin(origins = "*")
public class VehicleController {

    private final VehicleService vehicleService;

    public VehicleController(VehicleService vehicleService) {
        this.vehicleService = vehicleService;
    }

    @GetMapping
    public ResponseEntity<ApiResponse<List<Vehicle>>> getAllVehicles() {
        List<Vehicle> vehicles = vehicleService.getAllVehicles();
        return ResponseEntity.ok(ApiResponse.ok("Vehicles retrieved successfully", vehicles));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<Vehicle>> getVehicleById(@PathVariable Long id) {
        Vehicle vehicle = vehicleService.getVehicleById(id);
        return ResponseEntity.ok(ApiResponse.ok("Vehicle found", vehicle));
    }

    @PostMapping
    public ResponseEntity<ApiResponse<Vehicle>> createVehicle(@Valid @RequestBody VehicleRequest request) {
        Vehicle created = vehicleService.createVehicle(request);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.created("Vehicle created successfully with ID: " + created.getId(), created));
    }

    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse<Vehicle>> updateVehicle(
            @PathVariable Long id,
            @Valid @RequestBody VehicleRequest request) {
        Vehicle updated = vehicleService.updateVehicle(id, request);
        return ResponseEntity.ok(ApiResponse.ok("Vehicle updated successfully", updated));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<Void>> deleteVehicle(@PathVariable Long id) {
        vehicleService.deleteVehicle(id);
        return ResponseEntity.ok(ApiResponse.ok("Vehicle deleted successfully", null));
    }

    @PostMapping("/{id}/maintenance")
    public ResponseEntity<ApiResponse<Vehicle>> toggleMaintenance(@PathVariable Long id) {
        Vehicle updated = vehicleService.toggleMaintenance(id);
        return ResponseEntity.ok(ApiResponse.ok("Vehicle status updated to " + updated.getStatus(), updated));
    }

    @GetMapping("/{id}/orders")
    public ResponseEntity<ApiResponse<List<DeliveryOrderResponse>>> getOrdersByVehicle(@PathVariable Long id) {
        List<DeliveryOrderResponse> orders = vehicleService.getOrdersByVehicle(id);
        return ResponseEntity.ok(ApiResponse.ok("Orders retrieved for vehicle " + id, orders));
    }
}
