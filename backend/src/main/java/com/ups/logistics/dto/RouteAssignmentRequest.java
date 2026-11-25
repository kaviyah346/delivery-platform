package com.ups.logistics.dto;

import java.util.List;

public class RouteAssignmentRequest {
    private List<Long> orderIds;

    public RouteAssignmentRequest() {
    }

    public RouteAssignmentRequest(List<Long> orderIds) {
        this.orderIds = orderIds;
    }

    public List<Long> getOrderIds() {
        return orderIds;
    }

    public void setOrderIds(List<Long> orderIds) {
        this.orderIds = orderIds;
    }
}
