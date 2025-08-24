package com.sai.backend.service;

import com.sai.backend.dto.CustomerDTO;
import com.sai.backend.entity.Customer;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.util.List;
import java.util.UUID;

public interface CustomerService {
    
    /**
     * 创建客户
     */
    Customer createCustomer(CustomerDTO customerDTO, UUID tenantId);
    
    /**
     * 根据ID获取客户
     */
    Customer getCustomerById(UUID id, UUID tenantId);
    
    /**
     * 更新客户信息
     */
    Customer updateCustomer(UUID id, CustomerDTO customerDTO, UUID tenantId);
    
    /**
     * 删除客户（逻辑删除）
     */
    void deleteCustomer(UUID id, UUID tenantId);
    
    /**
     * 获取所有客户列表
     */
    List<Customer> getAllCustomers(UUID tenantId);
    
    /**
     * 分页查询客户
     */
    Page<Customer> getCustomersPage(UUID tenantId, Pageable pageable);
    
    /**
     * 条件查询客户
     */
    Page<Customer> searchCustomers(UUID tenantId, String name, String contactPerson, String phone, Integer status, Pageable pageable);
    
    /**
     * 启用/禁用客户
     */
    Customer toggleCustomerStatus(UUID id, UUID tenantId);
}