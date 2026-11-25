package com.ups.logistics.dto;

import com.ups.logistics.enums.RouteStatus;
import java.time.LocalDateTime;
import java.util.List;

public class RouteResponse {

    private Long id;
    private String routeCode;
    private String origin;
    private String destination;
    private Double totalDistanceKm;
    private Double estimatedDurationHours;
    private RouteStatus status;
    private Long vehicleId;
    private String vehicleNumber;
    private String vehicleModel;
    private Double vehicleMaxCapacityKg;
    private Double vehicleCurrentLoadKg;
    private String driverName;
    private String driverContact;
    private int assignedOrdersCount;
    private Double totalAssignedWeightKg;
    private List<DeliveryOrderResponse> assignedOrders;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    public RouteResponse() {
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getRouteCode() {
        return routeCode;
    }

    public void setRouteCode(String routeCode) {
        this.routeCode = routeCode;
    }

    public String getOrigin() {
        return origin;
    }

    public void setOrigin(String origin) {
        this.origin = origin;
    }

    public String getDestination() {
        return destination;
    }

    public void setDestination(String destination) {
        this.destination = destination;
    }

    public Double getTotalDistanceKm() {
        return totalDistanceKm;
    }

    public void setTotalDistanceKm(Double totalDistanceKm) {
        this.totalDistanceKm = totalDistanceKm;
    }

    public Double getEstimatedDurationHours() {
        return estimatedDurationHours;
    }

    public void setEstimatedDurationHours(Double estimatedDurationHours) {
        this.estimatedDurationHours = estimatedDurationHours;
    }

    public RouteStatus getStatus() {
        return status;
    }

    public void setStatus(RouteStatus status) {
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

    public String getVehicleModel() {
        return vehicleModel;
    }

    public void setVehicleModel(String vehicleModel) {
        this.vehicleModel = vehicleModel;
    }

    public Double getVehicleMaxCapacityKg() {
        return vehicleMaxCapacityKg;
    }

    public void setVehicleMaxCapacityKg(Double vehicleMaxCapacityKg) {
        this.vehicleMaxCapacityKg = vehicleMaxCapacityKg;
    }

    public Double getVehicleCurrentLoadKg() {
        return vehicleCurrentLoadKg;
    }

    public void setVehicleCurrentLoadKg(Double vehicleCurrentLoadKg) {
        this.vehicleCurrentLoadKg = vehicleCurrentLoadKg;
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

    public int getAssignedOrdersCount() {
        return assignedOrdersCount;
    }

    public void setAssignedOrdersCount(int assignedOrdersCount) {
        this.assignedOrdersCount = assignedOrdersCount;
    }

    public Double getTotalAssignedWeightKg() {
        return totalAssignedWeightKg;
    }

    public void setTotalAssignedWeightKg(Double totalAssignedWeightKg) {
        this.totalAssignedWeightKg = totalAssignedWeightKg;
    }

    public List<DeliveryOrderResponse> getAssignedOrders() {
        return assignedOrders;
    }

    public void setAssignedOrders(List<DeliveryOrderResponse> assignedOrders) {
        this.assignedOrders = assignedOrders;
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
