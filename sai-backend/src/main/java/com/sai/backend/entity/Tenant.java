package com.sai.backend.entity;

import jakarta.persistence.*;
import lombok.Data;
import lombok.EqualsAndHashCode;

@Data
@EqualsAndHashCode(callSuper = true)
@Entity
@Table(name = "tenants")
public class Tenant extends AbstractEntity {
    
    @Column(unique = true, nullable = false)
    private String tenantCode; // 租户代码，如 "company_a"
    
    @Column(nullable = false)
    private String tenantName; // 租户名称，如 "A公司"
    
    @Column
    private String description; // 租户描述
    
    @Column(nullable = false)
    private Boolean active = true; // 是否激活
    
    @Column
    private String contactEmail; // 联系邮箱
    
    @Column
    private String contactPhone; // 联系电话
}