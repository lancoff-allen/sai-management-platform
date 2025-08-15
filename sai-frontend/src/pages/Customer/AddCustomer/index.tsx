import React, { memo, useRef, useState } from 'react';
import {
  Form,
  Row,
  Col,
  Input,
  Button,
  MessagePlugin,
  Space,
  Select,
  Switch,
} from 'tdesign-react';
import { useNavigate } from 'react-router-dom';
import { FormInstanceFunctions, SubmitContext } from 'tdesign-react/es/form/type';
import classnames from 'classnames';
import CommonStyle from '../../../styles/common.module.less';
import Style from '../../Form/Base/index.module.less';

const { FormItem } = Form;
const { Option } = Select;

// 国家选项
const COUNTRY_OPTIONS = [
  { label: '中国', value: 'china' },
  { label: '美国', value: 'usa' },
  { label: '日本', value: 'japan' },
  { label: '德国', value: 'germany' },
  { label: '英国', value: 'uk' },
  { label: '法国', value: 'france' },
  { label: '韩国', value: 'korea' },
  { label: '意大利', value: 'italy' },
  { label: '加拿大', value: 'canada' },
  { label: '澳大利亚', value: 'australia' },
];

// 省份选项（中国）
const PROVINCE_OPTIONS = [
  { label: '北京市', value: 'beijing' },
  { label: '上海市', value: 'shanghai' },
  { label: '天津市', value: 'tianjin' },
  { label: '重庆市', value: 'chongqing' },
  { label: '广东省', value: 'guangdong' },
  { label: '江苏省', value: 'jiangsu' },
  { label: '浙江省', value: 'zhejiang' },
  { label: '山东省', value: 'shandong' },
  { label: '河南省', value: 'henan' },
  { label: '四川省', value: 'sichuan' },
  { label: '湖北省', value: 'hubei' },
  { label: '湖南省', value: 'hunan' },
  { label: '福建省', value: 'fujian' },
  { label: '安徽省', value: 'anhui' },
  { label: '江西省', value: 'jiangxi' },
];

// 城市选项（示例：广东省）
const CITY_OPTIONS = {
  guangdong: [
    { label: '广州市', value: 'guangzhou' },
    { label: '深圳市', value: 'shenzhen' },
    { label: '珠海市', value: 'zhuhai' },
    { label: '汕头市', value: 'shantou' },
    { label: '佛山市', value: 'foshan' },
    { label: '韶关市', value: 'shaoguan' },
    { label: '湛江市', value: 'zhanjiang' },
    { label: '肇庆市', value: 'zhaoqing' },
    { label: '江门市', value: 'jiangmen' },
    { label: '茂名市', value: 'maoming' },
  ],
  // 可以继续添加其他省份的城市
};

// 区县选项（示例：深圳市）
const DISTRICT_OPTIONS = {
  shenzhen: [
    { label: '福田区', value: 'futian' },
    { label: '罗湖区', value: 'luohu' },
    { label: '南山区', value: 'nanshan' },
    { label: '宝安区', value: 'baoan' },
    { label: '龙岗区', value: 'longgang' },
    { label: '盐田区', value: 'yantian' },
    { label: '龙华区', value: 'longhua' },
    { label: '坪山区', value: 'pingshan' },
    { label: '光明区', value: 'guangming' },
    { label: '大鹏新区', value: 'dapeng' },
  ],
  // 可以继续添加其他城市的区县
};

// 表单数据类型定义
interface ICustomerForm {
  customerName: string;
  status: boolean;
  country: string;
  province: string;
  city: string;
  district: string;
}

const INITIAL_DATA = {
  customerName: '',
  status: true, // 默认启用
  country: '',
  province: '',
  city: '',
  district: '',
};

