package com.dan.club.services.impls;

import com.dan.club.enums.RoleName;
import com.dan.club.models.Role;
import com.dan.club.repositories.RoleRepository;
import com.dan.club.services.RoleService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class RoleServiceImpl implements RoleService {
    @Autowired
    private RoleRepository roleRepository;

    @Override
    public Role findByName(RoleName name) {
        return roleRepository.findByName(name);
    }
}
