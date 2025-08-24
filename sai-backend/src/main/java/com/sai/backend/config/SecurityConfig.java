package com.sai.backend.config;

import com.sai.backend.security.JwtAuthenticationFilter;
import lombok.RequiredArgsConstructor;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

/**
 * Spring Security 配置类
 * 
 * TODO: 当基础功能开发完成后，需要完善以下安全配置：
 * 1. 实现 JWT 认证机制
 *    - 创建 JwtAuthenticationFilter
 *    - 实现 JWT Token 生成和验证
 *    - 配置 Token 过期时间和刷新机制
 * 
 * 2. 用户认证和授权
 *    - 实现 UserDetailsService
 *    - 配置密码加密（BCryptPasswordEncoder）
 *    - 创建登录/注册接口
 * 
 * 3. 角色权限控制
 *    - 定义用户角色（ADMIN, USER 等）
 *    - 配置接口访问权限
 *    - 实现基于角色的访问控制（@PreAuthorize）
 * 
 * 4. 安全配置优化
 *    - 配置 CORS 策略
 *    - 设置会话管理策略
 *    - 配置异常处理（401, 403 等）
 * 
 * 5. 接口权限分级
 *    - 公开接口：/api/auth/login, /api/auth/register
 *    - 认证接口：需要登录的基础功能
 *    - 管理接口：需要 ADMIN 角色的管理功能
 */
@Configuration
@EnableWebSecurity
@RequiredArgsConstructor
public class SecurityConfig {
    
    private final JwtAuthenticationFilter jwtAuthenticationFilter;
    private final UserDetailsService userDetailsService;
    
    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }
    
    @Bean
    public AuthenticationManager authenticationManager(
            AuthenticationConfiguration authConfig) throws Exception {
        return authConfig.getAuthenticationManager();
    }
    
    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        http.csrf(csrf -> csrf.disable())
            .sessionManagement(session -> session.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
            .authorizeHttpRequests(auth -> auth
                .requestMatchers("/auth/**").permitAll()  // 修改为 /auth/**
                .requestMatchers("/swagger-ui/**", "/swagger-ui.html", "/v3/api-docs/**", "/api-docs/**").permitAll()
                .anyRequest().authenticated()
            )
            .addFilterBefore(jwtAuthenticationFilter, UsernamePasswordAuthenticationFilter.class);
            
        return http.build();
    }
}