package com.ups.logistics.dto;

import java.util.List;

public class DashboardStatsResponse {

    private long totalDeliveryOrders;
    private long pendingDeliveries;
    private long assignedDeliveries;
    private long inTransitDeliveries;
    private long deliveredOrders;

    private long availableVehicles;
    private long occupiedVehicles;
    private long maintenanceVehicles;
    private long totalVehicles;

    private long activeDeliveryRoutes;
    private long totalRoutes;

    private double totalFleetCapacityKg;
    private double currentAssignedLoadKg;
    private double fleetUtilizationPercentage;

    private List<StatusDistributionDTO> statusDistribution;
    private List<PriorityDistributionDTO> priorityDistribution;
    private List<VehicleCapacityDTO> vehicleUtilizationList;
    private List<DeliveryOrderResponse> recentOrders;

    public DashboardStatsResponse() {
    }

    public long getTotalDeliveryOrders() {
        return totalDeliveryOrders;
    }

    public void setTotalDeliveryOrders(long totalDeliveryOrders) {
        this.totalDeliveryOrders = totalDeliveryOrders;
    }

    public long getPendingDeliveries() {
        return pendingDeliveries;
    }

    public void setPendingDeliveries(long pendingDeliveries) {
        this.pendingDeliveries = pendingDeliveries;
    }

    public long getAssignedDeliveries() {
        return assignedDeliveries;
    }

    public void setAssignedDeliveries(long assignedDeliveries) {
        this.assignedDeliveries = assignedDeliveries;
    }

    public long getInTransitDeliveries() {
        return inTransitDeliveries;
    }

    public void setInTransitDeliveries(long inTransitDeliveries) {
        this.inTransitDeliveries = inTransitDeliveries;
    }

    public long getDeliveredOrders() {
        return deliveredOrders;
    }

    public void setDeliveredOrders(long deliveredOrders) {
        this.deliveredOrders = deliveredOrders;
    }

    public long getAvailableVehicles() {
        return availableVehicles;
    }

    public void setAvailableVehicles(long availableVehicles) {
        this.availableVehicles = availableVehicles;
    }

    public long getOccupiedVehicles() {
        return occupiedVehicles;
    }

    public void setOccupiedVehicles(long occupiedVehicles) {
        this.occupiedVehicles = occupiedVehicles;
    }

    public long getMaintenanceVehicles() {
        return maintenanceVehicles;
    }

    public void setMaintenanceVehicles(long maintenanceVehicles) {
        this.maintenanceVehicles = maintenanceVehicles;
    }

    public long getTotalVehicles() {
        return totalVehicles;
    }

    public void setTotalVehicles(long totalVehicles) {
        this.totalVehicles = totalVehicles;
    }

    public long getActiveDeliveryRoutes() {
        return activeDeliveryRoutes;
    }

    public void setActiveDeliveryRoutes(long activeDeliveryRoutes) {
        this.activeDeliveryRoutes = activeDeliveryRoutes;
    }

    public long getTotalRoutes() {
        return totalRoutes;
    }

    public void setTotalRoutes(long totalRoutes) {
        this.totalRoutes = totalRoutes;
    }

    public double getTotalFleetCapacityKg() {
        return totalFleetCapacityKg;
    }

    public void setTotalFleetCapacityKg(double totalFleetCapacityKg) {
        this.totalFleetCapacityKg = totalFleetCapacityKg;
    }

    public double getCurrentAssignedLoadKg() {
        return currentAssignedLoadKg;
    }

    public void setCurrentAssignedLoadKg(double currentAssignedLoadKg) {
        this.currentAssignedLoadKg = currentAssignedLoadKg;
    }

    public double getFleetUtilizationPercentage() {
        return fleetUtilizationPercentage;
    }

    public void setFleetUtilizationPercentage(double fleetUtilizationPercentage) {
        this.fleetUtilizationPercentage = fleetUtilizationPercentage;
    }

    public List<StatusDistributionDTO> getStatusDistribution() {
        return statusDistribution;
    }

    public void setStatusDistribution(List<StatusDistributionDTO> statusDistribution) {
        this.statusDistribution = statusDistribution;
    }

    public List<PriorityDistributionDTO> getPriorityDistribution() {
        return priorityDistribution;
    }

    public void setPriorityDistribution(List<PriorityDistributionDTO> priorityDistribution) {
        this.priorityDistribution = priorityDistribution;
    }

    public List<VehicleCapacityDTO> getVehicleUtilizationList() {
        return vehicleUtilizationList;
    }

    public void setVehicleUtilizationList(List<VehicleCapacityDTO> vehicleUtilizationList) {
        this.vehicleUtilizationList = vehicleUtilizationList;
    }

    public List<DeliveryOrderResponse> getRecentOrders() {
        return recentOrders;
    }

    public void setRecentOrders(List<DeliveryOrderResponse> recentOrders) {
        this.recentOrders = recentOrders;
    }
}
