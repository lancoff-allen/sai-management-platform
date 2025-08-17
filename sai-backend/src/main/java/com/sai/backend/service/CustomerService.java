package com.sai.backend.service;

import com.sai.backend.dto.CustomerDTO;
import com.sai.backend.entity.Customer;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.util.List;

public interface CustomerService {
    
    /**
     * 创建客户
     */
    Customer createCustomer(CustomerDTO customerDTO);
    
    /**
     * 根据ID获取客户
     */
    Customer getCustomerById(Long id);
    
    /**
     * 更新客户信息
     */
    Customer updateCustomer(Long id, CustomerDTO customerDTO);
    
    /**
     * 删除客户（逻辑删除）
     */
    void deleteCustomer(Long id);
    
    /**
     * 获取所有客户列表
     */
    List<Customer> getAllCustomers();
    
    /**
     * 分页查询客户
     */
    Page<Customer> getCustomersPage(Pageable pageable);
    
    /**
     * 条件查询客户
     */
    Page<Customer> searchCustomers(String name, String contactPerson, String phone, Integer status, Pageable pageable);
    
    /**
     * 启用/禁用客户
     */
    Customer toggleCustomerStatus(Long id);
}