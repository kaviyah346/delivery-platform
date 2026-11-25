package com.ups.logistics.entity;

import com.ups.logistics.enums.VehicleStatus;
import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "vehicles")
public class Vehicle {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true, length = 50)
    private String vehicleNumber;

    @Column(nullable = false, length = 100)
    private String model;

    @Column(nullable = false)
    private Double maxCapacityKg;

    @Column(nullable = false)
    private Double currentLoadKg = 0.0;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 20)
    private VehicleStatus status = VehicleStatus.AVAILABLE;

    @Column(length = 100)
    private String driverName;

    @Column(length = 50)
    private String driverContact;

    @Column(nullable = false, updatable = false)
    private LocalDateTime createdAt;

    private LocalDateTime updatedAt;

    public Vehicle() {
    }

    public Vehicle(String vehicleNumber, String model, Double maxCapacityKg, Double currentLoadKg,
                   VehicleStatus status, String driverName, String driverContact) {
        this.vehicleNumber = vehicleNumber;
        this.model = model;
        this.maxCapacityKg = maxCapacityKg;
        this.currentLoadKg = currentLoadKg != null ? currentLoadKg : 0.0;
        this.status = status != null ? status : VehicleStatus.AVAILABLE;
        this.driverName = driverName;
        this.driverContact = driverContact;
    }

    @PrePersist
    protected void onCreate() {
        this.createdAt = LocalDateTime.now();
        this.updatedAt = LocalDateTime.now();
    }

    @PreUpdate
    protected void onUpdate() {
        this.updatedAt = LocalDateTime.now();
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
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

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }

    public LocalDateTime getUpdatedAt() {
        return updatedAt;
    }

    public void setUpdatedAt(LocalDateTime updatedAt) {
        this.updatedAt = updatedAt;
    }
}
