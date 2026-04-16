package com.sliit.smartcampus.model;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "resources")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Resource {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String name;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private ResourceType type;

    private Integer capacity;

    private String location;

    private String description;

    @Column(name = "availability_start")
    private String availabilityStart; // e.g. "08:00"

    @Column(name = "availability_end")
    private String availabilityEnd;   // e.g. "22:00"

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    @Builder.Default
    private ResourceStatus status = ResourceStatus.ACTIVE;

    public enum ResourceType {
        ROOM, LAB, EQUIPMENT
    }

    public enum ResourceStatus {
        ACTIVE, OUT_OF_SERVICE
    }
}
