package com.dan.club.dtos.requests;

import java.time.LocalDateTime;
import lombok.*;
import org.springframework.web.multipart.MultipartFile;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ActivityRequest {
    private Long clubId;
    private String title;
    private String description;
    private LocalDateTime startTime;
    private String location;
    private MultipartFile image;
}
