package com.dan.club.services;

import com.dan.club.dtos.requests.ClubRequest;
import com.dan.club.dtos.requests.ClubRequestCreationByAdmin;
import com.dan.club.dtos.responses.ClubDetailResponse;
import com.dan.club.dtos.responses.ResponseMessage;
import com.dan.club.models.Club;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

public interface ClubService {
    Page<Club> getAllClubs(String keyword, Pageable pageable);
    Club createClub(ClubRequest clubRequest, String username);
    Club createClubByAdmin(ClubRequestCreationByAdmin clubRequestCreationByAdmin);
    Club updateClub(Long clubId, ClubRequest clubRequest);
    ResponseMessage deleteClub(Long clubId);
    ClubDetailResponse getClubById(Long clubId);
    Page<Club> getClubsByUser(String username, String keyword, Pageable pageable);
    ResponseMessage deleteUserFromClub(Long clubId, Long userId);
    ResponseMessage deleteMembership(Long id);
    ResponseMessage addUserToClub(Long clubId, String username);
    ResponseMessage updateMembership(Long memberShipId, String roleInClub, boolean status);
}
