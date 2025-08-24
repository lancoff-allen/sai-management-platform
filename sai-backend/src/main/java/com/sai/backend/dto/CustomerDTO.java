package com.sai.backend.dto;

import jakarta.validation.constraints.*;
import lombok.Data;
import java.util.UUID; // 添加 UUID 导入

@Data
public class CustomerDTO {
    private UUID id; // 从 Long 改为 UUID
    
    @NotBlank(message = "客户名称不能为空")
    @Size(max = 100, message = "客户名称长度不能超过100个字符")
    private String customerName;
    
    private Boolean status;
    
    @Size(max = 50, message = "国家长度不能超过50个字符")
    private String country;
    
    @Size(max = 50, message = "省份长度不能超过50个字符")
    private String province;
    
    @Size(max = 50, message = "城市长度不能超过50个字符")
    private String city;
    
    @Size(max = 50, message = "区县长度不能超过50个字符")
    private String district;
    
    @Size(max = 50, message = "联系人长度不能超过50个字符")
    private String contactPerson;
    
    @NotBlank(message = "联系电话不能为空")
    @Pattern(regexp = "^1[3-9]\\d{9}$", message = "请输入正确的手机号码")
    private String contactPhone;
    
    @Email(message = "请输入正确的邮箱地址")
    @Size(max = 100, message = "邮箱长度不能超过100个字符")
    private String contactEmail;
    
    @Size(max = 500, message = "备注信息长度不能超过500个字符")
    private String remark;
}