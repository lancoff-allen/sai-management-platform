package com.sai.backend.security;

import lombok.extern.slf4j.Slf4j;

@Slf4j
public class TenantContext {
    
    private static final ThreadLocal<String> currentTenant = new ThreadLocal<>();
    private static final ThreadLocal<String> currentUserId = new ThreadLocal<>();
    
    public static void setCurrentTenant(String tenantId) {
        log.debug("Setting tenant context: {}", tenantId);
        currentTenant.set(tenantId);
    }
    
    public static String getCurrentTenant() {
        return currentTenant.get();
    }
    
    public static void setCurrentUserId(String userId) {
        log.debug("Setting user context: {}", userId);
        currentUserId.set(userId);
    }
    
    public static String getCurrentUserId() {
        return currentUserId.get();
    }
    
    public static void clear() {
        log.debug("Clearing tenant context");
        currentTenant.remove();
        currentUserId.remove();
    }
}