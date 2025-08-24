package com.sai.backend.service;

import com.sai.backend.dto.LoginRequest;
import com.sai.backend.dto.LoginResponse;

public interface AuthService {
    LoginResponse login(LoginRequest loginRequest);
    void logout(String token);
    LoginResponse refreshToken(String refreshToken);
}