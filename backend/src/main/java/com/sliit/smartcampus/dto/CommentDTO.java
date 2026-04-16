package com.sliit.smartcampus.dto;

import lombok.Data;
import java.time.LocalDateTime;

@Data
public class CommentDTO {
    private Long id;
    private Long authorId;
    private String authorName;
    private String authorRole;
    private String content;
    private LocalDateTime createdAt;
}
