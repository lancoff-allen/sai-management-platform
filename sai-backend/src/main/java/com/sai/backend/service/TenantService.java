package com.sai.backend.service;

import com.sai.backend.entity.Tenant;
import java.util.List;

public interface TenantService {
    /**
     * 获取所有激活的租户列表
     */
    List<Tenant> getAllActiveTenants();
    
    /**
     * 根据租户代码获取租户信息
     */
    Tenant getTenantByCode(String tenantCode);
}