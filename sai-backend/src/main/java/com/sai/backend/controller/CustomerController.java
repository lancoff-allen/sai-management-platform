package com.sai.backend.controller;

import com.sai.backend.common.result.PageResult;
import com.sai.backend.common.result.Result;
import com.sai.backend.dto.CustomerDTO;
import com.sai.backend.entity.Customer;
import com.sai.backend.service.CustomerService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.web.bind.annotation.*;


@Slf4j
@RestController
@RequestMapping("/customers")
@RequiredArgsConstructor
public class CustomerController {
    
    private final CustomerService customerService;
    
    /**
     * 客户列表查询
     */
    @GetMapping
    public Result<PageResult<Customer>> getCustomers(
            @RequestParam(defaultValue = "10") Integer pageSize,
            @RequestParam(defaultValue = "1") Integer current,
            @RequestParam(required = false) String name,
            @RequestParam(required = false) String country) {
        
        log.info("查询客户列表 - pageSize: {}, current: {}, name: {}, country: {}", pageSize, current, name, country);
        
        // 创建分页对象，注意current从1开始，需要转换为从0开始
        Pageable pageable = PageRequest.of(current - 1, pageSize, Sort.by(Sort.Direction.DESC, "createTime"));
        
        Page<Customer> customerPage;
        if (name != null || country != null) {
            // 条件查询（这里简化处理，实际可能需要更复杂的查询逻辑）
            customerPage = customerService.searchCustomers(name, null, null, null, pageable);
        } else {
            customerPage = customerService.getCustomersPage(pageable);
        }
        
        PageResult<Customer> pageResult = PageResult.of(customerPage.getContent(), customerPage.getTotalElements());
        return Result.success(pageResult);
    }
    
    /**
     * 新增客户
     */
    @PostMapping
    public Result<Customer> createCustomer(@Valid @RequestBody CustomerDTO customerDTO) {
        log.info("新增客户：{}", customerDTO.getCustomerName());
        
        Customer customer = customerService.createCustomer(customerDTO);
        return Result.success("客户创建成功", customer);
    }
    
    /**
     * 客户详情查询
     */
    @GetMapping("/{id}")
    public Result<Customer> getCustomerById(@PathVariable Long id) {
        log.info("查询客户详情：{}", id);
        
        Customer customer = customerService.getCustomerById(id);
        return Result.success(customer);
    }
    
    /**
     * 更新客户
     */
    @PutMapping("/{id}")
    public Result<Customer> updateCustomer(@PathVariable Long id, @Valid @RequestBody CustomerDTO customerDTO) {
        log.info("更新客户：{}", id);
        
        Customer customer = customerService.updateCustomer(id, customerDTO);
        return Result.success("客户更新成功", customer);
    }
    
    /**
     * 删除客户
     */
    @DeleteMapping("/{id}")
    public Result<Void> deleteCustomer(@PathVariable Long id) {
        log.info("删除客户：{}", id);
        
        customerService.deleteCustomer(id);
        return Result.success("客户删除成功", null);
    }
    
    /**
     * 启用/禁用客户
     */
    @PutMapping("/{id}/toggle-status")
    public Result<Customer> toggleCustomerStatus(@PathVariable Long id) {
        log.info("切换客户状态：{}", id);
        
        Customer customer = customerService.toggleCustomerStatus(id);
        return Result.success("客户状态更新成功", customer);
    }
}