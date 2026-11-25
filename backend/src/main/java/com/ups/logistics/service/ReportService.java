package com.ups.logistics.service;

import com.ups.logistics.dto.AnalyticsReportResponse;
import com.ups.logistics.dto.TrackingTimelineResponse;

public interface ReportService {

    AnalyticsReportResponse getAnalyticsReport();

    TrackingTimelineResponse getOrderMilestones(String orderId);
}
