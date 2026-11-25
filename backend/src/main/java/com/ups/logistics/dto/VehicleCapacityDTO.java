package com.ups.logistics.dto;

public class VehicleCapacityDTO {
    private Long vehicleId;
    private String vehicleNumber;
    private String model;
    private Double maxCapacityKg;
    private Double currentLoadKg;
    private Double utilizationPercentage;
    private String status;

    public VehicleCapacityDTO() {
    }

    public VehicleCapacityDTO(Long vehicleId, String vehicleNumber, String model,
                              Double maxCapacityKg, Double currentLoadKg,
                              Double utilizationPercentage, String status) {
        this.vehicleId = vehicleId;
        this.vehicleNumber = vehicleNumber;
        this.model = model;
        this.maxCapacityKg = maxCapacityKg;
        this.currentLoadKg = currentLoadKg;
        this.utilizationPercentage = utilizationPercentage;
        this.status = status;
    }

    public Long getVehicleId() {
        return vehicleId;
    }

    public void setVehicleId(Long vehicleId) {
        this.vehicleId = vehicleId;
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

    public Double getCurrentLoadKg() {
        return currentLoadKg;
    }

    public void setCurrentLoadKg(Double currentLoadKg) {
        this.currentLoadKg = currentLoadKg;
    }

    public Double getUtilizationPercentage() {
        return utilizationPercentage;
    }

    public void setUtilizationPercentage(Double utilizationPercentage) {
        this.utilizationPercentage = utilizationPercentage;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }
}
