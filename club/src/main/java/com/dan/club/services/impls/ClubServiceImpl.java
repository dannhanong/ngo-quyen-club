package com.dan.club.services.impls;

import com.dan.club.dtos.requests.ClubRequest;
import com.dan.club.dtos.requests.ClubRequestCreationByAdmin;
import com.dan.club.dtos.responses.ClubDetailResponse;
import com.dan.club.dtos.responses.ResponseMessage;
import com.dan.club.models.Club;
import com.dan.club.models.Membership;
import com.dan.club.models.User;
import com.dan.club.repositories.ClubRepository;
import com.dan.club.repositories.MembershipRepository;
import com.dan.club.repositories.UserRepository;
import com.dan.club.services.ClubService;
import com.dan.club.services.FileUploadService;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;
import java.util.Set;

@Service
@Transactional
public class ClubServiceImpl implements ClubService {
    @Autowired
    private ClubRepository clubRepository;
    @Autowired
    private FileUploadService fileUploadService;
    @Autowired
    private MembershipRepository membershipRepository;
    @Autowired
    private UserRepository userRepository;

    @Override
    public Page<Club> getAllClubs(String keyword, Pageable pageable) {
        return clubRepository.findByNameContainingIgnoreCase(keyword, pageable);
    }

    @Override
    public Club createClub(ClubRequest clubRequest, String username) {
        User user = userRepository.findByUsername(username);
        Club club = new Club();
        MultipartFile image = clubRequest.getImage();

        if (image != null) {
            try {
                String imageCode = fileUploadService.uploadFile(image).getFileCode();
                club.setImageCode(imageCode);
                club.setName(clubRequest.getName());
                club.setDescription(clubRequest.getDescription());
            } catch (IOException e) {
                throw new RuntimeException(e);
            }
        }

        Club savedClub = clubRepository.save(club);

        Membership charge = new Membership();
        charge.setClub(savedClub);
        charge.setRoleInClub("charge");
        charge.setUser(user);
        membershipRepository.save(charge);

        Membership leader = new Membership();
        leader.setClub(savedClub);
        leader.setRoleInClub("leader");
        leader.setUser(userRepository.findById(clubRequest.getLeaderId()).orElseThrow(() -> new RuntimeException("Không tìm thấy người dùng")));
        membershipRepository.save(leader);

        List<Long> memberIds = clubRequest.getMemberIds();
        for (Long memberId : memberIds) {
            Membership member = new Membership();
            member.setClub(savedClub);
            member.setRoleInClub("member");
            member.setUser(userRepository.findById(memberId).orElseThrow(() -> new RuntimeException("Không tìm thấy người dùng")));
            membershipRepository.save(member);
        }

        return savedClub;
    }

    @Override
    public Club createClubByAdmin(ClubRequestCreationByAdmin clubRequestCreationByAdmin) {
        Club club = new Club();
        MultipartFile image = clubRequestCreationByAdmin.getImage();

        if (image != null) {
            try {
                String imageCode = fileUploadService.uploadFile(image).getFileCode();
                club.setImageCode(imageCode);
                club.setName(clubRequestCreationByAdmin.getName());
                club.setDescription(clubRequestCreationByAdmin.getDescription());
            } catch (IOException e) {
                throw new RuntimeException(e);
            }
        }

        Club savedClub = clubRepository.save(club);

        Membership charge = new Membership();
        charge.setClub(savedClub);
        charge.setRoleInClub("charge");
        charge.setUser(userRepository.findById(clubRequestCreationByAdmin.getChargeId()).orElseThrow(() -> new RuntimeException("Không tìm thấy người dùng")));
        membershipRepository.save(charge);

        Membership leader = new Membership();
        leader.setClub(savedClub);
        leader.setRoleInClub("leader");
        leader.setUser(userRepository.findById(clubRequestCreationByAdmin.getLeaderId()).orElseThrow(() -> new RuntimeException("Không tìm thấy người dùng")));
        membershipRepository.save(leader);

        List<Long> memberIds = clubRequestCreationByAdmin.getMemberIds();
        for (Long memberId : memberIds) {
            Membership member = new Membership();
            member.setClub(savedClub);
            member.setRoleInClub("member");
            member.setUser(userRepository.findById(memberId).orElseThrow(() -> new RuntimeException("Không tìm thấy người dùng")));
            membershipRepository.save(member);
        }

        return savedClub;
    }

