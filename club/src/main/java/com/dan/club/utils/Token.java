package com.dan.club.utils;

import jakarta.servlet.http.HttpServletRequest;

public class Token {
    public static String getTokenFromRequest(HttpServletRequest request) {
        String token = request.getHeader("Authorization");
        if (token != null && token.startsWith("Bearer ")) {
            return token.substring(7);
        }
        return null;
    }
}
