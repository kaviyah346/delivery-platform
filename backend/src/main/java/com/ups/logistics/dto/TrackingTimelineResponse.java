package com.ups.logistics.dto;

import com.ups.logistics.enums.OrderStatus;
import com.ups.logistics.enums.Priority;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

public class TrackingTimelineResponse {

    private String orderId;
    private String customerName;
    private String customerContact;
    private String pickupAddress;
    private String destinationAddress;
    private Double packageWeight;
    private Priority priority;
    private OrderStatus status;
    private LocalDate orderDate;
    private String vehicleNumber;
    private String vehicleModel;
    private String driverName;
    private String driverContact;
    private String routeCode;
    private String estimatedDelivery;
    private List<MilestoneItem> milestones;

    public static class MilestoneItem {
        private String step;
        private String title;
        private String timestamp;
        private String description;
        private boolean completed;
        private boolean current;

        public MilestoneItem() {}

        public MilestoneItem(String step, String title, String timestamp, String description, boolean completed, boolean current) {
            this.step = step;
            this.title = title;
            this.timestamp = timestamp;
            this.description = description;
            this.completed = completed;
            this.current = current;
        }

        public String getStep() { return step; }
        public void setStep(String step) { this.step = step; }
        public String getTitle() { return title; }
        public void setTitle(String title) { this.title = title; }
        public String getTimestamp() { return timestamp; }
        public void setTimestamp(String timestamp) { this.timestamp = timestamp; }
        public String getDescription() { return description; }
        public void setDescription(String description) { this.description = description; }
        public boolean isCompleted() { return completed; }
        public void setCompleted(boolean completed) { this.completed = completed; }
        public boolean isCurrent() { return current; }
        public void setCurrent(boolean current) { this.current = current; }
    }

    public TrackingTimelineResponse() {
    }

    public String getOrderId() { return orderId; }
    public void setOrderId(String orderId) { this.orderId = orderId; }
    public String getCustomerName() { return customerName; }
    public void setCustomerName(String customerName) { this.customerName = customerName; }
    public String getCustomerContact() { return customerContact; }
    public void setCustomerContact(String customerContact) { this.customerContact = customerContact; }
    public String getPickupAddress() { return pickupAddress; }
    public void setPickupAddress(String pickupAddress) { this.pickupAddress = pickupAddress; }
    public String getDestinationAddress() { return destinationAddress; }
    public void setDestinationAddress(String destinationAddress) { this.destinationAddress = destinationAddress; }
    public Double getPackageWeight() { return packageWeight; }
    public void setPackageWeight(Double packageWeight) { this.packageWeight = packageWeight; }
    public Priority getPriority() { return priority; }
    public void setPriority(Priority priority) { this.priority = priority; }
    public OrderStatus getStatus() { return status; }
    public void setStatus(OrderStatus status) { this.status = status; }
    public LocalDate getOrderDate() { return orderDate; }
    public void setOrderDate(LocalDate orderDate) { this.orderDate = orderDate; }
    public String getVehicleNumber() { return vehicleNumber; }
    public void setVehicleNumber(String vehicleNumber) { this.vehicleNumber = vehicleNumber; }
    public String getVehicleModel() { return vehicleModel; }
    public void setVehicleModel(String vehicleModel) { this.vehicleModel = vehicleModel; }
    public String getDriverName() { return driverName; }
    public void setDriverName(String driverName) { this.driverName = driverName; }
    public String getDriverContact() { return driverContact; }
    public void setDriverContact(String driverContact) { this.driverContact = driverContact; }
    public String getRouteCode() { return routeCode; }
    public void setRouteCode(String routeCode) { this.routeCode = routeCode; }
    public String getEstimatedDelivery() { return estimatedDelivery; }
    public void setEstimatedDelivery(String estimatedDelivery) { this.estimatedDelivery = estimatedDelivery; }
    public List<MilestoneItem> getMilestones() { return milestones; }
    public void setMilestones(List<MilestoneItem> milestones) { this.milestones = milestones; }
}
