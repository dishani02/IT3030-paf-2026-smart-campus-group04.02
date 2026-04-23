package com.sliit.smartcampus.service;

import com.sliit.smartcampus.dto.BookingRequestDTO;
import com.sliit.smartcampus.dto.BookingResponseDTO;
import com.sliit.smartcampus.exception.ConflictException;
import com.sliit.smartcampus.exception.ForbiddenException;
import com.sliit.smartcampus.exception.ResourceNotFoundException;
import com.sliit.smartcampus.model.Booking;
import com.sliit.smartcampus.model.Booking.BookingStatus;
import com.sliit.smartcampus.model.Resource;
import com.sliit.smartcampus.model.Resource.ResourceStatus;
import com.sliit.smartcampus.model.User;
import com.sliit.smartcampus.repository.BookingRepository;
import com.sliit.smartcampus.repository.ResourceRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class BookingService {

    private final BookingRepository bookingRepository;
    private final ResourceRepository resourceRepository;
    private final NotificationService notificationService;

    @Transactional
    public BookingResponseDTO createBooking(BookingRequestDTO dto, User currentUser) {
        Resource resource = resourceRepository.findById(dto.getResourceId())
                .orElseThrow(() -> new ResourceNotFoundException("Resource not found: " + dto.getResourceId()));

        if (resource.getStatus() == ResourceStatus.OUT_OF_SERVICE) {
            throw new ConflictException("Resource is currently out of service and cannot be booked.");
        }

        if (dto.getStartTime().isAfter(dto.getEndTime()) || dto.getStartTime().equals(dto.getEndTime())) {
            throw new IllegalArgumentException("End time must be after start time.");
        }

        List<Booking> conflicts = bookingRepository.findConflictingBookings(
                dto.getResourceId(), dto.getDate(), dto.getStartTime(), dto.getEndTime(), null);

        if (!conflicts.isEmpty()) {
            throw new ConflictException("This resource is already booked during the selected time slot.");
        }

        Booking booking = Booking.builder()
                .resource(resource)
                .user(currentUser)
                .date(dto.getDate())
                .startTime(dto.getStartTime())
                .endTime(dto.getEndTime())
                .purpose(dto.getPurpose())
                .status(BookingStatus.PENDING)
                .build();

        booking = bookingRepository.save(booking);
        notificationService.createAndSaveNotification(currentUser,
                "Your booking for '" + resource.getName() + "' has been submitted and is pending approval.",
                "BOOKING_SUBMITTED");
        // Notify admins about new booking request
        notificationService.createAdminNotification(
                "New booking request submitted for " + resource.getName(),
                "BOOKING_REQUEST",
                "BOOKING",
                booking.getId());
        return BookingResponseDTO.from(booking);
    }

    public List<BookingResponseDTO> getMyBookings(User user) {
        return bookingRepository.findByUserIdOrderByCreatedAtDesc(user.getId())
                .stream().map(BookingResponseDTO::from).collect(Collectors.toList());
    }

    public List<BookingResponseDTO> getAllBookings() {
        return bookingRepository.findAllByOrderByCreatedAtDesc()
                .stream().map(BookingResponseDTO::from).collect(Collectors.toList());
    }

    @Transactional
    public BookingResponseDTO approveBooking(Long id) {
        Booking booking = getBookingOrThrow(id);
        if (booking.getStatus() != BookingStatus.PENDING) {
            throw new IllegalArgumentException("Only pending bookings can be approved.");
        }

        // Check for conflicting APPROVED bookings before approving this one
        List<Booking> conflicts = bookingRepository.findConflictingBookings(
                booking.getResource().getId(), booking.getDate(), booking.getStartTime(), booking.getEndTime(),
                booking.getId());
        boolean hasApprovedConflict = conflicts.stream().anyMatch(b -> b.getStatus() == BookingStatus.APPROVED);
        if (hasApprovedConflict) {
            throw new ConflictException("Cannot approve: the time slot " + booking.getDate() + " "
                    + booking.getStartTime() + "-" + booking.getEndTime() + " is already booked.");
        }

        booking.setStatus(BookingStatus.APPROVED);
        booking = bookingRepository.save(booking);
        notificationService.createAndSaveNotification(booking.getUser(),
                "Your booking for '" + booking.getResource().getName() + "' on " + booking.getDate()
                        + " has been APPROVED.",
                "BOOKING_APPROVED");
        return BookingResponseDTO.from(booking);
    }

    @Transactional
    public BookingResponseDTO rejectBooking(Long id, String reason) {
        Booking booking = getBookingOrThrow(id);
        if (booking.getStatus() != BookingStatus.PENDING) {
            throw new IllegalArgumentException("Only pending bookings can be rejected.");
        }
        booking.setStatus(BookingStatus.REJECTED);
        booking.setRejectionReason(reason);
        booking = bookingRepository.save(booking);
        notificationService.createAndSaveNotification(booking.getUser(),
                "Your booking for '" + booking.getResource().getName() + "' has been REJECTED. Reason: " + reason,
                "BOOKING_REJECTED");
        return BookingResponseDTO.from(booking);
    }

    @Transactional
    public BookingResponseDTO cancelBooking(Long id, User currentUser) {
        Booking booking = getBookingOrThrow(id);
        if (!booking.getUser().getId().equals(currentUser.getId())) {
            throw new ForbiddenException("You can only cancel your own bookings.");
        }
        if (booking.getStatus() == BookingStatus.CANCELLED) {
            throw new IllegalArgumentException("Booking is already cancelled.");
        }
        booking.setStatus(BookingStatus.CANCELLED);
        Booking saved = bookingRepository.save(booking);
        // Notify admins about cancellation
        notificationService.createAdminNotification(
                "Booking cancelled by user for " + booking.getResource().getName(),
                "BOOKING_CANCELLED",
                "BOOKING",
                booking.getId());
        return BookingResponseDTO.from(saved);
    }

    @Transactional
    public void deleteBooking(Long id) {
        Booking booking = getBookingOrThrow(id);
        bookingRepository.delete(booking);
    }

    public Booking getBookingOrThrow(Long id) {
        return bookingRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Booking not found: " + id));
    }
}