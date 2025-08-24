package com.sai.backend.service.impl;

import com.sai.backend.entity.Tenant;
import com.sai.backend.repository.TenantRepository;
import com.sai.backend.service.TenantService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
@Slf4j
public class TenantServiceImpl implements TenantService {
    
    private final TenantRepository tenantRepository;
    
    @Override
    public List<Tenant> getAllActiveTenants() {
        log.info("获取所有激活的租户列表");
        return tenantRepository.findByActiveAndDeletedFalse(true);
    }
    
    @Override
    public Tenant getTenantByCode(String tenantCode) {
        log.info("根据租户代码获取租户信息: {}", tenantCode);
        return tenantRepository.findByTenantCodeAndDeletedFalse(tenantCode)
                .orElseThrow(() -> new RuntimeException("租户不存在: " + tenantCode));
    }
}