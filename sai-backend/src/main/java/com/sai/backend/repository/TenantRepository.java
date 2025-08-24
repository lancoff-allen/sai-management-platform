package com.sai.backend.repository;

import com.sai.backend.entity.Tenant;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;
import java.util.UUID;

@Repository
public interface TenantRepository extends JpaRepository<Tenant, UUID> {
    
    Optional<Tenant> findByTenantCode(String tenantCode);
    
    Optional<Tenant> findByTenantCodeAndDeletedFalse(String tenantCode);
    
    boolean existsByTenantCode(String tenantCode);
}