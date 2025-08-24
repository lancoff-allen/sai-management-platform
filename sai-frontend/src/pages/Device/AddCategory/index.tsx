import React, { memo, useState } from 'react';
import {
  Form,
  Row,
  Col,
  Input,
  Button,
  Textarea,
  MessagePlugin,
  Space,
  Select,
  Table,
  Tag,
  Switch,
} from 'tdesign-react';
import { useNavigate } from 'react-router-dom';
import { FormInstanceFunctions, SubmitContext } from 'tdesign-react/es/form/type';
import classnames from 'classnames';
import CommonStyle from '../../../styles/common.module.less';
import Style from '../../Form/Base/index.module.less';

const { FormItem } = Form;
const { Option } = Select;

// 设备分类状态选项
const CATEGORY_STATUS_OPTIONS = [
  { label: '启用', value: '1' },
  { label: '禁用', value: '0' },
];

// 部套数据类型定义
interface IPartSet {
  id: string;
  name: string;
  code: string;
  status: boolean;
  isEditing?: boolean;
}

// 表单数据类型定义
interface ICategoryForm {
  categoryName: string;
  status: string;
  description: string;
  partSets: IPartSet[];
}

// 初始数据
const INITIAL_DATA = {
  categoryName: '',
  status: '1',
  description: '',
};

