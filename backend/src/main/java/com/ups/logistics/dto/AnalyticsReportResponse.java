package com.ups.logistics.dto;

import java.util.List;

public class AnalyticsReportResponse {

    private Double onTimeDeliveryRate;
    private Double avgTransitHours;
    private Double totalDeliveredWeightKg;
    private Integer zeroOverloadViolations;
    private Long totalCompletedDeliveries;
    private Double vehicleUtilizationEfficiency;
    private Long activeRoutesCount;
    private Long totalVehiclesCount;
    private List<StatusDistributionDTO> statusDistribution;
    private List<PriorityDistributionDTO> priorityDistribution;
    private List<VehicleCapacityDTO> vehicleCapacityDetails;
    private List<DeliveryOrderResponse> recentCompletedDeliveries;

    public AnalyticsReportResponse() {
    }

    public AnalyticsReportResponse(Double onTimeDeliveryRate, Double avgTransitHours, Double totalDeliveredWeightKg,
                                   Integer zeroOverloadViolations, Long totalCompletedDeliveries,
                                   Double vehicleUtilizationEfficiency, Long activeRoutesCount, Long totalVehiclesCount,
                                   List<StatusDistributionDTO> statusDistribution,
                                   List<PriorityDistributionDTO> priorityDistribution,
                                   List<VehicleCapacityDTO> vehicleCapacityDetails,
                                   List<DeliveryOrderResponse> recentCompletedDeliveries) {
        this.onTimeDeliveryRate = onTimeDeliveryRate;
        this.avgTransitHours = avgTransitHours;
        this.totalDeliveredWeightKg = totalDeliveredWeightKg;
        this.zeroOverloadViolations = zeroOverloadViolations;
        this.totalCompletedDeliveries = totalCompletedDeliveries;
        this.vehicleUtilizationEfficiency = vehicleUtilizationEfficiency;
        this.activeRoutesCount = activeRoutesCount;
        this.totalVehiclesCount = totalVehiclesCount;
        this.statusDistribution = statusDistribution;
        this.priorityDistribution = priorityDistribution;
        this.vehicleCapacityDetails = vehicleCapacityDetails;
        this.recentCompletedDeliveries = recentCompletedDeliveries;
    }

    public Double getOnTimeDeliveryRate() {
        return onTimeDeliveryRate;
    }

    public void setOnTimeDeliveryRate(Double onTimeDeliveryRate) {
        this.onTimeDeliveryRate = onTimeDeliveryRate;
    }

    public Double getAvgTransitHours() {
        return avgTransitHours;
    }

    public void setAvgTransitHours(Double avgTransitHours) {
        this.avgTransitHours = avgTransitHours;
    }

    public Double getTotalDeliveredWeightKg() {
        return totalDeliveredWeightKg;
    }

    public void setTotalDeliveredWeightKg(Double totalDeliveredWeightKg) {
        this.totalDeliveredWeightKg = totalDeliveredWeightKg;
    }

    public Integer getZeroOverloadViolations() {
        return zeroOverloadViolations;
    }

    public void setZeroOverloadViolations(Integer zeroOverloadViolations) {
        this.zeroOverloadViolations = zeroOverloadViolations;
    }

    public Long getTotalCompletedDeliveries() {
        return totalCompletedDeliveries;
    }

    public void setTotalCompletedDeliveries(Long totalCompletedDeliveries) {
        this.totalCompletedDeliveries = totalCompletedDeliveries;
    }

    public Double getVehicleUtilizationEfficiency() {
        return vehicleUtilizationEfficiency;
    }

    public void setVehicleUtilizationEfficiency(Double vehicleUtilizationEfficiency) {
        this.vehicleUtilizationEfficiency = vehicleUtilizationEfficiency;
    }

    public Long getActiveRoutesCount() {
        return activeRoutesCount;
    }

    public void setActiveRoutesCount(Long activeRoutesCount) {
        this.activeRoutesCount = activeRoutesCount;
    }

    public Long getTotalVehiclesCount() {
        return totalVehiclesCount;
    }

    public void setTotalVehiclesCount(Long totalVehiclesCount) {
        this.totalVehiclesCount = totalVehiclesCount;
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

    public List<VehicleCapacityDTO> getVehicleCapacityDetails() {
        return vehicleCapacityDetails;
    }

    public void setVehicleCapacityDetails(List<VehicleCapacityDTO> vehicleCapacityDetails) {
        this.vehicleCapacityDetails = vehicleCapacityDetails;
    }

    public List<DeliveryOrderResponse> getRecentCompletedDeliveries() {
        return recentCompletedDeliveries;
    }

    public void setRecentCompletedDeliveries(List<DeliveryOrderResponse> recentCompletedDeliveries) {
        this.recentCompletedDeliveries = recentCompletedDeliveries;
    }
}
