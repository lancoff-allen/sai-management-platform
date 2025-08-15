import React, { useRef, memo } from 'react';
import { Row, Col, Form, Input, Button, MessagePlugin, Select } from 'tdesign-react';
import { useNavigate } from 'react-router-dom';
import { WORK_ORDER_STATUS_OPTIONS, WorkOrderStatus } from 'services/ioInspection';
import { FormInstanceFunctions, SubmitContext } from 'tdesign-react/es/form/type';

const { FormItem } = Form;

export type FormValueType = {
  deviceName?: string;
  workOrderStatus?: WorkOrderStatus;
  customerName?: string;
};

export type SearchFormProps = {
  onCancel: () => void;
  onSubmit: (values: FormValueType) => Promise<void>;
};

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
    props.onCancel();
    MessagePlugin.info('重置成功');
  };

  const handleAdd = () => {
    navigate('/workorder/io-check/add');
  };

  return (
    <div className='list-common-table-query'>
      <Form ref={formRef} onSubmit={onSubmit} onReset={onReset} labelWidth={80} colon>
        <Row>
          <Col flex='1'>
            <Row gutter={[16, 16]}>
              <Col span={3} xs={12} sm={6} xl={3}>
                <FormItem label='设备名称' name='deviceName'>
                  <Input placeholder='请输入设备名称' />
                </FormItem>
              </Col>
              <Col span={3} xs={12} sm={6} xl={3}>
                <FormItem label='工单状态' name='workOrderStatus'>
                  <Select options={WORK_ORDER_STATUS_OPTIONS} placeholder='请选择工单状态' />
                </FormItem>
              </Col>
              <Col span={3} xs={12} sm={6} xl={3}>
                <FormItem label='客户名称' name='customerName'>
                  <Input placeholder='请输入客户名称' />
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
            <Button theme='primary' variant='outline' onClick={handleAdd}>
              新增
            </Button>
          </Col>
        </Row>
      </Form>
    </div>
  );
};

export default memo(SearchForm);