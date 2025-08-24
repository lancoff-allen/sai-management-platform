import request from 'utils/request';

// 客户接口
export interface ICustomer {
  id: string;  // 改为 string 类型
  name: string;
  country: string;
  address: string;
  createTime: string;
}

// 客户列表查询参数
export interface ICustomerListParams {
  pageSize: number;
  current: number;
  name?: string;
  country?: string;    // 新增：国家搜索参数
}

// 获取客户列表
export const getCustomerList = async (params: ICustomerListParams) => {
  // 模拟数据
  const mockData: ICustomer[] = [
    {
      id: '1',
      name: '黄岛赛轮',
      country: '中国',
      address: '山东，青岛，黄岛',
      createTime: '2024-01-15 10:30:00'
    },
    {
      id: '2',
      name: '印尼赛轮',
      country: '印度尼西亚',
      address: '',
      createTime: '2024-01-10 14:20:00'
    },
    {
      id: '3',
      name: '越南赛轮',
      country: '越南',
      address: '胡志明市',
      createTime: '2024-01-08 09:15:00'
    },
    {
      id: '4',
      name: '泰国赛轮',
      country: '泰国',
      address: '曼谷',
      createTime: '2024-01-05 16:45:00'
    },
    {
      id: '5',
      name: '马来西亚赛轮',
      country: '马来西亚',
      address: '吉隆坡',
      createTime: '2024-01-03 11:30:00'
    },
    {
      id: '6',
      name: '新加坡赛轮',
      country: '新加坡',
      address: '',
      createTime: '2024-01-01 08:00:00'
    },
    {
      id: '7',
      name: '上海赛轮',
      country: '中国',
      address: '上海，浦东新区',
      createTime: '2023-12-28 14:20:00'
    },
    {
      id: '8',
      name: '北京赛轮',
      country: '中国',
      address: '北京，朝阳区',
      createTime: '2023-12-25 09:15:00'
    }
  ];

  // 模拟接口分页和搜索
  let list = [...mockData];
  
  // 根据客户名称搜索
  if (params.name) {
    list = list.filter(item => item.name.includes(params.name!));
  }
  
  // 根据国家搜索
  if (params.country) {
    list = list.filter(item => item.country.includes(params.country!));
  }
  
  const total = list.length;
  list = list.slice(params.pageSize * (params.current - 1), params.pageSize * params.current);
  
  return {
    list,
    total,
  };
};