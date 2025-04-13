package com.dan.club.repositories;

import com.dan.club.models.Membership;

import java.util.List;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

@Repository
public interface MembershipRepository extends JpaRepository<Membership, Long> {
    Page<Membership> findByUser_UsernameAndClub_NameContainingIgnoreCase(String username, String name, Pageable pageable);
    void deleteByUser_IdAndClub_Id(Long userId, Long clubId);
    Membership findByClub_IdAndRoleInClub(Long clubId, String role);
    List<Membership> findByClub_Id(Long clubId);
    boolean existsByUser_UsernameAndClub_Id(String username, Long clubId);
    
    @Modifying
    @Query("DELETE FROM Membership m WHERE m.id = :id")
    void deleteMembershipById(Long id); // Đổi tên để không xung đột với deleteById mặc định
}