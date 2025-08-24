package com.sai.backend.service.impl;

import com.sai.backend.dto.CustomerDTO;
import com.sai.backend.entity.Customer;
import com.sai.backend.repository.CustomerRepository;
import com.sai.backend.service.CustomerService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.BeanUtils;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.UUID; // 添加 UUID 导入

@Slf4j
@Service
@RequiredArgsConstructor
public class CustomerServiceImpl implements CustomerService {
    
    private final CustomerRepository customerRepository;
    
    @Override
    @Transactional
    public Customer createCustomer(CustomerDTO customerDTO, UUID tenantId) {
        log.info("创建客户：{}, 租户：{}", customerDTO.getCustomerName(), tenantId);
        
        Customer customer = new Customer();
        // 排除 id 字段，让 JPA 自动生成 UUID
        BeanUtils.copyProperties(customerDTO, customer, "id");
        
        // 设置租户ID
        customer.setTenantId(tenantId);
        
        // 设置默认状态为启用
        if (customer.getStatus() == null) {
            customer.setStatus(true);
        }
        
        return customerRepository.save(customer);
    }
    
    @Override
    public Customer getCustomerById(UUID id, UUID tenantId) {
        log.info("根据ID获取客户：{}, 租户：{}", id, tenantId);
        return customerRepository.findByIdAndTenantIdAndDeletedFalse(id, tenantId)
                .orElseThrow(() -> new RuntimeException("客户不存在或已删除"));
    }
    
    @Override
    @Transactional
    public Customer updateCustomer(UUID id, CustomerDTO customerDTO, UUID tenantId) {
        log.info("更新客户信息：{}, 租户：{}", id, tenantId);
        
        Customer existingCustomer = getCustomerById(id, tenantId);
        
        // 复制属性，排除id、时间字段和租户字段
        BeanUtils.copyProperties(customerDTO, existingCustomer, "id", "createTime", "updateTime", "deleted", "tenantId");
        
        return customerRepository.save(existingCustomer);
    }
    
    @Override
    public List<Customer> getAllCustomers(UUID tenantId) {
        log.info("获取所有客户列表，租户：{}", tenantId);
        return customerRepository.findByTenantIdAndDeletedFalseOrderByCreateTimeDesc(tenantId);
    }
    
    @Override
    public Page<Customer> getCustomersPage(UUID tenantId, Pageable pageable) {
        log.info("分页查询客户，租户：{}", tenantId);
        return customerRepository.findByTenantIdAndDeletedFalse(tenantId, pageable);
    }
    
    @Override
    public Page<Customer> searchCustomers(UUID tenantId, String name, String contactPerson, String phone, Integer status, Pageable pageable) {
        log.info("条件查询客户 - 租户：{}, name: {}, contactPerson: {}, phone: {}, status: {}", tenantId, name, contactPerson, phone, status);
        
        return customerRepository.findByTenantIdAndConditions(tenantId, name, contactPerson, phone, status, pageable);
    }
    
    @Override
    @Transactional
    public Customer toggleCustomerStatus(UUID id, UUID tenantId) {
        log.info("切换客户状态：{}, 租户：{}", id, tenantId);
        
        Customer customer = getCustomerById(id, tenantId);
        customer.setStatus(!customer.getStatus());
        
        return customerRepository.save(customer);
    }
    
    @Override
    @Transactional
    public void deleteCustomer(UUID id, UUID tenantId) {
        log.info("删除客户：{}, 租户：{}", id, tenantId);
        
        Customer customer = getCustomerById(id, tenantId);
        customer.setDeleted(true);
        
        customerRepository.save(customer);
    }
}