package com.sai.backend.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.*;
import lombok.Data;
import lombok.EqualsAndHashCode;

@Data
@EqualsAndHashCode(callSuper = true)
@Entity
@Table(name = "customers")
public class Customer extends BaseEntity {
    
    @NotBlank(message = "客户名称不能为空")
    @Size(max = 100, message = "客户名称长度不能超过100个字符")
    @Column(name = "customer_name", nullable = false, length = 100)
    private String customerName;
    
    @Column(name = "status", nullable = false)
    private Boolean status = true; // true=启用，false=禁用
    
    @Size(max = 50, message = "国家长度不能超过50个字符")
    @Column(name = "country", length = 50)
    private String country;
    
    @Size(max = 50, message = "省份长度不能超过50个字符")
    @Column(name = "province", length = 50)
    private String province;
    
    @Size(max = 50, message = "城市长度不能超过50个字符")
    @Column(name = "city", length = 50)
    private String city;
    
    @Size(max = 50, message = "区县长度不能超过50个字符")
    @Column(name = "district", length = 50)
    private String district;
    
    @Size(max = 50, message = "联系人长度不能超过50个字符")
    @Column(name = "contact_person", length = 50)
    private String contactPerson;
    
    @NotBlank(message = "联系电话不能为空")
    @Pattern(regexp = "^1[3-9]\\d{9}$", message = "请输入正确的手机号码")
    @Column(name = "contact_phone", nullable = false, length = 20)
    private String contactPhone;
    
    @Email(message = "请输入正确的邮箱地址")
    @Size(max = 100, message = "邮箱长度不能超过100个字符")
    @Column(name = "contact_email", length = 100)
    private String contactEmail;
    
    @Column(name = "remark", columnDefinition = "TEXT")
    private String remark;
}