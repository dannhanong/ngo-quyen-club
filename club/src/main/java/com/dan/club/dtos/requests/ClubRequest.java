package com.dan.club.dtos.requests;

import lombok.*;
import lombok.experimental.FieldDefaults;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@FieldDefaults(level = lombok.AccessLevel.PRIVATE)
@Builder
public class ClubRequest {
    private String name;
    private String description;
    MultipartFile image;
    private Long leaderId;
    private List<Long> memberIds;
}
