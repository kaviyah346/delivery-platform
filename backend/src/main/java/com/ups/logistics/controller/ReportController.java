package com.ups.logistics.controller;

import com.ups.logistics.dto.AnalyticsReportResponse;
import com.ups.logistics.dto.ApiResponse;
import com.ups.logistics.dto.TrackingTimelineResponse;
import com.ups.logistics.service.ReportService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/reports")
@CrossOrigin(origins = "*")
public class ReportController {

    private final ReportService reportService;

    public ReportController(ReportService reportService) {
        this.reportService = reportService;
    }

    @GetMapping("/analytics")
    public ResponseEntity<ApiResponse<AnalyticsReportResponse>> getAnalyticsReport() {
        AnalyticsReportResponse report = reportService.getAnalyticsReport();
        return ResponseEntity.ok(ApiResponse.ok("Analytics report generated successfully", report));
    }

    @GetMapping("/tracking/{orderId}")
    public ResponseEntity<ApiResponse<TrackingTimelineResponse>> getTrackingMilestones(@PathVariable String orderId) {
        TrackingTimelineResponse timeline = reportService.getOrderMilestones(orderId);
        return ResponseEntity.ok(ApiResponse.ok("Tracking timeline retrieved", timeline));
    }
}
