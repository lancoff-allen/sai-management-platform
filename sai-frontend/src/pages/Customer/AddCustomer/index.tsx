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
  Textarea,
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
  contactPerson: string;    // 新增：联系人
  contactPhone: string;     // 新增：联系电话（必填）
  contactEmail: string;     // 新增：联系邮箱
  remark: string;
}

const INITIAL_DATA = {
  customerName: '',
  status: true, // 默认启用
  country: '',
  province: '',
  city: '',
  district: '',
  contactPerson: '',        // 新增
  contactPhone: '',         // 新增
  contactEmail: '',         // 新增
  remark: '',
};

const AddCustomerPage: React.FC = () => {
  const navigate = useNavigate();
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [country, setCountry] = useState(INITIAL_DATA.country);
  const [province, setProvince] = useState(INITIAL_DATA.province);
  const [city, setCity] = useState(INITIAL_DATA.city);

  const availableCities = CITY_OPTIONS[province as keyof typeof CITY_OPTIONS] || [];
  const availableDistricts = DISTRICT_OPTIONS[city as keyof typeof DISTRICT_OPTIONS] || [];
  const isChinaSelected = country === 'china';

  // 处理国家变化
  const handleCountryChange = (value: any) => {
    const countryValue = String(value);
    setCountry(countryValue);
    setProvince('');
    setCity('');
    form.setFieldsValue({ province: '', city: '', district: '' });
  };

  // 处理省份变化
  const handleProvinceChange = (value: any) => {
    const provinceValue = String(value);
    setProvince(provinceValue);
    setCity('');
    form.setFieldsValue({ city: '', district: '' });
  };

  // 处理城市变化
  const handleCityChange = (value: any) => {
    const cityValue = String(value);
    setCity(cityValue);
    form.setFieldsValue({ district: '' });
  };

  // 表单提交
  const handleSubmit = async () => {
    setLoading(true);
    try {
      await form.validate();
      const values = form.getFieldsValue(true);
      
      const submitData = {
        ...values,
        status: values.status === 'true'
      };
      
      console.log('提交的客户数据:', submitData);
      
      MessagePlugin.success('客户添加成功！');
      navigate('/customer/list');
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
    setCountry(INITIAL_DATA.country);
    setProvince(INITIAL_DATA.province);
    setCity(INITIAL_DATA.city);
  };

  // 返回列表页
  const handleBack = () => {
    navigate('/customer/list');
  };

  return (
    <div className={classnames(CommonStyle.pageWithColor)}>
      <div className={Style.formContainer}>
        <Form
          form={form}
          onSubmit={handleSubmit}
          onReset={handleReset}
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
                  disabled={!isChinaSelected || !province}
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
                  disabled={!isChinaSelected || !city}
                >
                  {availableDistricts.map((item) => (
                    <Option key={item.value} label={item.label} value={item.value} />
                  ))}
                </Select>
              </FormItem>
            </Col>
          </Row>

          {/* 其他信息部分 */}
          <div className={Style.titleBox}>
            <div className={Style.titleText}>其他信息</div>
          </div>
          
          <Row gutter={[32, 24]}>
            <Col span={6}>
              <FormItem
                label="联系人"
                name="contactPerson"
                initialData={INITIAL_DATA.contactPerson}
              >
                <Input placeholder="请输入联系人姓名" />
              </FormItem>
            </Col>
            <Col span={6}>
              <FormItem
                label="联系电话"
                name="contactPhone"
                initialData={INITIAL_DATA.contactPhone}
                rules={[
                  { required: true, message: '联系电话必填', type: 'error' },
                  { pattern: /^1[3-9]\d{9}$/, message: '请输入正确的手机号码', type: 'error' }
                ]}
              >
                <Input placeholder="请输入联系电话" />
              </FormItem>
            </Col>
            <Col span={6}>
              <FormItem
                label="联系邮箱"
                name="contactEmail"
                initialData={INITIAL_DATA.contactEmail}
                rules={[
                  { 
                    pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/, 
                    message: '请输入正确的邮箱地址', 
                    type: 'warning' 
                  }
                ]}
              >
                <Input placeholder="请输入联系邮箱" />
              </FormItem>
            </Col>
          </Row>
          
          <Row gutter={[32, 24]}>
            <Col span={12}>
              <FormItem 
                label='备注' 
                name='remark' 
                initialData={INITIAL_DATA.remark}
                style={{ marginTop: '24px', marginBottom: '24px' }}
              >
                <Textarea placeholder='请输入备注信息' autosize={{ minRows: 4, maxRows: 6 }} />
              </FormItem>

              {/* 操作按钮 */}
            </Col>
          </Row>

          {/* 操作按钮 */}
          <FormItem className={Style.buttonContainer}>
            <Space>
              <Button type='submit' theme='primary' loading={loading}>
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

export default memo(AddCustomerPage);