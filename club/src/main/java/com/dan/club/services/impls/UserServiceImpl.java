package com.dan.club.services.impls;

import com.dan.club.dtos.requests.*;
import com.dan.club.dtos.responses.ResponseMessage;
import com.dan.club.dtos.responses.UserAllInfo;
import com.dan.club.dtos.responses.UserDetail;
import com.dan.club.dtos.responses.UserProfile;
import com.dan.club.enums.RoleName;
import com.dan.club.models.FileUpload;
import com.dan.club.models.Role;
import com.dan.club.models.User;
import com.dan.club.repositories.UserRepository;
import com.dan.club.services.FileUploadService;
import com.dan.club.services.RoleService;
import com.dan.club.services.UserService;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.Pageable;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.time.Instant;
import java.time.LocalDateTime;
import java.util.*;
import java.util.stream.Collectors;

@Service
@Transactional
@Slf4j
public class UserServiceImpl implements UserService {
    @Autowired
    private UserRepository userRepository;
    @Autowired
    private RoleService roleService;
    @Autowired
    private FileUploadService fileUploadService;

    @Override
    public User createUser(User user) {
        user.setEnabled(true);
        user.setCreatedAt(LocalDateTime.now());
        user.setVerificationCode(generateVerificationCode());
        return userRepository.save(user);
    }

    @Override
    public User createUserByAdmin(User user) {
        user.setEnabled(true);
        user.setCreatedAt(LocalDateTime.now());
        user.setVerificationCode(generateVerificationCode());
        return userRepository.save(user);
    }

    @Override
    public User updateUserByAdmin(Long id, UpdateUserByAdminRequest updateUserByAdminRequest) {
        User user = userRepository.findById(id).orElse(null);
        if (user == null) {
            return null;
        }

        if (updateUserByAdminRequest.getPassword() != null) {
            user.setPassword(new BCryptPasswordEncoder().encode(updateUserByAdminRequest.getPassword()));
        }

        String oldUsername = user.getUsername();
        user.setName(updateUserByAdminRequest.getName());
        user.setUsername(updateUserByAdminRequest.getUsername());
        user.setEmail(updateUserByAdminRequest.getEmail());
        user.setEnabled(updateUserByAdminRequest.isEnabled());

        String strRoles = updateUserByAdminRequest.getRoles();
        Set<Role> roles = new HashSet<>();
        if (strRoles == null){
            Role userRole = roleService.findByName(RoleName.USER);
            roles.add(userRole);
        }else {
            switch (strRoles){
                case "admin":
                    Role adminRole = roleService.findByName(RoleName.ADMIN);
                    Role adminTeacherRole = roleService.findByName(RoleName.TEACHER);
                    Role adminUserRole = roleService.findByName(RoleName.USER);
                    roles.add(adminRole);
                    roles.add(adminTeacherRole);
                    roles.add(adminUserRole);
                    break;
                case "teacher":
                    Role teacherRole = roleService.findByName(RoleName.TEACHER);
                    Role teacherUserRole = roleService.findByName(RoleName.USER);
                    roles.add(teacherRole);
                    roles.add(teacherUserRole);
                    break;
                case "user":
                    Role userRole = roleService.findByName(RoleName.USER);
                    roles.add(userRole);
                    break;
            }
        }
        user.setRoles(roles);

        return userRepository.save(user);
    }

    @Override
    public boolean existsByUsername(String username) {
        return userRepository.existsByUsername(username);
    }

    @Override
    public boolean existsByEmail(String email) {
        return userRepository.existsByEmail(email);
    }

    @Override
    public Page<User> searchByKeyword(String keyword, Pageable pageable) {
        return userRepository.searchByKeyword(keyword, pageable);
    }

    @Override
    public boolean verify(String verificationCode) {
        User user = userRepository.findByVerificationCode(verificationCode);
        if (user == null || user.isEnabled()) {
            return false;
        }else {
            enableUser(user.getId());
            return true;
        }
    }

    @Override
    public boolean isEnableUser(String username) {
        User user = userRepository.findByUsername(username);
        return user.isEnabled();
    }

