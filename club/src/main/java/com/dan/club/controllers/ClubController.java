package com.dan.club.controllers;

import com.dan.club.dtos.requests.ClubRequest;
import com.dan.club.dtos.requests.ClubRequestCreationByAdmin;
import com.dan.club.dtos.responses.ClubDetailResponse;
import com.dan.club.dtos.responses.ResponseMessage;
import com.dan.club.models.Club;
import com.dan.club.security.jwt.JwtService;
import com.dan.club.services.ClubService;
import com.dan.club.utils.Token;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.PathVariable;



@RestController
@RequestMapping("/clubs")
public class ClubController {
    @Autowired
    private ClubService clubService;
    @Autowired
    private JwtService jwtService;

    @GetMapping("/public/all")
    public ResponseEntity<Page<Club>> getAllClubs(@RequestParam(defaultValue = "") String keyword,
                                                  @RequestParam(defaultValue = "0") int page,
                                                  @RequestParam(defaultValue = "10") int size,
                                                  @RequestParam(defaultValue = "id") String sortBy,
                                                  @RequestParam(defaultValue = "desc") String order) {
        Pageable pageable = PageRequest.of(page, size, Sort.by(Sort.Direction.fromString(order), sortBy));
        return ResponseEntity.ok(clubService.getAllClubs(keyword, pageable));
    }

    @PostMapping("/teacher/create")
    public ResponseEntity<Club> createClub(@ModelAttribute ClubRequest clubRequest,
                                           HttpServletRequest request) {
        String token = Token.getTokenFromRequest(request);
        String username = jwtService.getUsernameFromToken(token);
        return ResponseEntity.ok(clubService.createClub(clubRequest, username));
    }

    @PostMapping("/admin/create")
    public ResponseEntity<Club> createClubByAdmin(
            @ModelAttribute ClubRequestCreationByAdmin clubRequestCreationByAdmin) {
        return ResponseEntity.ok(clubService.createClubByAdmin(clubRequestCreationByAdmin));
    }

    @GetMapping("/public/{id}")
    public ResponseEntity<ClubDetailResponse> getClubById(@PathVariable Long id) {
        return ResponseEntity.ok(clubService.getClubById(id));
    }

    @PutMapping("/teacher/update/{id}")
    public ResponseEntity<Club> updateClub(@PathVariable Long id,
                                           @ModelAttribute ClubRequest updatedClub) {
        return ResponseEntity.ok(clubService.updateClub(id, updatedClub));
    }

    @DeleteMapping("/teacher/delete/{id}")
    public ResponseEntity<ResponseMessage> deleteClub(@PathVariable Long id) {
        return ResponseEntity.ok(clubService.deleteClub(id));
    }

    @DeleteMapping("/teacher/delete-membership/{id}")
    public ResponseEntity<ResponseMessage> deleteMembership(@PathVariable Long id) {
        return ResponseEntity.ok(clubService.deleteMembership(id));
    }

    @GetMapping("/private/my-clubs")
    public ResponseEntity<Page<Club>> getMyClubs(@RequestParam(defaultValue = "") String keyword,
                                                @RequestParam(defaultValue = "0") int page,
                                                @RequestParam(defaultValue = "10") int size,
                                                @RequestParam(defaultValue = "id") String sortBy,
                                                @RequestParam(defaultValue = "desc") String order,
                                                HttpServletRequest request) {
        String token = Token.getTokenFromRequest(request);
        String username = jwtService.getUsernameFromToken(token);
        Pageable pageable = PageRequest.of(page, size, Sort.by(Sort.Direction.fromString(order), sortBy));
        return ResponseEntity.ok(clubService.getClubsByUser(username, keyword, pageable));
    }

    @DeleteMapping("/teacher/delete-user/{clubId}/{userId}")
    public ResponseEntity<ResponseMessage> deleteUserFromClub(@PathVariable Long clubId,
                                                              @PathVariable Long userId) {
        return ResponseEntity.ok(clubService.deleteUserFromClub(clubId, userId));
    }

    @PostMapping("/teacher/add-user/{clubId}/{username}")
    public ResponseEntity<ResponseMessage> postMethodName(@PathVariable Long clubId, @PathVariable String username) {
        return ResponseEntity.ok(clubService.addUserToClub(clubId, username));
    }
    
    @PutMapping("/teacher/update-membership/{memberShipId}/{roleInClub}/{status}")
    public ResponseEntity<ResponseMessage> updateMembership(@PathVariable Long memberShipId,
                                                            @PathVariable String roleInClub,
                                                            @PathVariable boolean status) {
        return ResponseEntity.ok(clubService.updateMembership(memberShipId, roleInClub, status));
    }
}
