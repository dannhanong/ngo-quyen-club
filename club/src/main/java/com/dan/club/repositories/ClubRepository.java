package com.dan.club.repositories;

import com.dan.club.models.Club;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ClubRepository extends JpaRepository<Club, Long> {
    Page<Club> findByNameContainingIgnoreCase(String name, Pageable pageable);
}
