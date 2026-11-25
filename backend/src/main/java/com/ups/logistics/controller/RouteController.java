package com.ups.logistics.controller;

import com.ups.logistics.dto.ApiResponse;
import com.ups.logistics.dto.RouteAssignmentRequest;
import com.ups.logistics.dto.RouteRequest;
import com.ups.logistics.dto.RouteResponse;
import com.ups.logistics.enums.RouteStatus;
import com.ups.logistics.service.DeliveryRouteService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/routes")
@CrossOrigin(origins = "*")
public class RouteController {

    private final DeliveryRouteService routeService;

    public RouteController(DeliveryRouteService routeService) {
        this.routeService = routeService;
    }

    @GetMapping
    public ResponseEntity<ApiResponse<List<RouteResponse>>> getAllRoutes(
            @RequestParam(required = false) String search,
            @RequestParam(required = false) RouteStatus status) {
        List<RouteResponse> routes = routeService.getAllRoutes(search, status);
        return ResponseEntity.ok(ApiResponse.ok("Routes retrieved successfully", routes));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<RouteResponse>> getRouteById(@PathVariable Long id) {
        RouteResponse route = routeService.getRouteById(id);
        return ResponseEntity.ok(ApiResponse.ok("Route found", route));
    }

    @PostMapping
    public ResponseEntity<ApiResponse<RouteResponse>> createRoute(@Valid @RequestBody RouteRequest request) {
        RouteResponse created = routeService.createRoute(request);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.created("Route created successfully", created));
    }

    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse<RouteResponse>> updateRoute(
            @PathVariable Long id,
            @Valid @RequestBody RouteRequest request) {
        RouteResponse updated = routeService.updateRoute(id, request);
        return ResponseEntity.ok(ApiResponse.ok("Route updated successfully", updated));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<Void>> deleteRoute(@PathVariable Long id) {
        routeService.deleteRoute(id);
        return ResponseEntity.ok(ApiResponse.ok("Route deleted successfully", null));
    }

    @PostMapping("/{id}/assign-orders")
    public ResponseEntity<ApiResponse<RouteResponse>> assignOrdersToRoute(
            @PathVariable Long id,
            @RequestBody RouteAssignmentRequest request) {
        RouteResponse updated = routeService.assignOrdersToRoute(id, request);
        return ResponseEntity.ok(ApiResponse.ok("Orders assigned to route successfully", updated));
    }

    @PostMapping("/auto-allocate")
    public ResponseEntity<ApiResponse<Map<String, Object>>> autoAllocateOrders() {
        Map<String, Object> result = routeService.autoAllocateOrders();
        return ResponseEntity.ok(ApiResponse.ok("Automated capacity allocation completed", result));
    }
}
