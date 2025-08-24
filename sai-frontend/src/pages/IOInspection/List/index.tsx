import React, { useState, memo, useEffect } from 'react';
import { Table, Dialog, Button, Tag, Progress } from 'tdesign-react';
import { WorkOrderStatus, getIOInspectionList, IIOInspection } from 'services/ioInspection';
import SearchForm, { FormValueType } from './components/SearchForm';
import './index.module.less';
import classnames from 'classnames';
import CommonStyle from '../../../styles/common.module.less';

// 工单状态映射
const StatusMap = {
  [WorkOrderStatus.PENDING]: { label: '待处理', theme: 'default' },
  [WorkOrderStatus.IN_PROGRESS]: { label: '进行中', theme: 'primary' },
  [WorkOrderStatus.COMPLETED]: { label: '已完成', theme: 'success' },
  [WorkOrderStatus.CANCELLED]: { label: '已取消', theme: 'danger' },
};

export const IOInspectionListTable = () => {
  const [loading, setLoading] = useState(false);
  const [dataSource, setDataSource] = useState<IIOInspection[]>([]);
  const [selectedRowKeys, setSelectedRowKeys] = useState<(string | number)[]>([]); // 改回 (string | number)[]
  const [visible, setVisible] = useState(false);
  const [searchParams, setSearchParams] = useState<FormValueType>({});
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 10,
    total: 0
  });

  const fetchData = async (params: any = {}) => {
    setLoading(true);
    try {
      const result = await getIOInspectionList({
        current: pagination.current,
        pageSize: pagination.pageSize,
        ...params
      });
      setDataSource(result.list);
      setPagination(prev => ({ ...prev, total: result.total }));
    } catch (error) {
      console.error('获取IO点检列表失败:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
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
    setPagination(prev => ({ ...prev, current: 1 }));
    await fetchData(values);
  };

  const handleReset = async () => {
    setSearchParams({});
    setPagination(prev => ({ ...prev, current: 1 }));
    await fetchData();
  };

  const handlePageChange = (pageInfo: any) => {
    setPagination(prev => ({ ...prev, ...pageInfo }));
    fetchData({ ...searchParams, ...pageInfo });
  };

  const columns = [
    {
      title: '序号',
      colKey: 'index',
      width: 80,
      cell: ({ rowIndex }: any) => rowIndex + 1 + (pagination.current - 1) * pagination.pageSize,
    },
    {
      title: '设备名称',
      colKey: 'deviceName',
      width: 130, // 从150px减少到130px
    },
    {
      title: '工单状态',
      colKey: 'workOrderStatus',
      width: 120,
      cell: ({ row }: any) => {
        const status = StatusMap[row.workOrderStatus as WorkOrderStatus];
        return <Tag theme={status.theme as any}>{status.label}</Tag>;
      },
    },
    {
      title: '完成进度',
      colKey: 'progress',
      width: 150,
      cell: ({ row }: any) => (
        <div style={{ paddingRight: '16px' }}>
          <Progress percentage={row.progress} size='small' />
        </div>
      ),
    },
    {
      title: '客户名称',
      colKey: 'customerName',
      width: 180, // 从150px增加到180px
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
      width: 180,
      align: 'center' as const, // 添加居中对齐
      fixed: 'right' as const,
      cell: ({ row }: any) => (
        <div style={{ display: 'flex', gap: '8px', justifyContent: 'center' }}>
          <Button 
            theme='primary' 
            variant='text' 
            onClick={() => {
              console.log('查看详情:', row);
            }}
          >
            详情
          </Button>
          <Button 
            theme='primary' 
            variant='text' 
            onClick={() => {
              console.log('管理IO点检:', row);
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
      <SearchForm onSubmit={handleSearch} onCancel={handleReset} />
      <Table
        loading={loading}
        data={dataSource}
        columns={columns}
        rowKey='id'
        selectedRowKeys={selectedRowKeys}
        selectOnRowClick
        onSelectChange={onSelectChange}
        pagination={{
          current: pagination.current,
          pageSize: pagination.pageSize,
          total: pagination.total,
          showJumper: true,
          onChange: handlePageChange,
        }}
        size='small'
      />
      <Dialog
        header='确认删除'
        visible={visible}
        onCancel={handleClose}
        onConfirm={handleClose}
      >
        <p>确认删除所选项目吗？</p>
      </Dialog>
    </>
  );
};

const IOInspectionListPage: React.FC = () => (
  <div className={classnames(CommonStyle.pageWithPadding, CommonStyle.pageWithColor)}>
    <IOInspectionListTable />
  </div>
);

export default memo(IOInspectionListPage);