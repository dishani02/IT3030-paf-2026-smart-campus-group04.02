package com.sliit.smartcampus.repository;

import com.sliit.smartcampus.model.Booking;
import com.sliit.smartcampus.model.Booking.BookingStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import java.time.LocalDate;
import java.time.LocalTime;
import java.util.List;

@Repository
public interface BookingRepository extends JpaRepository<Booking, Long> {

        List<Booking> findByUserIdOrderByCreatedAtDesc(Long userId);

        List<Booking> findAllByOrderByCreatedAtDesc();

        List<Booking> findByStatus(BookingStatus status);

        /**
         * Conflict check: overlapping booking for same resource on same date with
         * active status.
         * Two ranges overlap if: existing.startTime < newEndTime AND existing.endTime >
         * newStartTime
         */
        @Query("SELECT b FROM Booking b WHERE " +
                        "b.resource.id = :resourceId AND " +
                        "b.date = :date AND " +
                        "b.status IN ('PENDING', 'APPROVED') AND " +
                        "(:excludeId IS NULL OR b.id <> :excludeId) AND " +
                        "b.startTime < :endTime AND b.endTime > :startTime")
        List<Booking> findConflictingBookings(
                        @Param("resourceId") Long resourceId,
                        @Param("date") LocalDate date,
                        @Param("startTime") LocalTime startTime,
                        @Param("endTime") LocalTime endTime,
                        @Param("excludeId") Long excludeId);

        List<Booking> findByResourceIdAndStatus(Long resourceId, BookingStatus status);

    @Query("SELECT b.resource.name, COUNT(b) " +
            "FROM Booking b GROUP BY b.resource.name ORDER BY COUNT(b) DESC")
    List<Object[]> findTopResourcesRaw();

    @Query("SELECT b.status, COUNT(b) " +
            "FROM Booking b GROUP BY b.status")
    List<Object[]> findBookingStatusCountsRaw();

    @Query("SELECT HOUR(b.startTime), COUNT(b) " +
            "FROM Booking b GROUP BY HOUR(b.startTime) ORDER BY HOUR(b.startTime) ASC")
    List<Object[]> findPeakBookingHoursRaw();
}
