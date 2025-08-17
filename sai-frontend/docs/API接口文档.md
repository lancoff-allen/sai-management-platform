# SAI管理平台 - API接口文档

## 📋 目录
- [1. 客户管理模块](#1-客户管理模块)
- [2. 设备管理模块](#2-设备管理模块)
- [3. 工单管理模块](#3-工单管理模块)
- [4. 实体结构定义](#4-实体结构定义)
- [5. 枚举定义](#5-枚举定义)
- [6. 统一响应格式](#6-统一响应格式)

---

## 1. 客户管理模块

### 1.1 客户列表查询
- **接口路径**: `GET /api/customers`
- **接口描述**: 分页查询客户列表，支持按客户名称和国家筛选
- **请求参数**:
  ```json
  {
    "pageSize": 10,        // 每页数量
    "current": 1,          // 当前页码
    "name": "赛轮",        // 客户名称（可选）
    "country": "中国"      // 国家（可选）
  }
  ```
- **响应数据**:
  ```json
  {
    "code": 0,
    "message": "success",
    "data": {
      "list": [
        {
          "id": 1,
          "customerName": "黄岛赛轮",
          "status": true,
          "country": "中国",
          "province": "山东",
          "city": "青岛",
          "district": "黄岛",
          "contactPerson": "张三",
          "contactPhone": "13800138000",
          "contactEmail": "zhangsan@sailun.com",
          "remark": "重要客户",
          "createTime": "2024-01-15 10:30:00",
          "updateTime": "2024-01-20 14:20:00"
        }
      ],
      "total": 50
    }
  }
  ```

### 1.2 新增客户
- **接口路径**: `POST /api/customers`
- **接口描述**: 创建新客户
- **请求参数**:
  ```json
  {
    "customerName": "新客户名称",
    "status": true,
    "country": "中国",
    "province": "山东",
    "city": "青岛",
    "district": "黄岛",
    "contactPerson": "联系人",
    "contactPhone": "13800138000",
    "contactEmail": "contact@example.com",
    "remark": "备注信息"
  }
  ```
- **响应数据**:
  ```json
  {
    "code": 0,
    "message": "客户创建成功",
    "data": {
      "id": 123
    }
  }
  ```

### 1.3 客户详情查询
- **接口路径**: `GET /api/customers/{id}`
- **接口描述**: 根据ID查询客户详情

### 1.4 更新客户
- **接口路径**: `PUT /api/customers/{id}`
- **接口描述**: 更新客户信息

### 1.5 删除客户
- **接口路径**: `DELETE /api/customers/{id}`
- **接口描述**: 删除客户（软删除）

---

## 2. 设备管理模块

### 2.1 设备列表查询
- **接口路径**: `GET /api/devices`
- **接口描述**: 分页查询设备列表，支持多条件筛选
- **请求参数**:
  ```json
  {
    "pageSize": 10,
    "current": 1,
    "deviceNumber": "DEV-2024-001",    // 设备编号（可选）
    "status": "INSTALLED",             // 设备状态（可选）
    "projectManager": "黄桂菊"          // 项目经理（可选）
  }
  ```
- **响应数据**:
  ```json
  {
    "code": 0,
    "message": "success",
    "data": {
      "list": [
        {
          "id": 1,
          "deviceNumber": "DEV-2024-001",
          "status": "INSTALLED",
          "projectManager": "黄桂菊",
          "categoryId": 1,
          "categoryName": "PS2A 乘用子午胎一次法成型机",
          "customerId": 1,
          "customerName": "黄岛赛轮",
          "remark": "设备备注",
          "createTime": "2024-01-15 10:30:00",
          "updateTime": "2024-01-20 14:20:00"
        }
      ],
      "total": 30
    }
  }
  ```

### 2.2 新增设备
- **接口路径**: `POST /api/devices`
- **接口描述**: 创建新设备
- **请求参数**:
  ```json
  {
    "deviceNumber": "DEV-2024-009",
    "categoryId": 1,
    "customerId": 1,
    "projectManager": "黄桂菊",
    "partSets": [
      {
        "name": "主控制器",
        "code": "CTRL-001",
        "status": true
      },
      {
        "name": "传感器模块",
        "code": "SENSOR-001",
        "status": true
      }
    ],
    "remark": "设备备注"
  }
  ```

### 2.3 设备分类列表查询
- **接口路径**: `GET /api/device-categories`
- **接口描述**: 分页查询设备分类列表
- **请求参数**:
  ```json
  {
    "pageSize": 10,
    "current": 1
  }
  ```
- **响应数据**:
  ```json
  {
    "code": 0,
    "message": "success",
    "data": {
      "list": [
        {
          "id": 1,
          "categoryName": "PS2A 乘用子午胎一次法成型机",
          "status": true,
          "description": "PS2A乘用子午胎一次法成型机是具有高产出、高轮胎质量、换型速度快、生产规格范围大等优点的高自动化半钢成型机",
          "type": 1,
          "deviceCount": 25,
          "createTime": "2024-01-15 10:30:00"
        }
      ],
      "total": 10
    }
  }
  ```

### 2.4 新增设备分类
- **接口路径**: `POST /api/device-categories`
- **接口描述**: 创建新设备分类
- **请求参数**:
  ```json
  {
    "categoryName": "新设备分类",
    "status": true,
    "description": "分类描述",
    "type": 1
  }
  ```

---

## 3. 工单管理模块

### 3.1 I/O点检工单列表查询
- **接口路径**: `GET /api/workorders/io-inspection`
- **接口描述**: 分页查询I/O点检工单列表
- **请求参数**:
  ```json
  {
    "pageSize": 10,
    "current": 1,
    "deviceName": "DEV-2024-001",      // 设备名称（可选）
    "workOrderStatus": "IN_PROGRESS",   // 工单状态（可选）
    "customerName": "黄岛赛轮"          // 客户名称（可选）
  }
  ```
- **响应数据**:
  ```json
  {
    "code": 0,
    "message": "success",
    "data": {
      "list": [
        {
          "id": 1,
          "workOrderNo": "IO-2024-001",
          "deviceId": 1,
          "deviceNumber": "DEV-2024-001",
          "customerId": 1,
          "customerName": "黄岛赛轮",
          "status": "IN_PROGRESS",
          "progress": 60,
          "filePaths": "[\"file1.xlsx\", \"file2.pdf\"]",
          "remark": "工单备注",
          "createTime": "2024-01-15 10:30:00",
          "updateTime": "2024-01-20 14:20:00"
        }
      ],
      "total": 20
    }
  }
  ```

### 3.2 新增I/O点检工单
- **接口路径**: `POST /api/workorders/io-inspection`
- **接口描述**: 创建新的I/O点检工单
- **请求参数**:
  ```json
  {
    "deviceId": 1,
    "filePaths": "[\"file1.xlsx\", \"file2.pdf\"]",
    "remark": "工单备注"
  }
  ```

---

## 4. 实体结构定义

### 4.1 客户实体 (Customer)

```java
@Entity
@Table(name = "customers")
public class Customer extends BaseEntity {
    
    @Column(name = "customer_name", nullable = false, length = 100)
    @NotBlank(message = "客户名称不能为空")
    private String customerName;
    
    @Column(name = "status", nullable = false)
    private Boolean status;  // true=启用，false=禁用
    
    @Column(name = "country", length = 50)
    private String country;
    
    @Column(name = "province", length = 50)
    private String province;
    
    @Column(name = "city", length = 50)
    private String city;
    
    @Column(name = "district", length = 50)
    private String district;
    
    @Column(name = "contact_person", length = 50)
    private String contactPerson;
    
    @Column(name = "contact_phone", length = 20)
    @NotBlank(message = "联系电话不能为空")
    private String contactPhone;
    
    @Column(name = "contact_email", length = 100)
    @Email(message = "邮箱格式不正确")
    private String contactEmail;
    
    @Column(name = "remark", columnDefinition = "TEXT")
    private String remark;
    
    // getter and setter...
}
```

### 4.2 设备分类实体 (DeviceCategory)

```java
@Entity
@Table(name = "device_categories")
public class DeviceCategory extends BaseEntity {
    
    @Column(name = "category_name", nullable = false, length = 100)
    @NotBlank(message = "分类名称不能为空")
    private String categoryName;
    
    @Column(name = "status", nullable = false)
    private Boolean status;
    
    @Column(name = "description", columnDefinition = "TEXT")
    private String description;
    
    @Column(name = "type")
    private Integer type;  // 分类类型
    
    // 关联的设备数量（非持久化字段）
    @Transient
    private Integer deviceCount;
    
    // getter and setter...
}
```

### 4.3 设备实体 (Device)

```java
@Entity
@Table(name = "devices")
public class Device extends BaseEntity {
    
    @Column(name = "device_number", nullable = false, unique = true, length = 50)
    @NotBlank(message = "设备编号不能为空")
    private String deviceNumber;
    
    @Enumerated(EnumType.STRING)
    @Column(name = "status", nullable = false)
    private DeviceStatus status = DeviceStatus.NOT_INSTALLED;
    
    @Column(name = "project_manager", length = 50)
    private String projectManager;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "category_id")
    private DeviceCategory category;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "customer_id")
    private Customer customer;
    
    @Column(name = "remark", columnDefinition = "TEXT")
    private String remark;
    
    @OneToMany(mappedBy = "device", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private List<PartSet> partSets = new ArrayList<>();
    
    // getter and setter...
}
```

### 4.4 部套实体 (PartSet)

```java
@Entity
@Table(name = "part_sets")
public class PartSet extends BaseEntity {
    
    @Column(name = "name", nullable = false, length = 100)
    @NotBlank(message = "部套名称不能为空")
    private String name;
    
    @Column(name = "code", nullable = false, length = 50)
    @NotBlank(message = "部套编号不能为空")
    private String code;
    
    @Column(name = "status", nullable = false)
    private Boolean status = true;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "device_id")
    private Device device;
    
    // getter and setter...
}
```

### 4.5 I/O点检工单实体 (IOInspectionWorkOrder)

```java
@Entity
@Table(name = "io_inspection_work_orders")
public class IOInspectionWorkOrder extends BaseEntity {
    
    @Column(name = "work_order_no", nullable = false, unique = true, length = 50)
    private String workOrderNo;  // 工单编号
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "device_id")
    private Device device;
    
    @Enumerated(EnumType.STRING)
    @Column(name = "status", nullable = false)
    private WorkOrderStatus status = WorkOrderStatus.PENDING;
    
    @Column(name = "progress")
    @Min(value = 0, message = "进度不能小于0")
    @Max(value = 100, message = "进度不能大于100")
    private Integer progress = 0;  // 完成进度 0-100
    
    @Column(name = "file_paths", columnDefinition = "TEXT")
    private String filePaths;  // 文件路径，JSON格式存储
    
    @Column(name = "remark", columnDefinition = "TEXT")
    private String remark;
    
    // getter and setter...
}
```

### 4.6 基础实体 (BaseEntity)

```java
@MappedSuperclass
@EntityListeners(AuditingEntityListener.class)
public abstract class BaseEntity {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @CreatedDate
    @Column(name = "create_time", nullable = false, updatable = false)
    private LocalDateTime createTime;
    
    @LastModifiedDate
    @Column(name = "update_time")
    private LocalDateTime updateTime;
    
    @Column(name = "deleted", nullable = false)
    private Boolean deleted = false;
    
    // getter and setter...
}
```

---

## 5. 枚举定义

### 5.1 设备状态枚举

```java
public enum DeviceStatus {
    NOT_INSTALLED("not_installed", "未安装"),
    INSTALLING("installing", "安装中"),
    INSTALLED("installed", "已安装"),
    DEBUGGING("debugging", "调试中"),
    TESTED("tested", "已联检"),
    SHIPPED("shipped", "已发货");
    
    private final String code;
    private final String description;
    
    DeviceStatus(String code, String description) {
        this.code = code;
        this.description = description;
    }
    
    public String getCode() {
        return code;
    }
    
    public String getDescription() {
        return description;
    }
}
```

### 5.2 工单状态枚举

```java
public enum WorkOrderStatus {
    PENDING("pending", "待处理"),
    IN_PROGRESS("in_progress", "进行中"),
    COMPLETED("completed", "已完成"),
    CANCELLED("cancelled", "已取消");
    
    private final String code;
    private final String description;
    
    WorkOrderStatus(String code, String description) {
        this.code = code;
        this.description = description;
    }
    
    public String getCode() {
        return code;
    }
    
    public String getDescription() {
        return description;
    }
}
```

---

## 6. 统一响应格式

### 6.1 统一返回结果类

```java
public class Result<T> {
    private Integer code;
    private String message;
    private T data;
    
    // 成功响应
    public static <T> Result<T> success(T data) {
        Result<T> result = new Result<>();
        result.setCode(0);
        result.setMessage("success");
        result.setData(data);
        return result;
    }
    
    public static <T> Result<T> success(String message, T data) {
        Result<T> result = new Result<>();
        result.setCode(0);
        result.setMessage(message);
        result.setData(data);
        return result;
    }
    
    // 失败响应
    public static <T> Result<T> error(String message) {
        Result<T> result = new Result<>();
        result.setCode(1);
        result.setMessage(message);
        return result;
    }
    
    public static <T> Result<T> error(Integer code, String message) {
        Result<T> result = new Result<>();
        result.setCode(code);
        result.setMessage(message);
        return result;
    }
    
    // getter and setter...
}
```

### 6.2 分页结果类

```java
public class PageResult<T> {
    private List<T> list;
    private Long total;
    
    public PageResult(List<T> list, Long total) {
        this.list = list;
        this.total = total;
    }
    
    // getter and setter...
}
```

---

## 📝 开发规范

### 1. 接口规范
- 所有接口都使用 `Result<T>` 统一响应格式
- 分页接口统一使用 `pageSize` 和 `current` 参数
- 查询接口支持条件筛选，筛选参数为可选
- 所有时间字段使用 `yyyy-MM-dd HH:mm:ss` 格式

### 2. 数据库规范
- 所有表都包含 `id`、`create_time`、`update_time`、`deleted` 字段
- 使用软删除，不物理删除数据
- 字段命名使用下划线分隔
- 外键字段以 `_id` 结尾

### 3. 代码规范
- 实体类继承 `BaseEntity`
- 使用 `@Valid` 进行参数校验
- 枚举类型使用 `@Enumerated(EnumType.STRING)` 存储
- 关联关系使用懒加载 `FetchType.LAZY`

### 4. 错误码定义
- `0`: 成功
- `1`: 通用错误
- `1001-1999`: 客户管理模块错误
- `2001-2999`: 设备管理模块错误
- `3001-3999`: 工单管理模块错误

---

**文档版本**: v1.0  
**最后更新**: 2024-01-30  
**维护人员**: 开发团队