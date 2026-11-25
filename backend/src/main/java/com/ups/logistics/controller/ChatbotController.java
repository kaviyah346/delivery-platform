package com.ups.logistics.controller;

import com.ups.logistics.dto.ApiResponse;
import com.ups.logistics.dto.ChatbotQueryRequest;
import com.ups.logistics.dto.ChatbotResponse;
import com.ups.logistics.service.ChatbotService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/chatbot")
@CrossOrigin(origins = "*")
public class ChatbotController {

    private final ChatbotService chatbotService;

    public ChatbotController(ChatbotService chatbotService) {
        this.chatbotService = chatbotService;
    }

    @PostMapping("/query")
    public ResponseEntity<ApiResponse<ChatbotResponse>> queryChatbot(@RequestBody ChatbotQueryRequest request) {
        ChatbotResponse response = chatbotService.processQuery(request);
        return ResponseEntity.ok(ApiResponse.ok("Chatbot response generated", response));
    }
}
