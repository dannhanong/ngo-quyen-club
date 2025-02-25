package com.dan.club.services.impls;

import com.dan.club.dtos.requests.ActivityRequest;
import com.dan.club.dtos.responses.ResponseMessage;
import com.dan.club.models.Activity;
import com.dan.club.models.Club;
import com.dan.club.models.User;
import com.dan.club.repositories.ActivityRepository;
import com.dan.club.repositories.ClubRepository;
import com.dan.club.repositories.UserRepository;
import com.dan.club.services.ActivityService;
import com.dan.club.services.FileUploadService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

@Service
@Transactional
public class ActivityServiceImpl implements ActivityService {
    @Autowired
    private ActivityRepository activityRepository;
    @Autowired
    private UserRepository userRepository;
    @Autowired
    private ClubRepository clubRepository;
    @Autowired
    private FileUploadService fileUploadService;

    @Override
    public Page<Activity> getActivitiesByClubIdAndTitleContainingIgnoreCase(Long clubId, String title, Pageable pageable) {
        return activityRepository.findByClub_IdAndTitleContainingIgnoreCase(clubId, title, pageable);
    }

    @Override
    public Activity createActivity(ActivityRequest activityRequest, String username) {
        User user = userRepository.findByUsername(username);
        Club club = clubRepository.findById(activityRequest.getClubId()).orElseThrow(() -> new RuntimeException("Không tìm thấy câu lạc bộ"));

        Activity activity = new Activity();
        activity.setClub(club);
        activity.setTitle(activityRequest.getTitle());
        activity.setDescription(activityRequest.getDescription());
        activity.setStartTime(activityRequest.getStartTime());
        activity.setLocation(activityRequest.getLocation());

        MultipartFile image = activityRequest.getImage();
        if (image != null) {
            try {
                String imageCode = fileUploadService.uploadFile(image).getFileCode();
                activity.setImageCode(imageCode);
            } catch (Exception e) {
                throw new RuntimeException(e);
            }
        }

        activity.setCreator(user);

        return activityRepository.save(activity);
    }

    @Override
    public Activity updateActivity(Long activityId, ActivityRequest activityRequest) {
        return activityRepository.findById(activityId).map(activity -> {
            activity.setTitle(activityRequest.getTitle());
            activity.setDescription(activityRequest.getDescription());
            activity.setStartTime(activityRequest.getStartTime());
            activity.setLocation(activityRequest.getLocation());

            MultipartFile image = activityRequest.getImage();
            if (image != null) {
                try {
                    String oldImageCode = activity.getImageCode();
                    String imageCode = fileUploadService.uploadFile(image).getFileCode();
                    activity.setImageCode(imageCode);

                    if (oldImageCode != null) {
                        fileUploadService.deleteFileByFileCode(oldImageCode);
                    }
                } catch (Exception e) {
                    throw new RuntimeException(e);
                }
            }

            return activityRepository.save(activity);
        }).orElseThrow(() -> new RuntimeException("Không tìm thấy hoạt động"));
    }

    @Override
    public Activity getActivityById(Long activityId) {
        return activityRepository.findById(activityId).orElseThrow(() -> new RuntimeException("Không tìm thấy hoạt động"));
    }

    @Override
    public ResponseMessage deleteActivity(Long activityId) {
        return activityRepository.findById(activityId).map(activity -> {
            String imageCode = activity.getImageCode();
            activityRepository.delete(activity);

            if (imageCode != null) {
                try {
                    fileUploadService.deleteFileByFileCode(imageCode);
                } catch (Exception e) {
                    throw new RuntimeException(e);
                }
            }

            return new ResponseMessage(200, "Xóa hoạt động thành công");
        }).orElseThrow(() -> new RuntimeException("Không tìm thấy hoạt động"));
    }
}