const AddCustomerPage: React.FC = () => {
  const navigate = useNavigate();
  const [form] = Form.useForm(); // 使用 Form.useForm() 替代 formRef
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState(INITIAL_DATA);
  const [availableCities, setAvailableCities] = useState<any[]>([]);
  const [availableDistricts, setAvailableDistricts] = useState<any[]>([]);

  // 处理国家变化
  const handleCountryChange = (value: any) => {
    const countryValue = String(value); // 确保转换为字符串
    setFormData(prev => ({
      ...prev,
      country: countryValue,
      province: '',
      city: '',
      district: '',
    }));
    
    // 重置省市区选择
    form.setFieldsValue({
      province: '',
      city: '',
      district: '',
    });
    
    setAvailableCities([]);
    setAvailableDistricts([]);
  };

  // 处理省份变化
  const handleProvinceChange = (value: any) => {
    const provinceValue = String(value);
    setFormData(prev => ({
      ...prev,
      province: provinceValue,
      city: '',
      district: '',
    }));
    
    // 重置市区选择
    form.setFieldsValue({
      city: '',
      district: '',
    });
    
    // 更新可用城市列表
    const cities = CITY_OPTIONS[provinceValue as keyof typeof CITY_OPTIONS] || [];
    setAvailableCities(cities);
    setAvailableDistricts([]);
  };

  // 处理城市变化
  const handleCityChange = (value: any) => {
    const cityValue = String(value);
    setFormData(prev => ({
      ...prev,
      city: cityValue,
      district: '',
    }));
    
    // 重置区选择
    form.setFieldsValue({
      district: '',
    });
    
    // 更新可用区县列表
    const districts = DISTRICT_OPTIONS[cityValue as keyof typeof DISTRICT_OPTIONS] || [];
    setAvailableDistricts(districts);
  };

  // 表单提交
  const handleSubmit = async () => {
    try {
      await form.validate(); // 使用 form.validate() 替代 formRef.current?.validateFields()
      const values = form.getFieldsValue(true); // 获取表单值
      
      // 将状态字符串转换为布尔值
      const submitData = {
        ...values,
        status: values.status === 'true'
      };
      
      console.log('提交的客户数据:', submitData);
      // 这里调用API提交数据
      
      MessagePlugin.success('客户添加成功！');
      navigate('/customer/list');
    } catch (error) {
      console.error('表单验证失败:', error);
    }
  };

  // 重置表单
  const handleReset = () => {
    form.reset(); // 使用 form.reset() 替代 formRef.current?.reset?.()
    setFormData(INITIAL_DATA);
    setAvailableCities([]);
    setAvailableDistricts([]);
  };

  // 返回列表页
  const handleBack = () => {
    navigate('/customer/list');
  };

  // 判断是否选择了中国
  const isChinaSelected = formData.country === 'china';

  return (
    <div className={classnames(CommonStyle.pageWithColor)}>
      <div className={Style.formContainer}>
        <Form
          form={form}
          onSubmit={handleSubmit}
          labelWidth={100}
          labelAlign="top"
        >
          {/* 客户信息部分 */}
          <div className={Style.titleBox}>
            <div className={Style.titleText}>客户信息</div>
          </div>
          
          <Row gutter={[32, 24]}>
            <Col span={6}>
              <FormItem
                label="客户名称"
                name="customerName"
                initialData={INITIAL_DATA.customerName}
                rules={[{ required: true, message: '客户名称必填', type: 'error' }]}
              >
                <Input placeholder="请输入客户名称" />
              </FormItem>
            </Col>
            <Col span={6}>
              <FormItem
                label="状态"
                name="status"
                initialData={INITIAL_DATA.status}
                rules={[{ required: true, message: '状态必填', type: 'error' }]}
              >
                <Select placeholder="请选择状态">
                  <Option key="enabled" label="启用" value="true" />
                  <Option key="disabled" label="禁用" value="false" />
                </Select>
              </FormItem>
            </Col>
            <Col span={6}>
              <FormItem
                label="国家"
                name="country"
                initialData={INITIAL_DATA.country}
                rules={[{ required: true, message: '国家必填', type: 'error' }]}
              >
                <Select 
                  placeholder="请选择国家" 
                  filterable
                  clearable
                  onChange={handleCountryChange}
                >
                  {COUNTRY_OPTIONS.map((item) => (
                    <Option key={item.value} label={item.label} value={item.value} />
                  ))}
                </Select>
              </FormItem>
            </Col>
          </Row>

          {/* 详细地址部分 */}
          <div className={Style.titleBox}>
            <div className={Style.titleText}>详细地址</div>
          </div>
          
          <Row gutter={[32, 24]}>
            <Col span={6}>
              <FormItem
                label="省份"
                name="province"
                initialData={INITIAL_DATA.province}
                rules={isChinaSelected ? [{ required: true, message: '省份必填', type: 'error' }] : []}
              >
                <Select 
                  placeholder="请选择省份" 
                  filterable
                  clearable
                  disabled={!isChinaSelected}
                  onChange={handleProvinceChange}
                >
                  {PROVINCE_OPTIONS.map((item) => (
                    <Option key={item.value} label={item.label} value={item.value} />
                  ))}
                </Select>
              </FormItem>
            </Col>
            <Col span={6}>
              <FormItem
                label="城市"
                name="city"
                initialData={INITIAL_DATA.city}
                rules={isChinaSelected ? [{ required: true, message: '城市必填', type: 'error' }] : []}
              >
                <Select 
                  placeholder="请选择城市" 
                  filterable
                  clearable
                  disabled={!isChinaSelected || !formData.province}
                  onChange={handleCityChange}
                >
                  {availableCities.map((item) => (
                    <Option key={item.value} label={item.label} value={item.value} />
                  ))}
                </Select>
              </FormItem>
            </Col>
            <Col span={6}>
              <FormItem
                label="区县"
                name="district"
                initialData={INITIAL_DATA.district}
                rules={isChinaSelected ? [{ required: true, message: '区县必填', type: 'error' }] : []}
              >
                <Select 
                  placeholder="请选择区县" 
                  filterable
                  clearable
                  disabled={!isChinaSelected || !formData.city}
                >
                  {availableDistricts.map((item) => (
                    <Option key={item.value} label={item.label} value={item.value} />
                  ))}
                </Select>
              </FormItem>
            </Col>
          </Row>
          {/* BUG: 按钮距离问题需要处理 */}
          {/* 操作按钮 */}
          <FormItem>
            <Space>
              <Button type="submit" theme="primary" loading={loading}>
                提交
              </Button>
              <Button variant="base" theme="primary" onClick={handleReset}>
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

export default memo(AddCustomerPage);