package com.dan.club.dtos.requests;

import lombok.*;
import lombok.experimental.FieldDefaults;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@FieldDefaults(level = AccessLevel.PRIVATE)
public class UpdateUserByAdminRequest {
    String name;
    String username;
    String password;
    boolean enabled;
    String email;
    String roles;
}