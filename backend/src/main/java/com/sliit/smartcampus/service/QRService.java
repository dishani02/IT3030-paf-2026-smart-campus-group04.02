package com.sliit.smartcampus.service;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.google.zxing.BarcodeFormat;
import com.google.zxing.client.j2se.MatrixToImageWriter;
import com.google.zxing.common.BitMatrix;
import com.google.zxing.qrcode.QRCodeWriter;
import com.sliit.smartcampus.dto.QRCodePayload;
import com.sliit.smartcampus.model.Booking;
import org.springframework.stereotype.Service;

import javax.crypto.Mac;
import javax.crypto.spec.SecretKeySpec;
import java.io.ByteArrayOutputStream;
import java.util.Base64;

@Service
public class QRService {

    private final String SECRET_KEY = "smart-campus-hub-qr-secret-key-for-hmac";
    private final ObjectMapper objectMapper = new ObjectMapper();

    public String generateQRCodeForBooking(Booking booking) throws Exception {
        QRCodePayload payload = QRCodePayload.builder()
                .bookingId(booking.getId())
                .resourceId(booking.getResource().getId())
                .userId(booking.getUser().getId())
                .build();

        String dataToSign = payload.getBookingId() + ":" + payload.getResourceId() + ":" + payload.getUserId();
        payload.setSignature(generateHMAC(dataToSign));

        String jsonPayload = objectMapper.writeValueAsString(payload);

        QRCodeWriter qrCodeWriter = new QRCodeWriter();
        BitMatrix bitMatrix = qrCodeWriter.encode(jsonPayload, BarcodeFormat.QR_CODE, 300, 300);

        ByteArrayOutputStream outputStream = new ByteArrayOutputStream();
        MatrixToImageWriter.writeToStream(bitMatrix, "PNG", outputStream);
        byte[] imageBytes = outputStream.toByteArray();

        return Base64.getEncoder().encodeToString(imageBytes);
    }

    public boolean verifyQRCode(QRCodePayload payload) {
        try {
            String dataToSign = payload.getBookingId() + ":" + payload.getResourceId() + ":" + payload.getUserId();
            String signature = generateHMAC(dataToSign);
            return signature.equals(payload.getSignature());
        } catch (Exception e) {
            return false;
        }
    }

    private String generateHMAC(String data) throws Exception {
        Mac hmacSha256 = Mac.getInstance("HmacSHA256");
        SecretKeySpec secretKey = new SecretKeySpec(SECRET_KEY.getBytes(), "HmacSHA256");
        hmacSha256.init(secretKey);
        byte[] signedBytes = hmacSha256.doFinal(data.getBytes());
        return Base64.getEncoder().encodeToString(signedBytes);
    }
}
