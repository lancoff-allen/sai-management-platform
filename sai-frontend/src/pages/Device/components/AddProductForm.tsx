import React, { memo, useRef, useState } from 'react';
import {
  Dialog,
  Form,
  Input,
  Button,
  Table,
  Tag,
  Textarea,
  MessagePlugin,
  Space,
} from 'tdesign-react';
import { AddIcon, DeleteIcon } from 'tdesign-icons-react';
import { FormInstanceFunctions, SubmitContext } from 'tdesign-react/es/form/type';

const { FormItem } = Form;

// 部套数据类型定义
interface IPartSet {
  id: string;
  name: string;
  code: string;
  status: 'enabled' | 'disabled';
}

// 表单数据类型定义
interface IProductForm {
  deviceName: string;
  partSets: IPartSet[];
  remark: string;
}

interface AddProductFormProps {
  visible: boolean;
  onClose: () => void;
  onSubmit: (data: IProductForm) => Promise<void>;
}

const AddProductForm: React.FC<AddProductFormProps> = ({ visible, onClose, onSubmit }) => {
  const formRef = useRef<FormInstanceFunctions>();
  const [partSets, setPartSets] = useState<IPartSet[]>([]);
  const [loading, setLoading] = useState(false);

  // 部套列表的列定义
  const partSetColumns = [
    {
      title: '序号',
      colKey: 'index',
      width: 80,
      cell: ({ rowIndex }: any) => rowIndex + 1,
    },
    {
      title: '部套名称',
      colKey: 'name',
      width: 150,
    },
    {
      title: '部套编号',
      colKey: 'code',
      width: 150,
    },
    {
      title: '状态',
      colKey: 'status',
      width: 100,
      cell: ({ row }: any) => (
        <Tag theme={row.status === 'enabled' ? 'success' : 'default'}>
          {row.status === 'enabled' ? '启用' : '禁用'}
        </Tag>
      ),
    },
    {
      title: '操作',
      colKey: 'operation',
      width: 100,
      align: 'center' as const,
      cell: ({ row }: any) => (
        <Button
          theme="danger"
          variant="text"
          size="small"
          onClick={() => handleDeletePartSet(row.id)}
        >
          <DeleteIcon />
          删除
        </Button>
      ),
    },
  ];

  // 新增部套
  const handleAddPartSet = () => {
    const newPartSet: IPartSet = {
      id: Date.now().toString(),
      name: `部套${partSets.length + 1}`,
      code: `PS${String(partSets.length + 1).padStart(3, '0')}`,
      status: 'enabled',
    };
    setPartSets([...partSets, newPartSet]);
  };

  // 删除部套
  const handleDeletePartSet = (id: string) => {
    setPartSets(partSets.filter(item => item.id !== id));
  };

  // 查询部套（模拟功能）
  const handleSearchPartSet = () => {
    MessagePlugin.info('查询功能待实现');
  };

  // 表单提交
  const handleSubmit = async (e: SubmitContext) => {
    if (e.validateResult === true) {
      setLoading(true);
      try {
        const formData = formRef.current?.getFieldsValue?.(true) as IProductForm;
        const submitData = {
          ...formData,
          partSets,
        };
        await onSubmit(submitData);
        MessagePlugin.success('产品创建成功');
        handleClose();
      } catch (error) {
        MessagePlugin.error('创建失败，请重试');
      } finally {
        setLoading(false);
      }
    }
  };

  // 重置表单
  const handleReset = () => {
    formRef.current?.reset?.();
    setPartSets([]);
  };

  // 关闭弹窗
  const handleClose = () => {
    handleReset();
    onClose();
  };

  return (
    <Dialog
      header="新增产品"
      visible={visible}
      width={800}
      onClose={handleClose}
      footer={
        <Space>
          <Button onClick={handleClose}>取消</Button>
          <Button theme="default" onClick={handleReset}>重置</Button>
          <Button theme="primary" loading={loading} onClick={() => formRef.current?.submit?.()}>
            提交
          </Button>
        </Space>
      }
    >
      <Form
        ref={formRef}
        onSubmit={handleSubmit}
        labelWidth={100}
        labelAlign="left"
        layout="vertical"
      >
        {/* 设备信息部分 */}
        <div style={{ marginBottom: 24 }}>
          <h3 style={{ marginBottom: 16, fontSize: 16, fontWeight: 500 }}>设备信息</h3>
          <FormItem
            label="设备名称"
            name="deviceName"
            rules={[{ required: true, message: '请输入设备名称', type: 'error' }]}
          >
            <Input placeholder="请输入设备名称" />
          </FormItem>
        </div>

        {/* 部套列表部分 */}
        <div style={{ marginBottom: 24 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
            <h3 style={{ margin: 0, fontSize: 16, fontWeight: 500 }}>部套列表</h3>
            <Space>
              <Button theme="default" variant="outline" onClick={handleSearchPartSet}>
                查询
              </Button>
              <Button theme="primary" variant="outline" onClick={handleAddPartSet}>
                <AddIcon />
                新增
              </Button>
            </Space>
          </div>
          
          <Table
            data={partSets}
            columns={partSetColumns}
            rowKey="id"
            size="small"
            bordered
            hover
            maxHeight={300}
            empty="暂无部套数据，请点击新增按钮添加"
          />
        </div>

        {/* 其他信息部分 */}
        <div>
          <h3 style={{ marginBottom: 16, fontSize: 16, fontWeight: 500 }}>其他信息</h3>
          <FormItem label="备注" name="remark">
            <Textarea placeholder="请输入备注信息" rows={3} />
          </FormItem>
        </div>
      </Form>
    </Dialog>
  );
};

export default memo(AddProductForm);