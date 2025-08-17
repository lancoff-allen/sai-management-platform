package com.sai.backend.repository;

import com.sai.backend.entity.Customer;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface CustomerRepository extends JpaRepository<Customer, Long> {
    
    /**
     * 根据ID查询未删除的客户
     */
    Optional<Customer> findByIdAndDeletedFalse(Long id);
    
    /**
     * 查询所有未删除的客户
     */
    List<Customer> findByDeletedFalseOrderByCreateTimeDesc();
    
    /**
     * 分页查询未删除的客户
     */
    Page<Customer> findByDeletedFalse(Pageable pageable);
    
    /**
     * 根据客户名称模糊查询
     */
    @Query("SELECT c FROM Customer c WHERE c.deleted = false AND c.customerName LIKE %:name% ORDER BY c.createTime DESC")
    Page<Customer> findByNameContaining(@Param("name") String name, Pageable pageable);
    
    /**
     * 根据联系人模糊查询
     */
    @Query("SELECT c FROM Customer c WHERE c.deleted = false AND c.contactPerson LIKE %:contactPerson% ORDER BY c.createTime DESC")
    Page<Customer> findByContactPersonContaining(@Param("contactPerson") String contactPerson, Pageable pageable);
    
    /**
     * 根据电话号码查询
     */
    Optional<Customer> findByContactPhoneAndDeletedFalse(String contactPhone);
    
    /**
     * 根据状态查询
     */
    Page<Customer> findByStatusAndDeletedFalse(Boolean status, Pageable pageable);
    
    /**
     * 复合条件查询
     */
    @Query("SELECT c FROM Customer c WHERE c.deleted = false " +
           "AND (:name IS NULL OR c.customerName LIKE %:name%) " +
           "AND (:contactPerson IS NULL OR c.contactPerson LIKE %:contactPerson%) " +
           "AND (:phone IS NULL OR c.contactPhone = :phone) " +
           "AND (:status IS NULL OR c.status = :status) " +
           "ORDER BY c.createTime DESC")
    Page<Customer> findByConditions(@Param("name") String name,
                                   @Param("contactPerson") String contactPerson,
                                   @Param("phone") String phone,
                                   @Param("status") Integer status,
                                   Pageable pageable);
}