const AddCategoryPage: React.FC = () => {
  const navigate = useNavigate();
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [partSets, setPartSets] = useState<IPartSet[]>([]); // 移到组件内部

  // 新增部套
  const handleAddPartSet = () => {
    const newPartSet: IPartSet = {
      id: Date.now().toString(),
      name: '',
      code: '',
      status: true,
      isEditing: true,
    };
    setPartSets([...partSets, newPartSet]);
  };

  // 编辑部套
  const handleEditPartSet = (id: string) => {
    setPartSets(partSets.map(item => 
      item.id === id ? { ...item, isEditing: true } : item
    ));
  };

  // 保存部套
  const handleSavePartSet = (id: string) => {
    const partSet = partSets.find(item => item.id === id);
    if (!partSet?.name.trim() || !partSet?.code.trim()) {
      MessagePlugin.error('部套名称和编号不能为空');
      return;
    }
    setPartSets(partSets.map(item => 
      item.id === id ? { ...item, isEditing: false } : item
    ));
  };

  // 取消编辑部套
  const handleCancelEditPartSet = (id: string) => {
    setPartSets(partSets.filter(item => item.id !== id));
  };

  // 删除部套
  const handleDeletePartSet = (id: string) => {
    setPartSets(partSets.filter(item => item.id !== id));
  };

  // 部套字段变更
  const handlePartSetFieldChange = (id: string, field: keyof IPartSet, value: any) => {
    setPartSets(partSets.map(item => 
      item.id === id ? { ...item, [field]: value } : item
    ));
  };

  // 部套列表的表格列定义
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
      width: 200,
      cell: ({ row }: any) => {
        return row.isEditing ? (
          <Input
            value={row.name}
            onChange={(value) => handlePartSetFieldChange(row.id, 'name', value)}
            placeholder="请输入部套名称"
          />
        ) : (
          row.name || '-'
        );
      },
    },
    {
      title: '部套编号',
      colKey: 'code',
      width: 200,
      cell: ({ row }: any) => {
        return row.isEditing ? (
          <Input
            value={row.code}
            onChange={(value) => handlePartSetFieldChange(row.id, 'code', value)}
            placeholder="请输入部套编号"
          />
        ) : (
          row.code || '-'
        );
      },
    },
    {
      title: '状态',
      colKey: 'status',
      width: 120,
      cell: ({ row }: any) => {
        return row.isEditing ? (
          <Switch
            value={row.status}
            onChange={(value) => handlePartSetFieldChange(row.id, 'status', value)}
          />
        ) : (
          <Tag theme={row.status ? 'success' : 'default'}>
            {row.status ? '启用' : '禁用'}
          </Tag>
        );
      },
    },
    {
      title: '操作',
      colKey: 'operation',
      width: 150,
      align: 'center' as const,
      cell: ({ row }: any) => (
        <Space>
          {row.isEditing ? (
            <>
              <Button
                theme="primary"
                variant="text"
                size="small"
                onClick={() => handleSavePartSet(row.id)}
              >
                保存
              </Button>
              <Button
                theme="default"
                variant="text"
                size="small"
                onClick={() => handleCancelEditPartSet(row.id)}
              >
                取消
              </Button>
            </>
          ) : (
            <>
              <Button
                theme="primary"
                variant="text"
                size="small"
                onClick={() => handleEditPartSet(row.id)}
              >
                编辑
              </Button>
              <Button
                theme="danger"
                variant="text"
                size="small"
                onClick={() => handleDeletePartSet(row.id)}
              >
                删除
              </Button>
            </>
          )}
        </Space>
      ),
    },
  ];

  // 表单提交
  const handleSubmit = async () => {
    // 检查是否有未保存的部套
    const hasEditingPartSet = partSets.some(item => item.isEditing);
    if (hasEditingPartSet) {
      MessagePlugin.error('请先保存所有编辑中的部套');
      return;
    }
  
    setLoading(true);
    try {
      await form.validate();
      const formData = form.getFieldsValue(true) as ICategoryForm;
      
      const submitData = {
        ...formData,
        status: formData.status === '1',
        partSets: partSets.map(({ isEditing, ...item }) => item),
      };
      
      console.log('提交数据:', submitData);
      // 这里调用API保存数据
      // await createCategory(submitData);
      
      MessagePlugin.success('设备分类创建成功');
      navigate('/device/category');
    } catch (error) {
      const firstError = Object.values(error as any)[0];
      if (firstError) {
        MessagePlugin.error((firstError as any).message);
      }
    } finally {
      setLoading(false);
    }
  };
  
  // 重置表单
  const handleReset = () => {
    form.reset();
    setPartSets([]);
  };

  // 返回列表页
  const handleBack = () => {
    navigate('/device/category');
  };

  return (
    <div className={classnames(CommonStyle.pageWithColor)}>
      <div className={Style.formContainer}>
        <Form
          form={form}
          onSubmit={handleSubmit}
          labelWidth={100}
          labelAlign="top"
          onReset={handleReset}
        >
          {/* 分类信息部分 */}
          <div className={Style.titleBox}>
            <div className={Style.titleText}>设备分类信息</div>
          </div>
          
          <Row gutter={[32, 24]}>
            <Col span={6}>
              <FormItem
                label="分类名称"
                name="categoryName"
                initialData={INITIAL_DATA.categoryName}
                rules={[{ required: true, message: '分类名称必填', type: 'error' }]}
              >
                <Input placeholder="请输入分类名称" />
              </FormItem>
            </Col>
            <Col span={6}>
              <FormItem
                label="状态"
                name="status"
                initialData={INITIAL_DATA.status}
                rules={[{ required: true, message: '状态必填', type: 'error' }]}
              >
                <Select 
                  placeholder="请选择状态" 
                  filterable
                  clearable
                >
                  {CATEGORY_STATUS_OPTIONS.map((item) => (
                    <Option key={String(item.value)} label={item.label} value={item.value} />
                  ))}
                </Select>
              </FormItem>
            </Col>
            <Col span={12}>
              <FormItem label="描述" name="description" initialData={INITIAL_DATA.description}>
                <Textarea placeholder="请输入分类描述" rows={4} />
              </FormItem>
            </Col>
          </Row>
          
          {/* 部套列表部分 */}
          <div className={Style.titleBox}>
            <div className={Style.titleText}>部套列表</div>
          </div>
          
          <div style={{ marginBottom: 24 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
              <div></div>
              <Space>
                <Button theme="primary" variant="outline" onClick={handleAddPartSet}>
                  新增部套
                </Button>
              </Space>
            </div>
            
            <Table
              data={partSets}
              columns={partSetColumns}
              rowKey="id"
              size="medium"
              bordered
              hover
              maxHeight={400}
              empty="暂无部套数据，请点击新增按钮添加"
            />
          </div>

          {/* 操作按钮 */}
          <FormItem className={Style.buttonContainer}>
            <Space>
              <Button type="submit" theme="primary" loading={loading}>
                提交
              </Button>
              <Button type="reset" variant="base" theme="default">
                重置
              </Button>
              <Button theme="default" onClick={handleBack}>
                返回
              </Button>
            </Space>
          </FormItem>
        </Form>
      </div>
    </div>
  );
};

export default memo(AddCategoryPage);