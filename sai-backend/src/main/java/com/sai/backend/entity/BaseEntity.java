package com.sai.backend.entity;

import jakarta.persistence.Column;
import jakarta.persistence.MappedSuperclass;
import lombok.Data;
import lombok.EqualsAndHashCode;

import java.util.UUID; // 添加UUID导入

@Data
@EqualsAndHashCode(callSuper = true)
@MappedSuperclass
public abstract class BaseEntity extends AbstractEntity {
    
    @Column(name = "tenant_id", nullable = false)
    private UUID tenantId; // 改为UUID类型
}