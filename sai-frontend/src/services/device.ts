import request from 'utils/request';

export interface IDeviceCategory {
  id: number;
  name: string;
  description: string;
  type: number;
  isActive: boolean;
  deviceCount: number;
  createTime: string;
}

interface IResult {
  list: IDeviceCategory[];
}

interface IParams {
  pageSize: number;
  current: number;
}

export const getDeviceCategoryList = async (params: IParams) => {
  // 模拟数据
  const mockData: IDeviceCategory[] = [
    {
      id: 1,
      name: 'PS2A 乘用子午胎一次法成型机',
      description: 'PS2A乘用子午胎一次法成型机是具有高产出、高轮胎质量、换型速度快、生产规格范围大等优点的高自动化半钢成型机',
      type: 1,
      isActive: true,
      deviceCount: 25,
      createTime: '2024-01-15 10:30:00'
    },
    {
      id: 2,
      name: 'TPRO-S全钢子午胎一次法三鼓成型机',
      description: '输送准、贴合精、接头好、传递准、滚压实',
      type: 2,
      isActive: true,
      deviceCount: 18,
      createTime: '2024-01-10 14:20:00'
    },
    {
      id: 3,
      name: 'NTS3 全钢子午胎一次法三鼓成型机',
      description: '胶囊寿命提高3倍以上，远程运维，提效增产',
      type: 3,
      isActive: false,
      deviceCount: 12,
      createTime: '2024-01-08 09:15:00'
    },
    {
      id: 4,
      name: 'FAR20-S 全自动小料配料称量系统',
      description: '软控研发的智能全自动小料配料称量系统，其性能均满足国际国内高端客户要求，具有高产能、高精度、支持快速交付等特点',
      type: 4,
      isActive: true,
      deviceCount: 30,
      createTime: '2024-01-05 16:45:00'
    },
    {
      id: 5,
      name: '15°-70°钢丝帘布裁断机',
      description: '15°-70°钢丝帘布裁断机，提供带束层制品完善的解决方案，最高的效率、制品质量及精度，满足客户个性化定制及需求',
      type: 5,
      isActive: true,
      deviceCount: 8,
      createTime: '2024-01-03 11:30:00'
    },
    {
      id: 6,
      name: '内衬层挤出压延生产线',
      description: '软控自主研发的内衬层生产线已形成系列化，涵盖全钢、半钢、工程胎、摩托车胎四大系列',
      type: 6,
      isActive: true,
      deviceCount: 15,
      createTime: '2024-01-01 08:00:00'
    }
  ];

  // 模拟接口分页
  let list = [...mockData];
  const total = list.length;
  list = list.slice(params.pageSize * (params.current - 1), params.pageSize * params.current);
  
  return {
    list,
    total,
  };
};

// 设备状态枚举
export enum DeviceStatus {
  NOT_INSTALLED = 'not_installed',
  INSTALLING = 'installing', 
  INSTALLED = 'installed',
  DEBUGGING = 'debugging',
  TESTED = 'tested',
  SHIPPED = 'shipped'
}

// 设备状态选项
export const DEVICE_STATUS_OPTIONS = [
  { label: '未安装', value: DeviceStatus.NOT_INSTALLED },
  { label: '安装中', value: DeviceStatus.INSTALLING },
  { label: '已安装', value: DeviceStatus.INSTALLED },
  { label: '调试中', value: DeviceStatus.DEBUGGING },
  { label: '已联检', value: DeviceStatus.TESTED },
  { label: '已发货', value: DeviceStatus.SHIPPED },
];

// 设备接口
export interface IDevice {
  id: number;
  deviceNumber: string;
  status: DeviceStatus;
  projectManager: string;
  categoryId: number;
  categoryName: string;
  createTime: string;
  updateTime: string;
}

// 设备列表查询参数
export interface IDeviceListParams {
  pageSize: number;
  current: number;
  deviceNumber?: string;
  status?: DeviceStatus;
  projectManager?: string;
}

