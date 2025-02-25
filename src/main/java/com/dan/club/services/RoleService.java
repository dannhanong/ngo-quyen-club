package com.dan.club.services;

import com.dan.club.enums.RoleName;
import com.dan.club.models.Role;

public interface RoleService {
    Role findByName(RoleName name);
}
