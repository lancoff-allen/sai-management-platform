import React, { memo, useRef, useState } from 'react';
import {
  Form,
  Row,
  Col,
  Input,
  Button,
  Table,
  Tag,
  Textarea,
  MessagePlugin,
  Space,
  Select,
  Switch, // 新增 Switch 导入
} from 'tdesign-react';
import { AddIcon, DeleteIcon, CheckIcon } from 'tdesign-icons-react'; // 新增 CheckIcon 导入
import { useNavigate } from 'react-router-dom';
import { FormInstanceFunctions, SubmitContext } from 'tdesign-react/es/form/type';
import classnames from 'classnames';
import CommonStyle from '../../../styles/common.module.less';
import Style from '../../Form/Base/index.module.less';

const { FormItem } = Form;
const { Option } = Select;

// 设备分类选项
const DEVICE_CATEGORY_OPTIONS = [
  { label: 'PS2A 乘用子午胎一次法成型机', value: 1 },
  { label: 'TPRO-S全钢子午胎一次法三鼓成型机', value: 2 },
  { label: 'NTS3 全钢子午胎一次法三鼓成型机', value: 3 },
  { label: 'FAR20-S 全自动小料配料称量系统', value: 4 },
  { label: '15°-70°钢丝帘布裁断机', value: 5 },
  { label: '内衬层挤出压延生产线', value: 6 },
];

// 客户选项
const CUSTOMER_OPTIONS = [
  { label: '腾讯科技（深圳）有限公司', value: 'tencent' },
  { label: '阿里巴巴集团', value: 'alibaba' },
  { label: '百度在线网络技术有限公司', value: 'baidu' },
  { label: '字节跳动科技有限公司', value: 'bytedance' },
  { label: '华为技术有限公司', value: 'huawei' },
  { label: '小米科技有限责任公司', value: 'xiaomi' },
];

// 项目经理选项
const PROJECT_MANAGER_OPTIONS = [
  { label: '黄桂菊', value: '黄桂菊' },
  { label: '魏小凯', value: '魏小凯' },
  { label: '王五', value: '王五' },
  { label: '赵六', value: '赵六' },
  { label: '孙七', value: '孙七' },
  { label: '周八', value: '周八' },
  { label: '吴九', value: '吴九' },
  { label: '郑十', value: '郑十' },
];

// 部套数据类型定义
interface IPartSet {
  id: string;
  name: string;
  code: string;
  status: boolean; // 改为 boolean 类型
  isEditing?: boolean; // 新增编辑状态标识
}

// 表单数据类型定义
interface IProductForm {
  deviceNumber: string;
  categoryId: string; // 从 number 改为 string
  customerName: string;
  projectManager: string;
  partSets: IPartSet[];
  remark: string;
}

const INITIAL_DATA = {
  deviceNumber: '',
  categoryId: '', // 从 undefined 改为 ''
  customerName: '',
  projectManager: '',
  remark: '',
};