// 获取设备列表
export const getDeviceList = async (params: IDeviceListParams) => {
  // 模拟数据
  const mockData: IDevice[] = [
    {
      id: 1,
      deviceNumber: 'DEV-2024-001',
      status: DeviceStatus.INSTALLED,
      projectManager: '黄桂菊',
      categoryId: 1,
      categoryName: 'PS2A 乘用子午胎一次法成型机',
      createTime: '2024-01-15 10:30:00',
      updateTime: '2024-01-20 14:20:00'
    },
    {
      id: 2,
      deviceNumber: 'DEV-2024-002',
      status: DeviceStatus.DEBUGGING,
      projectManager: '魏小凯',
      categoryId: 2,
      categoryName: 'TPRO-S全钢子午胎一次法三鼓成型机',
      createTime: '2024-01-10 14:20:00',
      updateTime: '2024-01-18 09:15:00'
    },
    {
      id: 3,
      deviceNumber: 'DEV-2024-003',
      status: DeviceStatus.TESTED,
      projectManager: '王五',
      categoryId: 3,
      categoryName: 'NTS3 全钢子午胎一次法三鼓成型机',
      createTime: '2024-01-08 09:15:00',
      updateTime: '2024-01-22 16:30:00'
    },
    {
      id: 4,
      deviceNumber: 'DEV-2024-004',
      status: DeviceStatus.INSTALLING,
      projectManager: '赵六',
      categoryId: 4,
      categoryName: 'FAR20-S 全自动小料配料称量系统',
      createTime: '2024-01-05 16:45:00',
      updateTime: '2024-01-15 11:20:00'
    },
    {
      id: 5,
      deviceNumber: 'DEV-2024-005',
      status: DeviceStatus.SHIPPED,
      projectManager: '孙七',
      categoryId: 5,
      categoryName: '15°-70°钢丝帘布裁断机',
      createTime: '2024-01-03 11:30:00',
      updateTime: '2024-01-25 08:45:00'
    },
    {
      id: 6,
      deviceNumber: 'DEV-2024-006',
      status: DeviceStatus.NOT_INSTALLED,
      projectManager: '周八',
      categoryId: 6,
      categoryName: '内衬层挤出压延生产线',
      createTime: '2024-01-01 08:00:00',
      updateTime: '2024-01-12 13:15:00'
    },
    {
      id: 7,
      deviceNumber: 'DEV-2024-007',
      status: DeviceStatus.INSTALLED,
      projectManager: '吴九',
      categoryId: 1,
      categoryName: 'PS2A 乘用子午胎一次法成型机',
      createTime: '2024-01-20 15:30:00',
      updateTime: '2024-01-28 10:20:00'
    },
    {
      id: 8,
      deviceNumber: 'DEV-2024-008',
      status: DeviceStatus.DEBUGGING,
      projectManager: '郑十',
      categoryId: 2,
      categoryName: 'TPRO-S全钢子午胎一次法三鼓成型机',
      createTime: '2024-01-18 12:45:00',
      updateTime: '2024-01-30 14:30:00'
    }
  ];

  // 模拟筛选
  let filteredData = [...mockData];
  
  if (params.deviceNumber) {
    filteredData = filteredData.filter(item => 
      item.deviceNumber.toLowerCase().includes(params.deviceNumber!.toLowerCase())
    );
  }
  
  if (params.status) {
    filteredData = filteredData.filter(item => item.status === params.status);
  }
  
  if (params.projectManager) {
    filteredData = filteredData.filter(item => 
      item.projectManager.includes(params.projectManager!)
    );
  }

  // 模拟分页
  const total = filteredData.length;
  const list = filteredData.slice(
    params.pageSize * (params.current - 1), 
    params.pageSize * params.current
  );
  
  return {
    list,
    total,
  };
};