    @Override
    public Club updateClub(Long clubId, ClubRequest clubRequest) {
        return clubRepository.findById(clubId).map(club -> {
            MultipartFile image = clubRequest.getImage();

            if (image != null) {
                try {
                    String oldImageCode = club.getImageCode();
                    String imageCode = fileUploadService.uploadFile(image).getFileCode();
                    club.setImageCode(imageCode);

                    if (oldImageCode != null) {
                        fileUploadService.deleteFileByFileCode(oldImageCode);
                    }
                } catch (IOException e) {
                    throw new RuntimeException(e);
                }
            }

            club.setName(clubRequest.getName());
            club.setDescription(clubRequest.getDescription());

            Set<Membership> memberships = club.getMemberships();
            
            memberships.removeIf(membership -> membership.getRoleInClub().equals("leader"));
            memberships.removeIf(membership -> membership.getRoleInClub().equals("member"));

            Membership leader = new Membership();
            leader.setClub(club);
            leader.setRoleInClub("leader");
            leader.setUser(userRepository.findById(clubRequest
                .getLeaderId()).orElseThrow(() -> new RuntimeException("Không tìm thấy người dùng")));
            memberships.add(leader);

            List<Long> memberIds = clubRequest.getMemberIds();
            for (Long memberId : memberIds) {
                Membership member = new Membership();
                member.setClub(club);
                member.setRoleInClub("member");
                member.setUser(userRepository.findById(memberId).orElseThrow(() -> new RuntimeException("Không tìm thấy người dùng")));
                memberships.add(member);
            }

            return clubRepository.save(club);
        }).orElseThrow(() -> new RuntimeException("Club not found"));
    }

    @Override
    public ResponseMessage deleteClub(Long clubId) {
        return clubRepository.findById(clubId).map(club -> {
            String imageCode = club.getImageCode();
            clubRepository.delete(club);

            if (imageCode != null) {
                try {
                    fileUploadService.deleteFileByFileCode(imageCode);
                } catch (IOException e) {
                    throw new RuntimeException(e);
                }
            }

            return new ResponseMessage(200, "Xóa câu lạc bộ thành công");
        }).orElseThrow(() -> new RuntimeException("Không tìm thấy câu lạc bộ"));
    }

    @Override
    public ClubDetailResponse getClubById(Long clubId) {
        Club club = clubRepository.findById(clubId).orElseThrow(() -> new RuntimeException("Không tìm thấy câu lạc bộ"));
        List<Membership> memberships = membershipRepository.findByClub_Id(clubId);
        return ClubDetailResponse.builder().club(club).membership(memberships).build();
    }

    @Override
    public Page<Club> getClubsByUser(String username, String keyword, Pageable pageable) {
        return membershipRepository.findByUser_UsernameAndClub_NameContainingIgnoreCase(username, keyword, pageable)
                .map(Membership::getClub);
    }

    @Override
    public ResponseMessage deleteUserFromClub(Long clubId, Long userId) {
        membershipRepository.deleteByUser_IdAndClub_Id(userId, clubId);
        return new ResponseMessage(200, "Xóa người dùng khỏi câu lạc bộ thành công");
    }

    @Override
    public ResponseMessage addUserToClub(Long clubId, String username) {
        if (membershipRepository.existsByUser_UsernameAndClub_Id(username, clubId)) {
            return new ResponseMessage(200, "Người dùng đã tồn tại trong câu lạc bộ");
        }

        Membership membership = new Membership();
        membership.setClub(clubRepository.findById(clubId).orElseThrow(() -> new RuntimeException("Không tìm thấy câu lạc bộ")));
        membership.setUser(userRepository.findByUsername(username));
        membership.setRoleInClub("member");
        membership.setStatus(true);
        membershipRepository.save(membership);
        return new ResponseMessage(200, "Thêm người dùng vào câu lạc bộ thành công");
    }

    @Override
    public ResponseMessage updateMembership(Long memberShipId, String roleInClub, boolean status) {
        Membership membership = membershipRepository.findById(memberShipId).orElseThrow(() -> new RuntimeException("Không tìm thấy quyền thành viên"));
        membership.setRoleInClub(roleInClub);
        membership.setStatus(status);
        membershipRepository.save(membership);
        return new ResponseMessage(200, "Cập nhật quyền thành viên thành công");
    }

    @Override
    @Transactional
    public ResponseMessage deleteMembership(Long id) {
        if (!membershipRepository.existsById(id)) {
            throw new RuntimeException("Không tìm thấy quyền thành viên");
        }
        
        membershipRepository.deleteMembershipById(id); // Sử dụng phương thức mới
        
        return new ResponseMessage(200, "Xóa thành viên thành công");
    }
}
