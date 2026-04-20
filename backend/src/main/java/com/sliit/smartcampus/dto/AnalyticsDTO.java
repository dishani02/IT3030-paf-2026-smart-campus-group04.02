package com.sliit.smartcampus.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class AnalyticsDTO {
    private List<ResourceCount> topResources;
    private List<HourCount> peakHours;
    private List<StatusCount> bookingStatus;
    private List<MonthlyTicketCount> ticketStats;

    @Data
    @AllArgsConstructor
    @NoArgsConstructor
    public static class ResourceCount {
        private String resourceName;
        private Long count;
    }

    @Data
    @AllArgsConstructor
    @NoArgsConstructor
    public static class HourCount {
        private Integer hour;
        private Long count;
    }

    @Data
    @AllArgsConstructor
    @NoArgsConstructor
    public static class StatusCount {
        private String status;
        private Long count;
    }

    @Data
    @AllArgsConstructor
    @NoArgsConstructor
    public static class MonthlyTicketCount {
        private String month;
        private Long openCount;
        private Long resolvedCount;
    }
}