const AddProductPage: React.FC = () => {
  const navigate = useNavigate();
  const [form] = Form.useForm();
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
      width: 200,
      cell: ({ row }: any) => {
        if (row.isEditing) {
          return (
            <Input
              value={row.name}
              onChange={(value) => handlePartSetFieldChange(row.id, 'name', value)}
              placeholder="请输入部套名称"
            />
          );
        }
        return row.name;
      },
    },
    {
      title: '部套编号',
      colKey: 'code',
      width: 200,
      cell: ({ row }: any) => {
        if (row.isEditing) {
          return (
            <Input
              value={row.code}
              onChange={(value) => handlePartSetFieldChange(row.id, 'code', value)}
              placeholder="请输入部套编号"
            />
          );
        }
        return row.code;
      },
    },
    {
      title: '状态',
      colKey: 'status',
      width: 120,
      cell: ({ row }: any) => {
        if (row.isEditing) {
          return (
            <Switch
              value={row.status}
              onChange={(value) => handlePartSetFieldChange(row.id, 'status', value)}
            />
          );
        }
        return (
          <Tag theme={row.status ? 'success' : 'default'} variant="outline">
            {row.status ? '启用' : '禁用'}
          </Tag>
        );
      },
    },
    {
      title: '操作',
      colKey: 'operation',
      width: 120,
      align: 'center' as const,
      cell: ({ row }: any) => {
        if (row.isEditing) {
          return (
            <Button
              theme="primary"
              variant="text"
              size="small"
              onClick={() => handleSavePartSet(row.id)}
              style={{ display: 'flex', alignItems: 'center', gap: '4px' }}
            >
              保存
            </Button>
          );
        }
        return (
          <Button
            theme="danger"
            variant="text"
            size="small"
            onClick={() => handleDeletePartSet(row.id)}
            style={{ display: 'flex', alignItems: 'center', gap: '4px' }}
          >
            删除
          </Button>
        );
      },
    },
  ];

  // 新增部套
  const handleAddPartSet = () => {
    const newPartSet: IPartSet = {
      id: Date.now().toString(),
      name: '',
      code: '',
      status: true, // 默认启用
      isEditing: true, // 新增时默认为编辑状态
    };
    setPartSets([...partSets, newPartSet]);
  };

  // 删除部套
  const handleDeletePartSet = (id: string) => {
    setPartSets(partSets.filter(item => item.id !== id));
  };

  // 保存部套
  const handleSavePartSet = (id: string) => {
    const partSet = partSets.find(item => item.id === id);
    if (!partSet) return;

    // 验证必填字段
    if (!partSet.name.trim()) {
      MessagePlugin.error('部套名称不能为空');
      return;
    }
    if (!partSet.code.trim()) {
      MessagePlugin.error('部套编号不能为空');
      return;
    }

    // 检查编号是否重复
    const isDuplicate = partSets.some(
      item => item.id !== id && item.code === partSet.code
    );
    if (isDuplicate) {
      MessagePlugin.error('部套编号已存在，请使用其他编号');
      return;
    }

    // 保存成功，退出编辑状态
    setPartSets(partSets.map(item => 
      item.id === id ? { ...item, isEditing: false } : item
    ));
    MessagePlugin.success('保存成功');
  };

  // 处理部套字段变更
  const handlePartSetFieldChange = (id: string, field: keyof IPartSet, value: any) => {
    setPartSets(partSets.map(item => 
      item.id === id ? { ...item, [field]: value } : item
    ));
  };

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
      const formData = form.getFieldsValue(true) as IProductForm;
      const submitData = {
        ...formData,
        partSets: partSets.map(({ isEditing, ...item }) => item), // 移除编辑状态字段
      };
      
      console.log('提交数据:', submitData);
      // 这里调用API保存数据
      // await createProduct(submitData);
      
      MessagePlugin.success('产品创建成功');
      // 返回设备列表页面
      navigate('/device/list');
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
    navigate('/device/list');
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
          {/* 设备信息部分 */}
          <div className={Style.titleBox}>
            <div className={Style.titleText}>设备信息</div>
          </div>
          
          <Row gutter={[32, 24]}>
            <Col span={6}>
              <FormItem
                label="设备编号"
                name="deviceNumber"
                initialData={INITIAL_DATA.deviceNumber}
                rules={[{ required: true, message: '设备编号必填', type: 'error' }]}
              >
                <Input placeholder="请输入设备编号" />
              </FormItem>
            </Col>
            <Col span={6}>
              <FormItem
                label="设备分类"
                name="categoryId"
                initialData={INITIAL_DATA.categoryId}
                rules={[{ required: true, message: '设备分类必填', type: 'error' }]}
              >
                <Select placeholder="请选择设备分类">
                  {DEVICE_CATEGORY_OPTIONS.map((item) => (
                    <Option key={item.value} label={item.label} value={item.value} />
                  ))}
                </Select>
              </FormItem>
            </Col>
            <Col span={6}>
              <FormItem
                label="客户信息"
                name="customerName"
                initialData={INITIAL_DATA.customerName}
                rules={[{ required: true, message: '客户信息必填', type: 'error' }]}
              >
                <Select 
                  placeholder="请选择客户" 
                  filterable
                  clearable
                >
                  {CUSTOMER_OPTIONS.map((item) => (
                    <Option key={item.value} label={item.label} value={item.value} />
                  ))}
                </Select>
              </FormItem>
            </Col>
            <Col span={6}>
              <FormItem
                label="项目经理"
                name="projectManager"
                initialData={INITIAL_DATA.projectManager}
                rules={[{ required: true, message: '项目经理必填', type: 'error' }]}
              >
                <Select 
                  placeholder="请选择项目经理" 
                  filterable
                  clearable
                >
                  {PROJECT_MANAGER_OPTIONS.map((item) => (
                    <Option key={item.value} label={item.label} value={item.value} />
                  ))}
                </Select>
              </FormItem>
            </Col>
          </Row>
          {/* 部套列表部分 */}
          <div className={Style.titleBox}>
            <div className={Style.titleText}>部套列表</div>
          </div>
          
          <div style={{ marginBottom: 24 }}>
            <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: 16 }}>
              <Space>
                <Button theme="primary" variant="outline" onClick={handleAddPartSet}>
                  新增
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

          {/* 其他信息部分 */}
          <div className={Style.titleBox}>
            <div className={Style.titleText}>其他信息</div>
          </div>
          
          <FormItem label="备注" name="remark" initialData={INITIAL_DATA.remark}>
            <Textarea placeholder="请输入备注信息" rows={4} />
          </FormItem>

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

export default memo(AddProductPage);