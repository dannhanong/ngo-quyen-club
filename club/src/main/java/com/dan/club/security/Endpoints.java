package com.dan.club.security;

public class Endpoints {
    public static final String[] PUBLIC_POST_ENDPOINTS = {
            "/auth/login",
            "/auth/signup",
            "/auth/hdkt-forgot-password",
            "/places/public/**",
    };

    public static final String[] PRIVATE_POST_ENDPOINTS = {
            "/auth/logout",
            "/places/private/**",
            "/feedbacks/private/**",
            "/itineraries/private/**",
            "/activities/private/**",
    };

    public static final String[] ADMIN_POST_ENDPOINTS = {
            "/auth/admin/**",
            "/packages/admin/**",
            "/categories/admin/**",
            "/clubs/admin/**",
    };

    public static final String[] ADMIN_PUT_ENDPOINTS = {
            "/auth/admin/**",
            "/categories/admin/**",
            "/places/admin/**",
    };

    public static final String[] ADMIN_GET_ENDPOINTS = {
            "/auth/admin/**",
    };

    public static final String[] ADMIN_DELETE_ENDPOINTS = {
            "/categories/admin/**",
            "/places/admin/**",
            "/clubs/admin/**",
    };

    public static final String[] PUBLIC_GET_ENDPOINTS = {
            "/auth/verify",
            "/auth/validate",
            "/auth/user/**",
            "/auth",
            "/auth/public/**",
            "/auth/get-name/**",
            "/auth/user/profile/**",
            "/auth/public/**",
            "/files/**",
            "/clubs/public/**",
            "/public/**",
    };

    public static final String[] PRIVATE_GET_ENDPOINTS = {
            "/auth/get/profile",
            "/clubs/private/**",
            "/activities/private/**",
    };

    public static final String[] PUBLIC_PUT_ENDPOINTS = {
            "/auth/reset-password",
    };

    public static final String[] PRIVATE_PUT_ENDPOINTS = {
            "/auth/update-profile",
            "/places/private/**",
            "/itineraries/private/**",
            "/activities/private/**",
    };

    public static final String[] PRIVATE_DELETE_ENDPOINTS = {
            "/places/private/**",
            "/itineraries/private/**",
            "/activities/private/**",
    };

    public static final String[] TEACHER_POST_ENDPOINTS = {
            "/clubs/teacher/**",
    };

    public static final String[] TEACHER_PUT_ENDPOINTS = {
            "/clubs/teacher/**",
    };

    public static final String[] TEACHER_DELETE_ENDPOINTS = {
            "/clubs/teacher/**",
    };
}
