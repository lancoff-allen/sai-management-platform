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

// 表单数据类型定义
interface ICategoryForm {
  categoryName: string;
  status: string;
  description: string;
}

const INITIAL_DATA = {
  categoryName: '',
  status: '1',
  description: '',
};

const AddCategoryPage: React.FC = () => {
  const navigate = useNavigate();
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);

  // 表单提交
  const handleSubmit = async () => {
    setLoading(true);
    try {
      await form.validate();
      const formData = form.getFieldsValue(true) as ICategoryForm;
      
      // 转换状态值为 boolean
      const submitData = {
        ...formData,
        status: formData.status === '1'
      };
      
      console.log('提交数据:', submitData);
      // 这里调用API保存数据
      // await createCategory(submitData);
      
      MessagePlugin.success('设备分类创建成功');
      // 返回设备分类列表页面
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
          </Row>
          
          {/* 描述信息部分 */}
          <div className={Style.titleBox}>
            <div className={Style.titleText}>描述信息</div>
          </div>
          
          <FormItem label="描述" name="description" initialData={INITIAL_DATA.description}>
            <Textarea placeholder="请输入分类描述" rows={4} />
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

export default memo(AddCategoryPage);