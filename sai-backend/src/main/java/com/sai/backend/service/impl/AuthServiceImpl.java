package com.sai.backend.service.impl;

import com.sai.backend.dto.LoginRequest;
import com.sai.backend.dto.LoginResponse;
import com.sai.backend.entity.Tenant;
import com.sai.backend.entity.User;
import com.sai.backend.repository.TenantRepository;
import com.sai.backend.repository.UserRepository;
import com.sai.backend.security.JwtTokenUtil;
import com.sai.backend.service.AuthService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
@Slf4j
public class AuthServiceImpl implements AuthService {
    
    private final UserRepository userRepository;
    private final TenantRepository tenantRepository;
    // private final PasswordEncoder passwordEncoder;
    private final JwtTokenUtil jwtTokenUtil;
    private final AuthenticationManager authenticationManager;
    
    @Override
    public LoginResponse login(LoginRequest loginRequest) {
        log.info("开始登录验证 - 用户名: {}, 租户代码: {}", loginRequest.getUsername(), loginRequest.getTenantCode());
        
        // 验证租户
        Tenant tenant = tenantRepository.findByTenantCodeAndDeletedFalse(loginRequest.getTenantCode())
                .orElseThrow(() -> {
                    log.error("租户不存在或已禁用: {}", loginRequest.getTenantCode());
                    return new RuntimeException("租户不存在或已禁用");
                });
        log.info("租户验证成功 - 租户ID: {}, 租户名称: {}", tenant.getId(), tenant.getTenantName());
        
        // 验证用户
        User user = userRepository.findByUsernameAndDeletedFalse(loginRequest.getUsername())
                .orElseThrow(() -> {
                    log.error("用户不存在: {}", loginRequest.getUsername());
                    return new RuntimeException("用户不存在");
                });
        log.info("用户查询成功 - 用户ID: {}, 用户租户ID: {}", user.getId(), user.getTenantId());
        
        // 验证用户是否属于该租户
        if (!user.getTenantId().equals(tenant.getId())) {
            log.error("用户租户不匹配 - 用户租户ID: {}, 请求租户ID: {}", user.getTenantId(), tenant.getId());
            throw new RuntimeException("用户不属于该租户");
        }
        log.info("租户关联验证成功");
        
        // 验证密码
        try {
            authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(
                    loginRequest.getUsername(),
                    loginRequest.getPassword()
                )
            );
            log.info("Spring Security 认证成功");
        } catch (Exception e) {
            log.error("Spring Security 认证失败: {}", e.getMessage(), e);
            throw e;
        }
        
        // 生成 JWT token
        String token = jwtTokenUtil.generateToken(user);
        
        return LoginResponse.builder()
                .token(token)
                .expiresIn(86400L) // 24小时
                .userInfo(LoginResponse.UserInfo.builder()
                        .userId(user.getId().toString())
                        .username(user.getUsername())
                        .email(user.getEmail())
                        .tenantId(user.getTenantId().toString())  // 添加 .toString()
                        .role(user.getRole().name())
                        .build())
                .build();
    }
    
    @Override
    public void logout(String token) {
        // TODO: 实现token黑名单机制
        log.info("用户登出，token: {}", token);
    }
    
    @Override
    public LoginResponse refreshToken(String refreshToken) {
        // TODO: 实现token刷新机制
        throw new RuntimeException("刷新token功能暂未实现");
    }
}