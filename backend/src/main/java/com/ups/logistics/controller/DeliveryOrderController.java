package com.ups.logistics.controller;

import com.ups.logistics.dto.ApiResponse;
import com.ups.logistics.dto.DeliveryOrderRequest;
import com.ups.logistics.dto.DeliveryOrderResponse;
import com.ups.logistics.enums.OrderStatus;
import com.ups.logistics.enums.Priority;
import com.ups.logistics.service.DeliveryOrderService;
import jakarta.validation.Valid;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/orders")
@CrossOrigin(origins = "*")
public class DeliveryOrderController {

    private final DeliveryOrderService orderService;

    public DeliveryOrderController(DeliveryOrderService orderService) {
        this.orderService = orderService;
    }

    @PostMapping
    public ResponseEntity<ApiResponse<DeliveryOrderResponse>> createOrder(
            @Valid @RequestBody DeliveryOrderRequest request) {
        DeliveryOrderResponse response = orderService.createOrder(request);
        return new ResponseEntity<>(
                ApiResponse.ok("Delivery order created successfully", response),
                HttpStatus.CREATED
        );
    }

    @GetMapping
    public ResponseEntity<ApiResponse<List<DeliveryOrderResponse>>> getAllOrders(
            @RequestParam(required = false) String search,
            @RequestParam(required = false) OrderStatus status,
            @RequestParam(required = false) Priority priority) {
        List<DeliveryOrderResponse> orders = orderService.getAllOrders(search, status, priority);
        return ResponseEntity.ok(ApiResponse.ok("Delivery orders retrieved successfully", orders));
    }

    @GetMapping("/paged")
    public ResponseEntity<ApiResponse<Page<DeliveryOrderResponse>>> getAllOrdersPaged(
            @RequestParam(required = false) String search,
            @RequestParam(required = false) OrderStatus status,
            @RequestParam(required = false) Priority priority,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(defaultValue = "createdAt") String sortBy,
            @RequestParam(defaultValue = "desc") String direction) {
        Sort sort = direction.equalsIgnoreCase("asc") ? Sort.by(sortBy).ascending() : Sort.by(sortBy).descending();
        PageRequest pageRequest = PageRequest.of(page, size, sort);
        Page<DeliveryOrderResponse> orderPage = orderService.getAllOrdersPaged(search, status, priority, pageRequest);
        return ResponseEntity.ok(ApiResponse.ok("Paged delivery orders retrieved successfully", orderPage));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<DeliveryOrderResponse>> getOrderById(@PathVariable Long id) {
        DeliveryOrderResponse order = orderService.getOrderById(id);
        return ResponseEntity.ok(ApiResponse.ok("Delivery order found", order));
    }

    @GetMapping("/tracking/{orderId}")
    public ResponseEntity<ApiResponse<DeliveryOrderResponse>> getOrderByOrderId(@PathVariable String orderId) {
        DeliveryOrderResponse order = orderService.getOrderByOrderId(orderId);
        return ResponseEntity.ok(ApiResponse.ok("Delivery order found", order));
    }

    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse<DeliveryOrderResponse>> updateOrder(
            @PathVariable Long id,
            @Valid @RequestBody DeliveryOrderRequest request) {
        DeliveryOrderResponse updatedOrder = orderService.updateOrder(id, request);
        return ResponseEntity.ok(ApiResponse.ok("Delivery order updated successfully", updatedOrder));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<Void>> deleteOrder(@PathVariable Long id) {
        orderService.deleteOrder(id);
        return ResponseEntity.ok(ApiResponse.ok("Delivery order deleted successfully", null));
    }
}
