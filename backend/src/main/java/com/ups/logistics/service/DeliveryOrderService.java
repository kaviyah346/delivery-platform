package com.ups.logistics.service;

import com.ups.logistics.dto.DeliveryOrderRequest;
import com.ups.logistics.dto.DeliveryOrderResponse;
import com.ups.logistics.enums.OrderStatus;
import com.ups.logistics.enums.Priority;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.util.List;

public interface DeliveryOrderService {

    DeliveryOrderResponse createOrder(DeliveryOrderRequest request);

    List<DeliveryOrderResponse> getAllOrders(String search, OrderStatus status, Priority priority);

    Page<DeliveryOrderResponse> getAllOrdersPaged(String search, OrderStatus status, Priority priority, Pageable pageable);

    DeliveryOrderResponse getOrderById(Long id);

    DeliveryOrderResponse getOrderByOrderId(String orderId);

    DeliveryOrderResponse updateOrder(Long id, DeliveryOrderRequest request);

    void deleteOrder(Long id);
}
