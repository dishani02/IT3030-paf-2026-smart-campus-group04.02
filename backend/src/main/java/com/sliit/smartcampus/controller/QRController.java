package com.sliit.smartcampus.controller;

import com.sliit.smartcampus.dto.BookingResponseDTO;
import com.sliit.smartcampus.dto.QRCodePayload;
import com.sliit.smartcampus.exception.ForbiddenException;
import com.sliit.smartcampus.model.Booking;
import com.sliit.smartcampus.model.User;
import com.sliit.smartcampus.service.AuthService;
import com.sliit.smartcampus.service.BookingService;
import com.sliit.smartcampus.service.QRService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.Collections;
import java.util.Map;

@RestController
@RequestMapping("/api/bookings")
@RequiredArgsConstructor
public class QRController {

    private final QRService qrService;
    private final BookingService bookingService;
    private final AuthService authService;

    @GetMapping("/{id}/qr")
    public ResponseEntity<?> getQRCode(
            @PathVariable Long id,
            Authentication authentication) {
        
        User user = authService.getCurrentUser(authentication.getName());
        Booking booking = bookingService.getBookingOrThrow(id);

        if (!booking.getUser().getId().equals(user.getId())) {
            throw new ForbiddenException("You can only generate QR codes for your own bookings.");
        }

        if (booking.getStatus() != Booking.BookingStatus.APPROVED) {
            return ResponseEntity.badRequest().body(Collections.singletonMap("message", "QR code is only available for approved bookings."));
        }

        try {
            String base64Image = qrService.generateQRCodeForBooking(booking);
            return ResponseEntity.ok(Collections.singletonMap("qrCode", base64Image));
        } catch (Exception e) {
            return ResponseEntity.internalServerError().body(Collections.singletonMap("message", "Failed to generate QR code."));
        }
    }

    @GetMapping("/verify-qr")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> verifyQRCode(
            @RequestParam Long bookingId,
            @RequestParam Long resourceId,
            @RequestParam Long userId,
            @RequestParam String signature) {
        
        QRCodePayload payload = QRCodePayload.builder()
                .bookingId(bookingId)
                .resourceId(resourceId)
                .userId(userId)
                .signature(signature)
                .build();

        if (qrService.verifyQRCode(payload)) {
            Booking booking = bookingService.getBookingOrThrow(bookingId);
            return ResponseEntity.ok(BookingResponseDTO.from(booking));
        } else {
            return ResponseEntity.status(401).body(Collections.singletonMap("message", "Invalid QR code signature."));
        }
    }
}
