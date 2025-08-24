package com.sai.backend.repository;

import com.sai.backend.entity.Tenant;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface TenantRepository extends JpaRepository<Tenant, UUID> {
    
    Optional<Tenant> findByTenantCode(String tenantCode);
    
    Optional<Tenant> findByTenantCodeAndDeletedFalse(String tenantCode);
    
    boolean existsByTenantCode(String tenantCode);
    
    // 新增：查询所有激活且未删除的租户
    List<Tenant> findByActiveAndDeletedFalse(Boolean active);
    
    // 新增：按租户名称排序查询激活租户
    List<Tenant> findByActiveAndDeletedFalseOrderByTenantName(Boolean active);
}