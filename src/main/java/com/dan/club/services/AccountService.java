package com.dan.club.services;

import com.dan.club.dtos.requests.SignupForm;
import com.dan.club.dtos.responses.ResponseMessage;

public interface AccountService {
    ResponseMessage signupAccount(SignupForm signupForm);
    ResponseMessage createAccountByAdmin(SignupForm signupForm);
//    ResponseMessage updateAccountByAdmin(Long userId, UpdateUserByAdminRequest updateUserByAdminRequest);
}
