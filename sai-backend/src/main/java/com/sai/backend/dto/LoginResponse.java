package com.sai.backend.dto;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class LoginResponse {
    private String token;
    @Builder.Default
    private String tokenType = "Bearer";
    private Long expiresIn;
    private UserInfo userInfo;
    
    @Data
    @Builder
    public static class UserInfo {
        private String userId;
        private String username;
        private String email;
        private String tenantId;
        private String role;
    }
}