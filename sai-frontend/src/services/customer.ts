import request from 'utils/request';

// 客户接口 - 与后端Customer实体保持一致
export interface ICustomer {
  id: string;
  customerName: string;  // 后端字段名
  status: boolean;
  country: string;
  province: string;
  city: string;
  district: string;
  contactPerson: string;
  contactPhone: string;
  contactEmail: string;
  remark: string;
  createTime: string;
  updateTime: string;
}

// 客户列表查询参数
export interface ICustomerListParams {
  pageSize: number;
  current: number;
  name?: string;     // 对应后端的客户名称搜索
  country?: string;  // 国家搜索参数
}

// 新增客户参数
export interface ICustomerCreateParams {
  customerName: string;
  status: boolean;
  country: string;
  province: string;
  city: string;
  district: string;
  contactPerson: string;
  contactPhone: string;
  contactEmail: string;
  remark: string;
}

// 获取客户列表 - 调用真实API
export const getCustomerList = async (params: ICustomerListParams) => {
  const response = await request.get('/customers', {
    params: {
      pageSize: params.pageSize,
      current: params.current,
      name: params.name,
      country: params.country,
    },
  });
  
  return {
    list: response.data.list,
    total: response.data.total,
  };
};

// 新增客户
export const createCustomer = async (params: ICustomerCreateParams) => {
  const response = await request.post('/customers', params);
  return response.data;
};

// 删除客户
export const deleteCustomer = async (id: string) => {
  const response = await request.delete(`/customers/${id}`);
  return response.data;
};

// 获取客户详情
export const getCustomerDetail = async (id: string) => {
  const response = await request.get(`/customers/${id}`);
  return response.data;
};

// 更新客户
export const updateCustomer = async (id: string, params: ICustomerCreateParams) => {
  const response = await request.put(`/customers/${id}`, params);
  return response.data;
};