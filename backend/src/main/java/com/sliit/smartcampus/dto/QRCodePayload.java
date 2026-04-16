package com.sliit.smartcampus.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class QRCodePayload {
    private Long bookingId;
    private Long resourceId;
    private Long userId;
    private String signature;
}
