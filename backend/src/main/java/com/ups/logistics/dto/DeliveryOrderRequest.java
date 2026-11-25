package com.ups.logistics.dto;

import com.ups.logistics.enums.OrderStatus;
import com.ups.logistics.enums.Priority;
import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Pattern;
import java.time.LocalDate;

public class DeliveryOrderRequest {

    private String orderId; // Optional on create (can be auto-generated)

    @NotBlank(message = "Customer name is required")
    private String customerName;

    @NotBlank(message = "Customer contact is required")
    @Pattern(regexp = "^[0-9+\\-\\s()]{7,20}$", message = "Please provide a valid contact number (7-20 digits)")
    private String customerContact;

    @NotBlank(message = "Pickup address is required")
    private String pickupAddress;

    @NotBlank(message = "Destination address is required")
    private String destinationAddress;

    @NotNull(message = "Package weight is required")
    @DecimalMin(value = "0.01", inclusive = true, message = "Package weight must be greater than zero")
    private Double packageWeight;

    @NotNull(message = "Delivery priority is required")
    private Priority priority = Priority.MEDIUM;

    private LocalDate orderDate;

    @NotNull(message = "Delivery status is required")
    private OrderStatus status = OrderStatus.PENDING;

    private Long vehicleId;
    private Long routeId;
    private String notes;

    public DeliveryOrderRequest() {
    }

    public String getOrderId() {
        return orderId;
    }

    public void setOrderId(String orderId) {
        this.orderId = orderId;
    }

    public String getCustomerName() {
        return customerName;
    }

    public void setCustomerName(String customerName) {
        this.customerName = customerName;
    }

    public String getCustomerContact() {
        return customerContact;
    }

    public void setCustomerContact(String customerContact) {
        this.customerContact = customerContact;
    }

    public String getPickupAddress() {
        return pickupAddress;
    }

    public void setPickupAddress(String pickupAddress) {
        this.pickupAddress = pickupAddress;
    }

    public String getDestinationAddress() {
        return destinationAddress;
    }

    public void setDestinationAddress(String destinationAddress) {
        this.destinationAddress = destinationAddress;
    }

    public Double getPackageWeight() {
        return packageWeight;
    }

    public void setPackageWeight(Double packageWeight) {
        this.packageWeight = packageWeight;
    }

    public Priority getPriority() {
        return priority;
    }

    public void setPriority(Priority priority) {
        this.priority = priority;
    }

    public LocalDate getOrderDate() {
        return orderDate;
    }

    public void setOrderDate(LocalDate orderDate) {
        this.orderDate = orderDate;
    }

    public OrderStatus getStatus() {
        return status;
    }

    public void setStatus(OrderStatus status) {
        this.status = status;
    }

    public Long getVehicleId() {
        return vehicleId;
    }

    public void setVehicleId(Long vehicleId) {
        this.vehicleId = vehicleId;
    }

    public Long getRouteId() {
        return routeId;
    }

    public void setRouteId(Long routeId) {
        this.routeId = routeId;
    }

    public String getNotes() {
        return notes;
    }

    public void setNotes(String notes) {
        this.notes = notes;
    }
}
