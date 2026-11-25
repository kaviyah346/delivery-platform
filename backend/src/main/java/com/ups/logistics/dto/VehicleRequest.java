package com.ups.logistics.dto;

import com.ups.logistics.enums.VehicleStatus;
import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

public class VehicleRequest {

    private String vehicleNumber; // e.g. V-107 (optional, can be auto-generated)

    @NotBlank(message = "Vehicle model is required")
    private String model;

    @NotNull(message = "Maximum payload capacity is required")
    @DecimalMin(value = "50.0", message = "Maximum capacity must be at least 50 kg")
    private Double maxCapacityKg;

    private VehicleStatus status = VehicleStatus.AVAILABLE;

    @NotBlank(message = "Driver name is required")
    private String driverName;

    @NotBlank(message = "Driver contact number is required")
    private String driverContact;

    public VehicleRequest() {
    }

    public String getVehicleNumber() {
        return vehicleNumber;
    }

    public void setVehicleNumber(String vehicleNumber) {
        this.vehicleNumber = vehicleNumber;
    }

    public String getModel() {
        return model;
    }

    public void setModel(String model) {
        this.model = model;
    }

    public Double getMaxCapacityKg() {
        return maxCapacityKg;
    }

    public void setMaxCapacityKg(Double maxCapacityKg) {
        this.maxCapacityKg = maxCapacityKg;
    }

    public VehicleStatus getStatus() {
        return status;
    }

    public void setStatus(VehicleStatus status) {
        this.status = status;
    }

    public String getDriverName() {
        return driverName;
    }

    public void setDriverName(String driverName) {
        this.driverName = driverName;
    }

    public String getDriverContact() {
        return driverContact;
    }

    public void setDriverContact(String driverContact) {
        this.driverContact = driverContact;
    }
}
