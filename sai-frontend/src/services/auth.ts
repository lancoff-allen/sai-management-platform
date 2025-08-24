import request from 'utils/request';

// 登录请求参数接口
export interface LoginRequest {
  username: string;
  password: string;
  tenantCode: string;
}

// 登录响应接口
export interface LoginResponse {
  token: string;
  userInfo?: {
    id: string;
    username: string;
    email?: string;
    roles?: string[];
  };
}

// 租户信息接口
export interface TenantInfo {
  code: string;        // 租户代码
  name: string;        // 租户名称
  description?: string; // 租户描述
}

// 登录 API
export const loginApi = async (params: LoginRequest): Promise<LoginResponse> => {
  const response = await request.post('/auth/login', params);
  return response.data;
};

// 登出 API
export const logoutApi = async (): Promise<void> => {
  await request.post('/auth/logout');
};

// 获取用户信息 API
export const getUserInfoApi = async (): Promise<any> => {
  const response = await request.get('/auth/userinfo');
  return response.data;
};

// 获取租户列表 API
export const getTenantsApi = async (): Promise<TenantInfo[]> => {
  const response = await request.get('/auth/tenants');
  return response.data;
};