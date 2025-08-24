package com.sai.backend.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class TenantInfo {
    private String code;        // 租户代码
    private String name;        // 租户名称
    private String description; // 租户描述
}