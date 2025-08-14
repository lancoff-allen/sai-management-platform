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
  Select, // 新增 Select 导入
} from 'tdesign-react';
import { AddIcon, DeleteIcon } from 'tdesign-icons-react';
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
  status: 'enabled' | 'disabled';
}

// 表单数据类型定义
interface IProductForm {
  deviceNumber: string; // 改为设备编号
  categoryId: number;
  customerName: string; // 新增客户信息
  projectManager: string; // 新增项目经理
  partSets: IPartSet[];
  remark: string;
}

const INITIAL_DATA = {
  deviceNumber: '', // 改为设备编号
  categoryId: undefined,
  customerName: '', // 新增客户信息初始值
  projectManager: '', // 新增项目经理初始值
  remark: '',
};

const AddProductPage: React.FC = () => {
  const navigate = useNavigate();
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
      width: 200,
    },
    {
      title: '部套编号',
      colKey: 'code',
      width: 200,
    },
    {
      title: '状态',
      colKey: 'status',
      width: 120,
      cell: ({ row }: any) => (
        <Tag theme={row.status === 'enabled' ? 'success' : 'default'}>
          {row.status === 'enabled' ? '启用' : '禁用'}
        </Tag>
      ),
    },
    {
      title: '操作',
      colKey: 'operation',
      width: 120,
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
        
        console.log('提交数据:', submitData);
        // 这里调用API保存数据
        // await createProduct(submitData);
        
        MessagePlugin.success('产品创建成功');
        // 返回设备列表页面
        navigate('/device/list');
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

  // 返回列表页
  const handleBack = () => {
    navigate('/device/list');
  };

  return (
    <div className={classnames(CommonStyle.pageWithColor)}>
      <div className={Style.formContainer}>
        <Form
          ref={formRef}
          onSubmit={handleSubmit}
          labelWidth={100}
          labelAlign="top"
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
          <FormItem>
            <Space>
              <Button type="submit" theme="primary" loading={loading}>
                提交
              </Button>
              <Button type="reset" onClick={handleReset}>
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