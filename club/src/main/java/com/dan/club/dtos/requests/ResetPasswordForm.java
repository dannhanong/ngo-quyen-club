package com.dan.club.dtos.requests;

import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
public class ResetPasswordForm {
    private String newPassword;
    private String confirmPassword;
}
