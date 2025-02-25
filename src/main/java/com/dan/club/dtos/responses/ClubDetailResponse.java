package com.dan.club.dtos.responses;

import java.util.List;

import com.dan.club.models.Club;
import com.dan.club.models.Membership;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ClubDetailResponse {
    private Club club;
    private List<Membership> membership;
}
