import React, { useRef, memo } from 'react';
import { Row, Col, Form, Input, Button, MessagePlugin, Select } from 'tdesign-react';
import { FormInstanceFunctions, SubmitContext } from 'tdesign-react/es/form/type';
import { useNavigate } from 'react-router-dom';

const { FormItem } = Form;
const { Option } = Select;

// 国家选项常量数组
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

export interface FormValueType {
  name?: string;
  country?: string;  // 新增国家搜索
}

interface SearchFormProps {
  onSubmit: (values: FormValueType) => void;
  onCancel: () => void;
}

const SearchForm: React.FC<SearchFormProps> = (props) => {
  const formRef = useRef<FormInstanceFunctions>();
  const navigate = useNavigate();

  const onSubmit = (e: SubmitContext) => {
    if (e.validateResult === true) {
      const queryValue = formRef?.current?.getFieldsValue?.(true) || {};
      props.onSubmit(queryValue as FormValueType);
      MessagePlugin.info('查询成功');
    }
  };

  const onReset = () => {
    formRef?.current?.reset?.();
    props.onCancel();
    MessagePlugin.info('重置成功');
  };

  const handleAddCustomer = () => {
    navigate('/customer/add-customer');
  };

  return (
    <div className='list-common-table-query'>
      <Form ref={formRef} onSubmit={onSubmit} onReset={onReset} labelWidth={80} colon>
        <Row>
          <Col flex='1'>
            <Row gutter={[16, 16]}>
              <Col span={3} xs={12} sm={6} xl={3}>
                <FormItem label='客户名称' name='name'>
                  <Input placeholder='请输入客户名称' clearable />
                </FormItem>
              </Col>
              <Col span={3} xs={12} sm={6} xl={3}>
                <FormItem label='国家' name='country'>
                  <Select placeholder='请选择国家' clearable filterable>
                    {COUNTRY_OPTIONS.map((item) => (
                      <Option key={item.value} label={item.label} value={item.value} />
                    ))}
                  </Select>
                </FormItem>
              </Col>
            </Row>
          </Col>
          <Col flex='none' style={{ display: 'flex', justifyContent: 'flex-end' }}>
            <Button theme='primary' type='submit' style={{ marginRight: '8px' }}>
              查询
            </Button>
            <Button type='reset' variant='base' theme='default' style={{ marginRight: '8px' }}>
              重置
            </Button>
            <Button theme='primary' variant='outline' onClick={handleAddCustomer}>
              新增
            </Button>
          </Col>
        </Row>
      </Form>
    </div>
  );
};

export default memo(SearchForm);