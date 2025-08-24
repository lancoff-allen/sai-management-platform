package com.sai.backend.controller;

import com.sai.backend.common.result.PageResult;
import com.sai.backend.common.result.Result;
import com.sai.backend.dto.CustomerDTO;
import com.sai.backend.entity.Customer;
import com.sai.backend.service.CustomerService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.web.bind.annotation.*;

import java.util.UUID;

@Slf4j
@RestController
@RequestMapping("/customers")
@RequiredArgsConstructor
@Tag(name = "客户管理", description = "客户信息的增删改查操作")
public class CustomerController {
    
    private final CustomerService customerService;
    
    // 获取当前租户ID的辅助方法
    private UUID getCurrentTenantId() {
        // 暂时硬编码租户ID，后续从认证上下文中获取
        return UUID.fromString("550e8400-e29b-41d4-a716-446655440000");
    }
    
    @Operation(summary = "分页查询客户列表", description = "支持按客户名称和国家进行筛选的分页查询")
    @ApiResponses(value = {
        @ApiResponse(responseCode = "200", description = "查询成功"),
        @ApiResponse(responseCode = "400", description = "请求参数错误"),
        @ApiResponse(responseCode = "500", description = "服务器内部错误")
    })
    @GetMapping
    public Result<PageResult<Customer>> getCustomers(
            @Parameter(description = "每页数量", example = "10") 
            @RequestParam(defaultValue = "10") Integer pageSize,
            @Parameter(description = "当前页码", example = "1") 
            @RequestParam(defaultValue = "1") Integer current,
            @Parameter(description = "客户名称（模糊查询）", example = "赛轮") 
            @RequestParam(required = false) String name,
            @Parameter(description = "国家名称", example = "中国") 
            @RequestParam(required = false) String country) {
        
        log.info("查询客户列表 - pageSize: {}, current: {}, name: {}, country: {}", pageSize, current, name, country);
        
        UUID tenantId = getCurrentTenantId();
        
        // 创建分页对象，注意current从1开始，需要转换为从0开始
        Pageable pageable = PageRequest.of(current - 1, pageSize, Sort.by(Sort.Direction.DESC, "createTime"));
        
        Page<Customer> customerPage;
        if (name != null || country != null) {
            // 条件查询
            customerPage = customerService.searchCustomers(tenantId, name, country, null, pageSize, pageable);
        } else {
            customerPage = customerService.getCustomersPage(tenantId, pageable);
        }
        
        PageResult<Customer> pageResult = PageResult.of(customerPage.getContent(), customerPage.getTotalElements());
        return Result.success(pageResult);
    }
    
    @Operation(summary = "新增客户", description = "创建新的客户信息")
    @ApiResponses(value = {
        @ApiResponse(responseCode = "200", description = "创建成功"),
        @ApiResponse(responseCode = "400", description = "请求参数错误或数据验证失败"),
        @ApiResponse(responseCode = "500", description = "服务器内部错误")
    })
    @PostMapping
    public Result<Customer> createCustomer(
            @Parameter(description = "客户信息", required = true)
            @Valid @RequestBody CustomerDTO customerDTO) {
        log.info("新增客户：{}", customerDTO.getCustomerName());
        
        UUID tenantId = getCurrentTenantId();
        Customer customer = customerService.createCustomer(customerDTO, tenantId);
        return Result.success("客户创建成功", customer);
    }
    
    @Operation(summary = "查询客户详情", description = "根据客户ID查询详细信息")
    @ApiResponses(value = {
        @ApiResponse(responseCode = "200", description = "查询成功"),
        @ApiResponse(responseCode = "404", description = "客户不存在"),
        @ApiResponse(responseCode = "500", description = "服务器内部错误")
    })
    @GetMapping("/{id}")
    public Result<Customer> getCustomerById(@PathVariable UUID id) {
        log.info("查询客户详情：{}", id);
        
        UUID tenantId = getCurrentTenantId();
        Customer customer = customerService.getCustomerById(id, tenantId);
        return Result.success(customer);
    }
    
    @Operation(summary = "更新客户信息", description = "根据客户ID更新客户信息")
    @ApiResponses(value = {
        @ApiResponse(responseCode = "200", description = "更新成功"),
        @ApiResponse(responseCode = "400", description = "请求参数错误或数据验证失败"),
        @ApiResponse(responseCode = "404", description = "客户不存在"),
        @ApiResponse(responseCode = "500", description = "服务器内部错误")
    })
    @PutMapping("/{id}")
    public Result<Customer> updateCustomer(
            @Parameter(description = "客户ID", example = "550e8400-e29b-41d4-a716-446655440000", required = true)
            @PathVariable UUID id,
            @Parameter(description = "更新的客户信息", required = true)
            @Valid @RequestBody CustomerDTO customerDTO) {
        log.info("更新客户：{}", id);
        
        UUID tenantId = getCurrentTenantId();
        Customer customer = customerService.updateCustomer(id, customerDTO, tenantId);
        return Result.success("客户更新成功", customer);
    }
    
    @Operation(summary = "删除客户", description = "根据客户ID删除客户（软删除）")
    @ApiResponses(value = {
        @ApiResponse(responseCode = "200", description = "删除成功"),
        @ApiResponse(responseCode = "404", description = "客户不存在"),
        @ApiResponse(responseCode = "500", description = "服务器内部错误")
    })
    @DeleteMapping("/{id}")
    public Result<Void> deleteCustomer(
            @Parameter(description = "客户ID", example = "550e8400-e29b-41d4-a716-446655440000", required = true)
            @PathVariable UUID id) {
        log.info("删除客户：{}", id);
        
        UUID tenantId = getCurrentTenantId();
        customerService.deleteCustomer(id, tenantId);
        return Result.success("客户删除成功", null);
    }
    
    @Operation(summary = "切换客户状态", description = "启用或禁用客户（切换 status 字段）")
    @ApiResponses(value = {
        @ApiResponse(responseCode = "200", description = "状态切换成功"),
        @ApiResponse(responseCode = "404", description = "客户不存在"),
        @ApiResponse(responseCode = "500", description = "服务器内部错误")
    })
    @PutMapping("/{id}/toggle-status")
    public Result<Customer> toggleCustomerStatus(
            @Parameter(description = "客户ID", example = "550e8400-e29b-41d4-a716-446655440000", required = true)
            @PathVariable UUID id) {
        log.info("切换客户状态：{}", id);
        
        UUID tenantId = getCurrentTenantId();
        Customer customer = customerService.toggleCustomerStatus(id, tenantId);
        return Result.success("客户状态更新成功", customer);
    }
}