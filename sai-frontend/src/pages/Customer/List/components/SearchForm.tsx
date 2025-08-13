import React, { useRef, memo } from 'react';
import { Row, Col, Form, Input, Button, MessagePlugin } from 'tdesign-react';
import { FormInstanceFunctions, SubmitContext } from 'tdesign-react/es/form/type';

const { FormItem } = Form;

export interface FormValueType {
  name?: string;
}

interface SearchFormProps {
  onSubmit: (values: FormValueType) => void;
  onCancel: () => void;
}

const SearchForm: React.FC<SearchFormProps> = (props) => {
  const formRef = useRef<FormInstanceFunctions>();

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
    console.log('新增客户');
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