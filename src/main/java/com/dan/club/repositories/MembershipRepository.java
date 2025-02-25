package com.dan.club.repositories;

import com.dan.club.models.Membership;

import java.util.List;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface MembershipRepository extends JpaRepository<Membership, Long> {
    Page<Membership> findByUser_UsernameAndClub_NameContainingIgnoreCase(String username, String name, Pageable pageable);
    void deleteByUser_IdAndClub_Id(Long userId, Long clubId);
    Membership findByClub_IdAndRoleInClub(Long clubId, String role);
    List<Membership> findByClub_Id(Long clubId);
}
