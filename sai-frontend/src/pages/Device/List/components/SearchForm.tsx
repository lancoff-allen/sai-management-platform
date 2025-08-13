import React, { useRef, memo } from 'react';
import { Row, Col, Form, Input, Button, MessagePlugin, Select } from 'tdesign-react';
import { DEVICE_STATUS_OPTIONS, DeviceStatus } from 'services/device';
import { FormInstanceFunctions, SubmitContext } from 'tdesign-react/es/form/type';

const { FormItem } = Form;

export type FormValueType = {
  deviceNumber?: string;
  status?: DeviceStatus;
};

export type SearchFormProps = {
  onCancel: () => void;
  onSubmit: (values: FormValueType) => Promise<void>;
};

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
    props.onCancel();
    MessagePlugin.info('重置成功');
  };

  return (
    <div className='list-common-table-query'>
      <Form ref={formRef} onSubmit={onSubmit} onReset={onReset} labelWidth={80} colon>
        <Row>
          <Col flex='1'>
            <Row gutter={[16, 16]}>
              <Col span={3} xs={12} sm={6} xl={3}>
                <FormItem label='设备编号' name='deviceNumber'>
                  <Input placeholder='请输入设备编号' />
                </FormItem>
              </Col>
              <Col span={3} xs={12} sm={6} xl={3}>
                <FormItem label='设备状态' name='status'>
                  <Select options={DEVICE_STATUS_OPTIONS} placeholder='请选择设备状态' />
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
            <Button theme='primary' variant='outline'>
              新增
            </Button>
          </Col>
        </Row>
      </Form>
    </div>
  );
};

export default memo(SearchForm);