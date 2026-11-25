package com.ups.logistics.dto;

public class StatusDistributionDTO {
    private String status;
    private Long count;
    private String color;

    public StatusDistributionDTO() {
    }

    public StatusDistributionDTO(String status, Long count, String color) {
        this.status = status;
        this.count = count;
        this.color = color;
    }

    public StatusDistributionDTO(String status, Long count) {
        this.status = status;
        this.count = count;
        this.color = null;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
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
