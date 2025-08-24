package com.sai.backend.controller;

import com.sai.backend.common.result.Result;
import com.sai.backend.dto.LoginRequest;
import com.sai.backend.dto.LoginResponse;
import com.sai.backend.dto.TenantInfo;
import com.sai.backend.entity.Tenant;
import com.sai.backend.service.AuthService;
import com.sai.backend.service.TenantService;
import java.util.List;
import java.util.stream.Collectors;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/auth")  // 移除 /api 前缀
@RequiredArgsConstructor
@Slf4j
@Tag(name = "认证管理", description = "用户登录、注册、登出等认证相关操作")
public class AuthController {
    
    private final AuthService authService;
    // 在类中添加字段
    private final TenantService tenantService;
    
    @PostMapping("/login")
    @Operation(summary = "用户登录", description = "用户通过用户名、密码和租户代码进行登录")
    public Result<LoginResponse> login(@Valid @RequestBody LoginRequest loginRequest) {
        log.info("用户登录请求：{}", loginRequest.getUsername());
        LoginResponse response = authService.login(loginRequest);
        return Result.success(response);
    }
    
    @PostMapping("/logout")
    @Operation(summary = "用户登出", description = "用户登出，使token失效")
    public Result<Void> logout(HttpServletRequest request) {
        String token = extractTokenFromRequest(request);
        authService.logout(token);
        return Result.success();
    }
    
    @GetMapping("/tenants")
    @Operation(summary = "获取租户列表", description = "获取所有可用的租户列表供登录选择")
    public ResponseEntity<Result<List<TenantInfo>>> getTenants() {
        log.info("获取租户列表");
        
        List<Tenant> tenants = tenantService.getAllActiveTenants();
        
        List<TenantInfo> tenantInfos = tenants.stream()
                .map(tenant -> TenantInfo.builder()
                        .code(tenant.getTenantCode())
                        .name(tenant.getTenantName())
                        .description(tenant.getDescription())
                        .build())
                .collect(Collectors.toList());
        
        return ResponseEntity.ok(Result.success(tenantInfos));
    }
    
    private String extractTokenFromRequest(HttpServletRequest request) {
        String bearerToken = request.getHeader("Authorization");
        if (bearerToken != null && bearerToken.startsWith("Bearer ")) {
            return bearerToken.substring(7);
        }
        return null;
    }
}