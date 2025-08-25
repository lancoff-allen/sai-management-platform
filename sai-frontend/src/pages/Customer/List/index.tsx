import React, { useState, memo, useEffect } from 'react';
import { Table, Button, Dialog, MessagePlugin } from 'tdesign-react';
import classnames from 'classnames';
import { useAppDispatch, useAppSelector } from 'modules/store';
import { selectCustomerList, getList, clearPageState } from 'modules/customer/list';
import CommonStyle from 'styles/common.module.less';
import SearchForm, { FormValueType } from './components/SearchForm';
import style from './index.module.less';
import { deleteCustomer } from 'services/customer';

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

  const [deleteId, setDeleteId] = useState<string>(''); // 添加删除ID状态
  const [deleteLoading, setDeleteLoading] = useState(false); // 添加删除加载状态

  const handleClickDelete = (id?: string) => {
    if (id) {
      setDeleteId(id);
    }
    setVisible(true);
  };

  const handleClose = () => {
    setVisible(false);
    setDeleteId('');
  };

  // 确认删除
  const handleConfirmDelete = async () => {
    if (!deleteId) {
      MessagePlugin.error('请选择要删除的客户');
      return;
    }

    setDeleteLoading(true);
    try {
      await deleteCustomer(deleteId);
      MessagePlugin.success('客户删除成功');
      handleClose();
      // 重新加载列表
      dispatch(
        getList({
          pageSize,
          current,
          ...searchParams,
        }),
      );
    } catch (error: any) {
      console.error('删除客户失败:', error);
      if (error.response?.data?.message) {
        MessagePlugin.error(error.response.data.message);
      } else {
        MessagePlugin.error('删除失败，请稍后重试');
      }
    } finally {
      setDeleteLoading(false);
    }
  };

  // 添加搜索处理函数
  const handleSearch = (values: FormValueType) => {
    setSearchParams(values);
    dispatch(
      getList({
        pageSize,
        current: 1, // 搜索时重置到第一页
        ...values,
      }),
    );
  };

  // 添加重置处理函数
  const handleReset = () => {
    setSearchParams({});
    dispatch(
      getList({
        pageSize,
        current: 1,
      }),
    );
  };

  // 在文件顶部添加国家映射常量
  const COUNTRY_MAP: { [key: string]: string } = {
    china: '中国',
    usa: '美国',
    japan: '日本',
    germany: '德国',
    uk: '英国',
    france: '法国',
    korea: '韩国',
    italy: '意大利',
    canada: '加拿大',
    australia: '澳大利亚',
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
      colKey: 'customerName',  // 更新字段名
      width: 200,
      ellipsis: true,
    },
    {
      title: '状态',
      colKey: 'status',
      width: 100,
      cell: ({ row }: any) => {
        return (
          <span style={{ color: row.status ? '#00A870' : '#E34D59' }}>
            {row.status ? '启用' : '禁用'}
          </span>
        );
      },
    },
    {
      title: '国家',
      colKey: 'country',
      width: 120,
      ellipsis: true,
      cell: ({ row }: any) => {
        return COUNTRY_MAP[row.country] || row.country || '-';
      },
    },
    {
      title: '地址',
      colKey: 'address',
      width: 150,
      ellipsis: true,
      cell: ({ row }: any) => {
        // 组合省市区信息，优化显示长度
        const addressParts = [row.province, row.city, row.district].filter(Boolean);
        if (addressParts.length === 0) return '-';
        
        const fullAddress = addressParts.join('，');
        // 如果地址太长，只显示省市
        if (fullAddress.length > 12) {
          const shortAddress = [row.province, row.city].filter(Boolean).join('，');
          return shortAddress || fullAddress;
        }
        return fullAddress;
      },
    },
    {
      title: '联系人',
      colKey: 'contactPerson',
      width: 120,
      ellipsis: true,
      cell: ({ row }: any) => row.contactPerson || '-',
    },
    {
      title: '联系电话',
      colKey: 'contactPhone',
      width: 140,
      ellipsis: true,
    },
    {
      title: '创建时间',
      colKey: 'createTime',
      width: 120,
      cell: ({ row }: any) => {
        if (!row.createTime) return '-';
        // 格式化时间显示，只显示日期部分
        const date = new Date(row.createTime);
        return date.toLocaleDateString('zh-CN', {
          year: 'numeric',
          month: '2-digit',
          day: '2-digit'
        });
      },
    },
    {
      title: '操作',
      colKey: 'operation',
      width: 140,
      align: 'center' as const,
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
              handleClickDelete(row.id);
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
      <Dialog 
        header='确认删除客户？' 
        visible={visible} 
        onClose={handleClose}
        onConfirm={handleConfirmDelete}
        confirmLoading={deleteLoading}
      >
        <p>删除后的客户信息将被清空，且无法恢复，确定要删除吗？</p>
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