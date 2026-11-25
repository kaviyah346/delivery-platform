package com.ups.logistics.exception;

public class CapacityExceededException extends RuntimeException {
    public CapacityExceededException(String message) {
        super(message);
    }

    public CapacityExceededException(Long vehicleId, Double maxCapacity, double currentLoad, double additionalWeight) {
        super(String.format("Assignment of %.1f kg exceeds vehicle %d maximum capacity of %.1f kg (Current load: %.1f kg, Available: %.1f kg)",
                additionalWeight, vehicleId, maxCapacity, currentLoad, Math.max(0.0, maxCapacity - currentLoad)));
    }
}
