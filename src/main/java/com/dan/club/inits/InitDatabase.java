package com.dan.club.inits;

import com.dan.club.enums.RoleName;
import com.dan.club.models.Role;
import com.dan.club.models.User;
import com.dan.club.repositories.RoleRepository;
import com.dan.club.repositories.UserRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import java.util.HashSet;
import java.util.Set;

@Configuration
public class InitDatabase {
    @Bean
    CommandLineRunner initRole(RoleRepository roleRepository) {
        return args -> {
            if (!roleRepository.existsByName(RoleName.ADMIN)) {
                Role adminRole = new Role();
                adminRole.setName(RoleName.ADMIN);
                roleRepository.save(adminRole);
            }
            if (!roleRepository.existsByName(RoleName.TEACHER)) {
                Role teacherRole = new Role();
                teacherRole.setName(RoleName.TEACHER);
                roleRepository.save(teacherRole);
            }
            if (!roleRepository.existsByName(RoleName.USER)) {
                Role userRole = new Role();
                userRole.setName(RoleName.USER);
                roleRepository.save(userRole);
            }
        };
    }

    @Bean
    CommandLineRunner initAdmin(UserRepository userRepository, RoleRepository roleRepository) {
        return args -> {
            if (!userRepository.existsByUsername("admin")) {
                User user = new User();
                user.setName("Admin");
                user.setUsername("admin");
                user.setPassword("$2a$10$Q.BMgpwML1E.jc15nfl2nuQRp0VQhQ5Zmb.AMalIi2ABWoXSa0gri");
                user.setEmail("admin@gmail.com");

                Set<Role> roles = new HashSet<>();
                Role adminRole = roleRepository.findByName(RoleName.ADMIN);
                Role adminTeacherRole = roleRepository.findByName(RoleName.TEACHER);
                Role adminUserRole = roleRepository.findByName(RoleName.USER);
                roles.add(adminRole);
                roles.add(adminTeacherRole);
                roles.add(adminUserRole);

                user.setRoles(roles);

                userRepository.save(user);
            }
        };
    }
}
