import React, { useState, memo, useEffect } from 'react';
import { Table, Button, Dialog } from 'tdesign-react';
import classnames from 'classnames';
import { useAppDispatch, useAppSelector } from 'modules/store';
import { selectCustomerList, getList, clearPageState } from 'modules/customer/list';
import CommonStyle from 'styles/common.module.less';
import SearchForm, { FormValueType } from './components/SearchForm';
import style from './index.module.less';

export const CustomerListTable = () => {
  const dispatch = useAppDispatch();
  const pageState = useAppSelector(selectCustomerList);
  const [selectedRowKeys, setSelectedRowKeys] = useState<(string | number)[]>([]);
  const [visible, setVisible] = useState(false);
  const [searchParams, setSearchParams] = useState<FormValueType>({});
  const { loading, customerList, current, pageSize, total } = pageState;

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

  function onSelectChange(value: (string | number)[]) {
    setSelectedRowKeys(value);
  }

  const handleClickDelete = () => {
    setVisible(true);
  };

  const handleClose = () => {
    setVisible(false);
  };

  const handleSearch = (values: FormValueType) => {
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
      title: '客户名称',
      colKey: 'name',
      width: 200,
      ellipsis: true,
    },
    {
      title: '国家',
      colKey: 'country',
      width: 120,
      ellipsis: true,
    },
    {
      title: '地址',
      colKey: 'address',
      ellipsis: true,
      cell: ({ row }: any) => {
        return row.address || '-';
      },
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
      align: 'center' as const, // 添加居中对齐
      fixed: 'right' as const,
      cell: ({ row }: any) => (
        <div style={{ display: 'flex', gap: '8px', justifyContent: 'center' }}>
          <Button 
            theme='primary' 
            variant='text' 
            onClick={() => {
              // 处理管理操作
              console.log('管理客户:', row);
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
        className={style.customerTable}
        loading={loading}
        data={customerList}
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
      <Dialog header='确认删除当前所选客户？' visible={visible} onClose={handleClose}>
        <p>删除后的所有客户信息将被清空,且无法恢复</p>
      </Dialog>
    </>
  );
};

const CustomerListPage: React.FC = () => (
  <div className={classnames(CommonStyle.pageWithPadding, CommonStyle.pageWithColor)}>
    <CustomerListTable />
  </div>
);

export default memo(CustomerListPage);