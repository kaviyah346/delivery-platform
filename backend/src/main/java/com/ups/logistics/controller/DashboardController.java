package com.ups.logistics.controller;

import com.ups.logistics.dto.ApiResponse;
import com.ups.logistics.dto.DashboardStatsResponse;
import com.ups.logistics.dto.DeliveryOrderResponse;
import com.ups.logistics.dto.StatusDistributionDTO;
import com.ups.logistics.dto.VehicleCapacityDTO;
import com.ups.logistics.service.DashboardService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/dashboard")
@CrossOrigin(origins = "*")
public class DashboardController {

    private final DashboardService dashboardService;

    public DashboardController(DashboardService dashboardService) {
        this.dashboardService = dashboardService;
    }

    @GetMapping("/stats")
    public ResponseEntity<ApiResponse<DashboardStatsResponse>> getDashboardStats() {
        DashboardStatsResponse stats = dashboardService.getDashboardStats();
        return ResponseEntity.ok(ApiResponse.ok("Dashboard statistics retrieved successfully", stats));
    }

    @GetMapping("/total-orders")
    public ResponseEntity<ApiResponse<Map<String, Long>>> getTotalOrders() {
        Map<String, Long> result = new HashMap<>();
        result.put("totalOrders", dashboardService.getTotalOrders());
        return ResponseEntity.ok(ApiResponse.ok("Total orders count retrieved", result));
    }

    @GetMapping("/status-distribution")
    public ResponseEntity<ApiResponse<List<StatusDistributionDTO>>> getStatusDistribution() {
        List<StatusDistributionDTO> distribution = dashboardService.getStatusDistribution();
        return ResponseEntity.ok(ApiResponse.ok("Status distribution retrieved", distribution));
    }

    @GetMapping("/vehicle-stats")
    public ResponseEntity<ApiResponse<List<VehicleCapacityDTO>>> getVehicleCapacityStats() {
        List<VehicleCapacityDTO> utilization = dashboardService.getVehicleCapacityUtilization();
        return ResponseEntity.ok(ApiResponse.ok("Vehicle capacity utilization retrieved", utilization));
    }

    @GetMapping("/recent-orders")
    public ResponseEntity<ApiResponse<List<DeliveryOrderResponse>>> getRecentOrders(
            @RequestParam(defaultValue = "6") int limit) {
        List<DeliveryOrderResponse> recent = dashboardService.getRecentOrders(limit);
        return ResponseEntity.ok(ApiResponse.ok("Recent orders retrieved", recent));
    }
}
