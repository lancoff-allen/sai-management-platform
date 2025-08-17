package com.sai.backend.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.web.SecurityFilterChain;

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
public class SecurityConfig {
    
    /**
     * 临时配置：禁用所有安全限制，便于开发阶段测试
     * TODO: 在基础功能开发完成后，替换为正式的安全配置
     */
    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        http.csrf(csrf -> csrf.disable())
            .authorizeHttpRequests(auth -> auth.anyRequest().permitAll());
        return http.build();
    }
    
    // TODO: 添加以下 Bean 配置
    // @Bean
    // public PasswordEncoder passwordEncoder() {
    //     return new BCryptPasswordEncoder();
    // }
    
    // @Bean
    // public JwtAuthenticationEntryPoint jwtAuthenticationEntryPoint() {
    //     return new JwtAuthenticationEntryPoint();
    // }
    
    // @Bean
    // public JwtRequestFilter jwtRequestFilter() {
    //     return new JwtRequestFilter();
    // }
}