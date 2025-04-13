package com.dan.club.repositories;

import com.dan.club.models.Activity;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ActivityRepository extends JpaRepository<Activity, Long> {
    Page<Activity> findByClub_Id(Long clubId, Pageable pageable);
    Page<Activity> findByClub_IdAndTitleContainingIgnoreCase(Long clubId, String title, Pageable pageable);
}
