package com.ups.logistics.service;

import com.ups.logistics.dto.RouteAssignmentRequest;
import com.ups.logistics.dto.RouteRequest;
import com.ups.logistics.dto.RouteResponse;
import com.ups.logistics.enums.RouteStatus;

import java.util.List;
import java.util.Map;

public interface DeliveryRouteService {

    List<RouteResponse> getAllRoutes(String search, RouteStatus status);

    RouteResponse getRouteById(Long id);

    RouteResponse createRoute(RouteRequest request);

    RouteResponse updateRoute(Long id, RouteRequest request);

    void deleteRoute(Long id);

    RouteResponse assignOrdersToRoute(Long routeId, RouteAssignmentRequest request);

    Map<String, Object> autoAllocateOrders();
}
