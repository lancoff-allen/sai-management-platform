import React, { useState, memo, useEffect } from 'react';
import { Table, Dialog, Button, Tag, Dropdown } from 'tdesign-react';
import { useAppDispatch, useAppSelector } from 'modules/store';
import { selectDeviceList, getList, clearPageState } from 'modules/device/list';
import { DeviceStatus, DEVICE_STATUS_OPTIONS } from 'services/device';
import SearchForm, { FormValueType } from './components/SearchForm';
import './index.module.less';
import classnames from 'classnames';
import CommonStyle from '../../../styles/common.module.less';

// 状态映射
const StatusMap = {
  [DeviceStatus.NOT_INSTALLED]: { label: '未安装', theme: 'default' },
  [DeviceStatus.INSTALLING]: { label: '安装中', theme: 'primary' }, 
  [DeviceStatus.INSTALLED]: { label: '已安装', theme: 'primary' },
  [DeviceStatus.DEBUGGING]: { label: '调试中', theme: 'primary' },
  [DeviceStatus.TESTED]: { label: '已联检', theme: 'success' },
  [DeviceStatus.SHIPPED]: { label: '已发货', theme: 'success' },
};

export const DeviceListTable = () => {
  const dispatch = useAppDispatch();
  const pageState = useAppSelector(selectDeviceList);
  const [selectedRowKeys, setSelectedRowKeys] = useState<(string | number)[]>([]); // 改回 (string | number)[]
  const [visible, setVisible] = useState(false);
  const [searchParams, setSearchParams] = useState<FormValueType>({});
  const { loading, deviceList, current, pageSize, total } = pageState;

  useEffect(() => {
    dispatch(
      getList({
        pageSize: pageState.pageSize,
        current: pageState.current,
      }),
    );
    return () => {
      dispatch(clearPageState());
    };
  }, []);

  const onSelectChange = (value: (string | number)[]) => { // 改回 (string | number)[]
    setSelectedRowKeys(value);
  };

  const handleClickDelete = () => {
    setVisible(true);
  };

  const handleClose = () => {
    setVisible(false);
  };

  const handleSearch = async (values: FormValueType) => {
    setSearchParams(values);
    dispatch(
      getList({
        pageSize,
        current: 1,
        ...values,
      }),
    );
  };

  const handleReset = () => {
    setSearchParams({});
    dispatch(
      getList({
        pageSize,
        current: 1,
      }),
    );
  };

  const columns = [
    {
      title: '序号',
      colKey: 'index',
      width: 80,
      cell: ({ rowIndex }: any) => rowIndex + 1 + (current - 1) * pageSize,
    },
    {
      title: '设备编号',
      colKey: 'deviceNumber',
      width: 150, // 从180px减少到150px
    },
    {
      title: '设备状态',
      colKey: 'status',
      width: 100,
      cell: ({ row }: any) => {
        const status = StatusMap[row.status as DeviceStatus];
        return <Tag theme={status.theme as any}>{status.label}</Tag>;
      },
    },
    {
      title: '项目经理',
      colKey: 'projectManager',
      width: 120,
    },
    {
      title: '设备分类',
      colKey: 'categoryName',
      width: 150, // 从120px增加到150px
      ellipsis: true,
    },
    {
      title: '创建时间',
      colKey: 'createTime',
      width: 180,
    },
    {
      title: '操作',
      colKey: 'operation',
      width: 140,
      align: 'center' as const, // 添加 as const 类型断言
      fixed: 'right' as const,
      cell: ({ row }: any) => (
        <div style={{ display: 'flex', gap: '8px', justifyContent: 'center' }}>
          <Button 
            theme='primary' 
            variant='text' 
            onClick={() => {
              // 处理管理操作
              console.log('管理设备:', row);
            }}
          >
            管理
          </Button>
          <Button 
            theme='danger' 
            variant='text' 
            onClick={() => {
              handleClickDelete();
            }}
          >
            删除
          </Button>
        </div>
      ),
    },
  ];

  return (
    <>
      <SearchForm 
        onSubmit={handleSearch} 
        onCancel={handleReset}
      />
      
      <Table
        loading={loading}
        data={deviceList}
        columns={columns}
        rowKey='id'
        selectedRowKeys={selectedRowKeys}
        hover
        onSelectChange={onSelectChange}
        pagination={{
          pageSize,
          total,
          current,
          showJumper: true,
          onCurrentChange(current, pageInfo) {
            dispatch(
              getList({
                pageSize: pageInfo.pageSize,
                current: pageInfo.current,
                ...searchParams,
              }),
            );
          },
          onPageSizeChange(size) {
            dispatch(
              getList({
                pageSize: size,
                current: 1,
                ...searchParams,
              }),
            );
          },
        }}
      />
      <Dialog header='确认删除当前所选设备？' visible={visible} onClose={handleClose}>
        <p>删除后的所有设备信息将被清空,且无法恢复</p>
      </Dialog>
    </>
  );
};

const DeviceListPage: React.FC = () => (
  <div className={classnames(CommonStyle.pageWithPadding, CommonStyle.pageWithColor)}>
    <DeviceListTable />
  </div>
);

export default memo(DeviceListPage);