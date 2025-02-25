package com.dan.club.services;

import com.dan.club.dtos.requests.ActivityRequest;
import com.dan.club.dtos.responses.ResponseMessage;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import com.dan.club.models.Activity;

public interface ActivityService {
    Page<Activity> getActivitiesByClubIdAndTitleContainingIgnoreCase(Long clubId, String title, Pageable pageable);
    Activity createActivity(ActivityRequest activityRequest, String username);
    Activity updateActivity(Long activityId, ActivityRequest activityRequest);
    Activity getActivityById(Long activityId);
    ResponseMessage deleteActivity(Long activityId);
}