    @Override
    public ResponseMessage changePassword(String username, ChangePasswordForm changePasswordForm) {
        User currentUser = userRepository.findByUsername(username);
        ResponseMessage responseMessage = new ResponseMessage();
        PasswordEncoder passwordEncoder = new BCryptPasswordEncoder();

        if (currentUser == null) {
            throw new RuntimeException("Người dùng không tồn tại");
        }

        if (passwordEncoder.matches(changePasswordForm.getOldPassword(), currentUser.getPassword())) {
            if (!changePasswordForm.getNewPassword().equals(changePasswordForm.getConfirmPassword())) {
                throw new RuntimeException("Mật khẩu không khớp");
            }

            currentUser.setPassword(passwordEncoder.encode(changePasswordForm.getNewPassword()));
            userRepository.save(currentUser);
            responseMessage.setMessage("Đổi mật khẩu thành công");
        } else {
            throw new RuntimeException("Mật khẩu cũ không đúng");
        }

        return responseMessage;
    }

    @Override
    public ResponseMessage forgotPassword(ForgotPasswordForm forgotPasswordForm) {
        User user = userRepository.findByEmail(forgotPasswordForm.getEmail());
        user.setResetPasswordToken(generateVerificationCode());
        userRepository.save(user);
        if (user != null){
            return new ResponseMessage(200, "Gửi mã xác nhận thành công");
        }
        throw new RuntimeException("Email không tồn tại");
    }

    @Override
    public User getUserByResetPasswordToken(String resetPasswordToken) {
        return userRepository.findByResetPasswordToken(resetPasswordToken);
    }

    @Override
    public ResponseMessage resetPassword(String resetPasswordToken, ResetPasswordForm resetPasswordForm) {
        ResponseMessage responseMessage = new ResponseMessage();
        PasswordEncoder passwordEncoder = new BCryptPasswordEncoder();
        User currentUser = userRepository.findByResetPasswordToken(resetPasswordToken);
        if (!resetPasswordForm.getNewPassword().equals(resetPasswordForm.getConfirmPassword())) {
            throw new RuntimeException("Mật khẩu không khớp");
        }else{
            currentUser.setPassword(passwordEncoder.encode(resetPasswordForm.getNewPassword()));
            currentUser.setResetPasswordToken(null);
            userRepository.save(currentUser);
            responseMessage.setMessage("Đổi mật khẩu thành công");
            return responseMessage;
        }
    }

    @Override
    @Transactional
    public ResponseMessage deleteUser(String username) {
        User user = userRepository.findByUsername(username);
        user.setDeletedAt(LocalDateTime.now());
        userRepository.save(user);
        return new ResponseMessage(200, "Xóa tài khoản thành công, vui lòng kiểm tra email để xác nhận");
    }

    @Override
    public Page<User> getAllUserAndByKeyword(Pageable pageable, String keyword) {
        return userRepository.searchByKeyword(keyword, pageable);
    }

    @Override
    public Page<UserAllInfo> getAllUserInfoAndByKeyword(Pageable pageable, String keyword) {
        // Sử dụng phương thức có hỗ trợ phân trang
        Page<User> userPage = userRepository.searchByKeyword(keyword, pageable);
        
        // Chuyển đổi Page<User> thành Page<UserAllInfo> sử dụng map
        return userPage.map(user -> {
            UserAllInfo userAllInfo = new UserAllInfo();
            userAllInfo.setId(user.getId());
            userAllInfo.setName(user.getName());
            userAllInfo.setUsername(user.getUsername());
            userAllInfo.setEnabled(user.isEnabled());
            userAllInfo.setPhoneNumber(user.getPhoneNumber());
            userAllInfo.setEmail(user.getEmail());
            userAllInfo.setAvatarId(user.getAvatarCode());
            userAllInfo.setEnabled(user.isEnabled());
            userAllInfo.setDeletedAt(user.getDeletedAt());

            Optional<Role> highestRole = user.getRoles().stream()
                    .min(Comparator.comparingInt(this::getRolePriority));
            highestRole.ifPresent(role -> userAllInfo.setRoles(role.getName().name().toLowerCase()));
            
            return userAllInfo;
        });
    }

