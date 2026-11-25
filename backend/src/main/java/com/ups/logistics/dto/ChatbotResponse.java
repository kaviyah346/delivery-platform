package com.ups.logistics.dto;

import java.util.List;
import java.util.Map;

public class ChatbotResponse {

    private String reply;
    private String type; // GENERAL, ORDER_STATUS, CAPACITY_SEARCH, FLEET_SUMMARY, ROUTE_RECOMMENDATION
    private Map<String, Object> metadata;
    private List<String> suggestions;

    public ChatbotResponse() {
    }

    public ChatbotResponse(String reply, String type, Map<String, Object> metadata, List<String> suggestions) {
        this.reply = reply;
        this.type = type;
        this.metadata = metadata;
        this.suggestions = suggestions;
    }

    public String getReply() {
        return reply;
    }

    public void setReply(String reply) {
        this.reply = reply;
    }

    public String getType() {
        return type;
    }

    public void setType(String type) {
        this.type = type;
    }

    public Map<String, Object> getMetadata() {
        return metadata;
    }

    public void setMetadata(Map<String, Object> metadata) {
        this.metadata = metadata;
    }

    public List<String> getSuggestions() {
        return suggestions;
    }

    public void setSuggestions(List<String> suggestions) {
        this.suggestions = suggestions;
    }
}
