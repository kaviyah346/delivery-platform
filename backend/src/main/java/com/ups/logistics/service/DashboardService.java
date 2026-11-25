package com.ups.logistics.service;

import com.ups.logistics.dto.DashboardStatsResponse;
import com.ups.logistics.dto.DeliveryOrderResponse;
import com.ups.logistics.dto.StatusDistributionDTO;
import com.ups.logistics.dto.VehicleCapacityDTO;

import java.util.List;

public interface DashboardService {

    DashboardStatsResponse getDashboardStats();

    long getTotalOrders();

    List<StatusDistributionDTO> getStatusDistribution();

    List<VehicleCapacityDTO> getVehicleCapacityUtilization();

    List<DeliveryOrderResponse> getRecentOrders(int limit);
}
