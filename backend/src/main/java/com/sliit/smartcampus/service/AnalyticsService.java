package com.sliit.smartcampus.service;

import com.sliit.smartcampus.dto.AnalyticsDTO;
import com.sliit.smartcampus.model.Ticket;
import com.sliit.smartcampus.repository.BookingRepository;
import com.sliit.smartcampus.repository.TicketRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.Month;
import java.time.format.TextStyle;
import java.util.*;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class AnalyticsService {

    private final BookingRepository bookingRepository;
    private final TicketRepository ticketRepository;

    public AnalyticsDTO getAnalyticsSummary() {
        // (1) Top 5 most-booked resources
        List<AnalyticsDTO.ResourceCount> topResources = bookingRepository.findTopResourcesRaw()
                .stream()
                .limit(5)
                .map(row -> new AnalyticsDTO.ResourceCount((String) row[0], (Long) row[1]))
                .collect(Collectors.toList());

        // (2) Peak booking hours
        List<AnalyticsDTO.HourCount> peakHours = bookingRepository.findPeakBookingHoursRaw()
                .stream()
                .map(row -> new AnalyticsDTO.HourCount((Integer) row[0], (Long) row[1]))
                .collect(Collectors.toList());
        // Fill in missing hours with 0 counts for better visualization (0 to 23)
        Map<Integer, Long> hourMap = peakHours.stream()
                .collect(Collectors.toMap(AnalyticsDTO.HourCount::getHour, AnalyticsDTO.HourCount::getCount));
        List<AnalyticsDTO.HourCount> completePeakHours = new ArrayList<>();
        for (int i = 0; i < 24; i++) {
            completePeakHours.add(new AnalyticsDTO.HourCount(i, hourMap.getOrDefault(i, 0L)));
        }

        // (3) Total bookings by status
        List<AnalyticsDTO.StatusCount> bookingStatus = bookingRepository.findBookingStatusCountsRaw()
                .stream()
                .map(row -> new AnalyticsDTO.StatusCount(row[0].toString(), (Long) row[1]))
                .collect(Collectors.toList());

        // (4) Total open vs. resolved tickets by month
        List<Ticket> allTickets = ticketRepository.findAll();
        Map<Month, AnalyticsDTO.MonthlyTicketCount> monthlyStats = new EnumMap<>(Month.class);

        for (Ticket ticket : allTickets) {
            Month month = ticket.getCreatedAt().getMonth();
            AnalyticsDTO.MonthlyTicketCount stats = monthlyStats.getOrDefault(month, 
                    new AnalyticsDTO.MonthlyTicketCount(month.getDisplayName(TextStyle.FULL, Locale.ENGLISH), 0L, 0L));
            
            if (ticket.getStatus() == Ticket.TicketStatus.OPEN || ticket.getStatus() == Ticket.TicketStatus.IN_PROGRESS) {
                stats.setOpenCount(stats.getOpenCount() + 1);
            } else if (ticket.getStatus() == Ticket.TicketStatus.RESOLVED || ticket.getStatus() == Ticket.TicketStatus.CLOSED) {
                stats.setResolvedCount(stats.getResolvedCount() + 1);
            }
            monthlyStats.put(month, stats);
        }

        List<AnalyticsDTO.MonthlyTicketCount> sortedStats = monthlyStats.entrySet().stream()
                .sorted(Map.Entry.comparingByKey())
                .map(Map.Entry::getValue)
                .collect(Collectors.toList());

        return AnalyticsDTO.builder()
                .topResources(topResources)
                .peakHours(completePeakHours)
                .bookingStatus(bookingStatus)
                .ticketStats(sortedStats)
                .build();
    }
}
