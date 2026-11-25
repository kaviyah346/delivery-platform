package com.ups.logistics.dto;

public class PriorityDistributionDTO {
    private String priority;
    private Long count;
    private String color;

    public PriorityDistributionDTO() {
    }

    public PriorityDistributionDTO(String priority, Long count, String color) {
        this.priority = priority;
        this.count = count;
        this.color = color;
    }

    public PriorityDistributionDTO(String priority, Long count) {
        this.priority = priority;
        this.count = count;
        this.color = null;
    }

    public String getPriority() {
        return priority;
    }

    public void setPriority(String priority) {
        this.priority = priority;
    }

    public Long getCount() {
        return count;
    }

    public void setCount(Long count) {
        this.count = count;
    }

    public String getColor() {
        return color;
    }

    public void setColor(String color) {
        this.color = color;
    }
}