    @Override
    public UserDetail getUserById(Long id) {
        User user = userRepository.findById(id).orElse(null);
        Optional<Role> highestRole = user.getRoles().stream()
                .min(Comparator.comparingInt(this::getRolePriority));
        UserDetail userDetail = UserDetail.builder()
                .id(user.getId())
                .name(user.getName())
                .username(user.getUsername())
                .password(user.getPassword())
                .enabled(user.isEnabled())
                .verificationCode(user.getVerificationCode())
                .resetPasswordToken(user.getResetPasswordToken())
                .email(user.getEmail())
                .roles(highestRole.get().getName().name().toLowerCase())
                .deletedAt(user.getDeletedAt())
                .build();
        return userDetail;
    }

    @Override
    public ResponseMessage updateProfile(UpdateProfile updateProfile, String username) {
        User currentUser = userRepository.findByUsername(username);
        if (currentUser == null) {
            throw new RuntimeException("Không tìm thấy user");
        }
        currentUser.setName(updateProfile.getName());
        currentUser.setPhoneNumber(updateProfile.getPhoneNumber());

        MultipartFile avatar = updateProfile.getAvatar();

        if (avatar != null) {
            try {
                String oldFileCode = currentUser.getAvatarCode();
                FileUpload fileUpload = fileUploadService.uploadFile(avatar);
                currentUser.setAvatarCode(fileUpload.getFileCode());

                if (oldFileCode != null && !oldFileCode.isEmpty()) {
                    fileUploadService.deleteFileByFileCode(oldFileCode);
                }
            } catch (Exception e) {
                throw new RuntimeException("Lỗi khi tải ảnh lên");
            }
        }

        userRepository.save(currentUser);
        return ResponseMessage.builder()
                .status(200)
                .message("Cập nhật thông tin thành công")
                .build();
    }

    @Override
    public UserProfile getProfile(String username) {
        User user = userRepository.findByUsername(username);
        if (user == null) {
            throw new RuntimeException("Không tìm thấy user");
        }
        return UserProfile.builder()
                .name(user.getName())
                .username(user.getUsername())
                .email(user.getEmail())
                .phoneNumber(user.getPhoneNumber())
                .avatarCode(user.getAvatarCode())
                .createdAt(user.getCreatedAt())
                .build();
    }

    @Override
    public List<User> getUsersTeacher() {
        return userRepository.findAll().stream()
                .filter(user -> {
                    Set<Role> roles = user.getRoles();
                    return roles.stream().anyMatch(role -> role.getName() == RoleName.TEACHER) &&
                            roles.stream().noneMatch(role -> role.getName() == RoleName.ADMIN);
                })
                .collect(Collectors.toList());
    }

    @Override
    public List<User> getUsersStudent() {
        return userRepository.findAll().stream()
                .filter(user -> {
                    Set<Role> roles = user.getRoles();
                    return roles.stream().anyMatch(role -> role.getName() == RoleName.USER) &&
                            roles.stream().noneMatch(role -> role.getName() == RoleName.TEACHER);
                })
                .collect(Collectors.toList());
    }

    @Override
    public List<User> findAllByDeletedAtBefore(Instant time) {
        return userRepository.findAllByDeletedAtBefore(time);
    }

    private void enableUser(Long id) {
        User user = userRepository.findById(id).get();
        user.setEnabled(true);
        userRepository.save(user);
    }

    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        User user = userRepository.findByUsername(username);
        if (user == null) {
            throw new UsernameNotFoundException("Không tìm thấy người dùng");
        }
        org.springframework.security.core.userdetails.User us = new org.springframework.security.core.userdetails.User(
                user.getUsername(), user.getPassword(), rolesToAuthorities(user.getRoles()));
        return us;
    }

    private Collection<? extends GrantedAuthority> rolesToAuthorities(Collection<Role> roles) {
        return roles.stream().map(role ->new SimpleGrantedAuthority(role.getName().name())).collect(Collectors.toList());
    }

    private String generateVerificationCode() {
        return UUID.randomUUID().toString();
    }

    private int getRolePriority(Role role) {
        switch (role.getName().toString()) {
            case "ADMIN":
                return 1;
            case "ARTICLE":
                return 2;
            case "SELLER":
                return 3;
            case "USER":
                return 4;
            default:
                return Integer.MAX_VALUE;
        }
    }
}
