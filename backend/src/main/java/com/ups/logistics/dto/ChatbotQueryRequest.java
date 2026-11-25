package com.ups.logistics.dto;

public class ChatbotQueryRequest {

    private String message;
    private String sessionId;

    public ChatbotQueryRequest() {
    }

    public ChatbotQueryRequest(String message, String sessionId) {
        this.message = message;
        this.sessionId = sessionId;
    }

    public String getMessage() {
        return message;
    }

    public void setMessage(String message) {
        this.message = message;
    }

    public String getSessionId() {
        return sessionId;
    }

    public void setSessionId(String sessionId) {
        this.sessionId = sessionId;
    }
}
