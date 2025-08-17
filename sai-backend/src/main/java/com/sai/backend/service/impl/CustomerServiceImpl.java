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

@Slf4j
@Service
@RequiredArgsConstructor
public class CustomerServiceImpl implements CustomerService {
    
    private final CustomerRepository customerRepository;
    
    @Override
    @Transactional
    public Customer createCustomer(CustomerDTO customerDTO) {
        log.info("创建客户：{}", customerDTO.getCustomerName());
        
        Customer customer = new Customer();
        BeanUtils.copyProperties(customerDTO, customer);
        
        // 设置默认状态为启用
        if (customer.getStatus() == null) {
            customer.setStatus(true);
        }
        
        return customerRepository.save(customer);
    }
    
    @Override
    public Customer getCustomerById(Long id) {
        log.info("根据ID获取客户：{}", id);
        return customerRepository.findByIdAndDeletedFalse(id)
                .orElseThrow(() -> new RuntimeException("客户不存在或已删除"));
    }
    
    @Override
    @Transactional
    public Customer updateCustomer(Long id, CustomerDTO customerDTO) {
        log.info("更新客户信息：{}", id);
        
        Customer existingCustomer = getCustomerById(id);
        
        // 复制属性，排除id和时间字段
        BeanUtils.copyProperties(customerDTO, existingCustomer, "id", "createTime", "updateTime", "deleted");
        
        return customerRepository.save(existingCustomer);
    }
    
    @Override
    @Transactional
    public void deleteCustomer(Long id) {
        log.info("删除客户：{}", id);
        
        Customer customer = getCustomerById(id);
        customer.setDeleted(true);
        customerRepository.save(customer);
    }
    
    @Override
    public List<Customer> getAllCustomers() {
        log.info("获取所有客户列表");
        return customerRepository.findByDeletedFalseOrderByCreateTimeDesc();
    }
    
    @Override
    public Page<Customer> getCustomersPage(Pageable pageable) {
        log.info("分页查询客户");
        return customerRepository.findByDeletedFalse(pageable);
    }
    
    @Override
    public Page<Customer> searchCustomers(String name, String contactPerson, String phone, Integer status, Pageable pageable) {
        log.info("条件查询客户 - name: {}, contactPerson: {}, phone: {}, status: {}", name, contactPerson, phone, status);
        
        // 注意：这里需要修改Repository中的查询，因为实体字段名已经改变
        return customerRepository.findByConditions(name, contactPerson, phone, status, pageable);
    }
    
    @Override
    @Transactional
    public Customer toggleCustomerStatus(Long id) {
        log.info("切换客户状态：{}", id);
        
        Customer customer = getCustomerById(id);
        customer.setStatus(!customer.getStatus());
        
        return customerRepository.save(customer);
    }
}