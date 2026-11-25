package com.ups.logistics.service;

import com.ups.logistics.dto.ChatbotQueryRequest;
import com.ups.logistics.dto.ChatbotResponse;

public interface ChatbotService {

    ChatbotResponse processQuery(ChatbotQueryRequest request);
}
