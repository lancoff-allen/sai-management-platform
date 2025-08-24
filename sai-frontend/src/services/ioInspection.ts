import request from 'utils/request';

// 工单状态枚举
export enum WorkOrderStatus {
  PENDING = 'pending',
  IN_PROGRESS = 'in_progress',
  COMPLETED = 'completed',
  CANCELLED = 'cancelled'
}

// 工单状态选项
export const WORK_ORDER_STATUS_OPTIONS = [
  { label: '待处理', value: WorkOrderStatus.PENDING },
  { label: '进行中', value: WorkOrderStatus.IN_PROGRESS },
  { label: '已完成', value: WorkOrderStatus.COMPLETED },
  { label: '已取消', value: WorkOrderStatus.CANCELLED },
];

// IO点检数据接口
export interface IIOInspection {
  id: number;
  deviceName: string;
  workOrderStatus: WorkOrderStatus;
  progress: number;
  customerName: string;
  createTime: string;
  updateTime: string;
}

// 查询参数接口
export interface IIOInspectionListParams {
  pageSize: number;
  current: number;
  deviceName?: string;
  workOrderStatus?: WorkOrderStatus;
  customerName?: string;
}

// 查询结果接口
export interface IIOInspectionListResult {
  list: IIOInspection[];
  total: number;
}

// 获取IO点检列表
export const getIOInspectionList = async (params: IIOInspectionListParams): Promise<IIOInspectionListResult> => {
  // 模拟数据
  const mockData: IIOInspection[] = [
    {
      id: 1,
      deviceName: 'PS2A-001',
      workOrderStatus: WorkOrderStatus.IN_PROGRESS,
      progress: 75,
      customerName: '青岛双星轮胎',
      createTime: '2024-01-15 10:30:00',
      updateTime: '2024-01-15 14:20:00'
    },
    {
      id: 2,
      deviceName: 'TPRO-S-002',
      workOrderStatus: WorkOrderStatus.COMPLETED,
      progress: 100,
      customerName: '中策橡胶集团',
      createTime: '2024-01-14 09:15:00',
      updateTime: '2024-01-14 16:45:00'
    },
    {
      id: 3,
      deviceName: 'NTS3-003',
      workOrderStatus: WorkOrderStatus.PENDING,
      progress: 0,
      customerName: '玲珑轮胎',
      createTime: '2024-01-13 11:20:00',
      updateTime: '2024-01-13 11:20:00'
    },
    {
      id: 4,
      deviceName: 'PS2A-004',
      workOrderStatus: WorkOrderStatus.CANCELLED,
      progress: 30,
      customerName: '赛轮集团',
      createTime: '2024-01-12 08:30:00',
      updateTime: '2024-01-12 15:10:00'
    },
    {
      id: 5,
      deviceName: 'TPRO-S-005',
      workOrderStatus: WorkOrderStatus.IN_PROGRESS,
      progress: 45,
      customerName: '万力轮胎',
      createTime: '2024-01-11 13:45:00',
      updateTime: '2024-01-11 17:30:00'
    }
  ];

  // 模拟筛选
  let filteredData = mockData;
  
  if (params.deviceName) {
    filteredData = filteredData.filter(item => 
      item.deviceName.toLowerCase().includes(params.deviceName!.toLowerCase())
    );
  }
  
  if (params.workOrderStatus) {
    filteredData = filteredData.filter(item => item.workOrderStatus === params.workOrderStatus);
  }
  
  if (params.customerName) {
    filteredData = filteredData.filter(item => 
      item.customerName.toLowerCase().includes(params.customerName!.toLowerCase())
    );
  }

  // 模拟分页
  const start = (params.current - 1) * params.pageSize;
  const end = start + params.pageSize;
  const paginatedData = filteredData.slice(start, end);

  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        list: paginatedData,
        total: filteredData.length
      });
    }, 500);
  });
};