package com.dan.club.services;

import com.dan.club.dtos.requests.*;
import com.dan.club.dtos.responses.ResponseMessage;
import com.dan.club.dtos.responses.UserAllInfo;
import com.dan.club.dtos.responses.UserDetail;
import com.dan.club.dtos.responses.UserProfile;
import com.dan.club.models.User;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.security.core.userdetails.UserDetailsService;

import java.time.Instant;
import java.util.List;

public interface UserService extends UserDetailsService {
    User createUser(User user);
    User createUserByAdmin(User user);
    User updateUserByAdmin(Long id, UpdateUserByAdminRequest updateUserByAdminRequest);

    boolean existsByUsername(String username);

    boolean existsByEmail(String email);

    Page<User> searchByKeyword(String keyword, Pageable pageable);

    boolean verify(String verificationCode);

    boolean isEnableUser(String username);

    ResponseMessage changePassword(String username, ChangePasswordForm changePasswordForm);

    ResponseMessage forgotPassword(ForgotPasswordForm forgotPasswordForm);

    User getUserByResetPasswordToken(String resetPasswordToken);

    ResponseMessage resetPassword(String resetPasswordToken, ResetPasswordForm resetPasswordForm);

    ResponseMessage deleteUser(String username);
    List<User> findAllByDeletedAtBefore(Instant time);
    Page<User> getAllUserAndByKeyword(Pageable pageable, String keyword);
    Page<UserAllInfo> getAllUserInfoAndByKeyword(Pageable pageable, String keyword);
    UserDetail getUserById(Long id);
    ResponseMessage updateProfile(UpdateProfile updateProfile, String username);
    UserProfile getProfile(String username);
    List<User> getUsersTeacher();
    List<User> getUsersStudent();
}
