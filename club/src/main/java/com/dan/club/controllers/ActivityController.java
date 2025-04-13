package com.dan.club.controllers;

import com.dan.club.dtos.requests.ActivityRequest;
import com.dan.club.security.jwt.JwtService;
import com.dan.club.services.ActivityService;
import com.dan.club.utils.Token;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/activities")
public class ActivityController {
    @Autowired
    private ActivityService activityService;
    @Autowired
    private JwtService jwtService;

    @GetMapping("/private/all/{clubId}")
    public ResponseEntity<?> getAllActivities(@PathVariable Long clubId,
                                              @RequestParam(defaultValue = "") String keyword,
                                              @RequestParam(defaultValue = "0") int page,
                                              @RequestParam(defaultValue = "10") int size,
                                              @RequestParam(defaultValue = "id") String sortBy,
                                              @RequestParam(defaultValue = "desc") String order) {
        Pageable pageable = PageRequest.of(page, size, Sort.by(Sort.Direction.fromString(order), sortBy));
        return new ResponseEntity<>(activityService.getActivitiesByClubIdAndTitleContainingIgnoreCase(clubId, keyword, pageable), HttpStatus.OK);
    }

    @GetMapping("/private/{activityId}")
    public ResponseEntity<?> getOneActivity(@PathVariable Long activityId) {
        return new ResponseEntity<>(activityService.getActivityById(activityId), HttpStatus.OK);
    }

    @PostMapping("/private/create")
    public ResponseEntity<?> createActivity(@ModelAttribute ActivityRequest activityRequest,
                                            HttpServletRequest request) {
        String token = Token.getTokenFromRequest(request);
        String username = jwtService.extractUsername(token);
        return new ResponseEntity<>(activityService.createActivity(activityRequest, username), HttpStatus.OK);
    }

    @PutMapping("/private/update/{activityId}")
    public ResponseEntity<?> updateActivity(@PathVariable Long activityId,
                                           @ModelAttribute ActivityRequest activityRequest) {
        return new ResponseEntity<>(activityService.updateActivity(activityId, activityRequest), HttpStatus.OK);
    }

    @DeleteMapping("/private/delete/{activityId}")
    public ResponseEntity<?> deleteActivity(@PathVariable Long activityId) {
        return new ResponseEntity<>(activityService.deleteActivity(activityId), HttpStatus.OK);
    }
}
