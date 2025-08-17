import React, { useState, useEffect } from 'react';
import {
  Form,
  Row,
  Col,
  Input,
  Button,
  Select,
  Upload,
  MessagePlugin,
  Space,
} from 'tdesign-react';
import { AddIcon } from 'tdesign-icons-react';
import { useNavigate } from 'react-router-dom';
import Style from '../../Form/Base/index.module.less';
import CommonStyle from '../../../styles/common.module.less';
import type { UploadProps } from 'tdesign-react';

const { FormItem } = Form;

// 模拟设备数据
const DEVICE_OPTIONS = [
  { label: 'DEV001 - 主控制器', value: 'DEV001', customerName: '华为技术有限公司' },
  { label: 'DEV002 - 传感器模块', value: 'DEV002', customerName: '中兴通讯股份有限公司' },
  { label: 'DEV003 - 执行器单元', value: 'DEV003', customerName: '比亚迪股份有限公司' },
  { label: 'DEV004 - 通信模块', value: 'DEV004', customerName: '华为技术有限公司' },
  { label: 'DEV005 - 电源管理器', value: 'DEV005', customerName: '小米科技有限责任公司' },
];

interface IIOInspectionForm {
  deviceNumber: string;
  customerName: string;
  files: any[];
}

const AddIOInspectionPage: React.FC = () => {
  const navigate = useNavigate();
  const [form] = Form.useForm();
  const [formData, setFormData] = useState<IIOInspectionForm>({
    deviceNumber: '',
    customerName: '',
    files: [],
  });
  const [loading, setLoading] = useState(false);

  // 根据设备编号自动更新客户名称
  const handleDeviceChange = (value: any) => {
    const selectedDevice = DEVICE_OPTIONS.find(device => device.value === value);
    const customerName = selectedDevice?.customerName || '';
    
    setFormData(prev => ({
      ...prev,
      deviceNumber: String(value),
      customerName,
    }));
    
    form.setFieldsValue({
      deviceNumber: String(value),
      customerName,
    });
  };

  // 文件上传处理
  const handleFileChange = (files: any[]) => {
    setFormData(prev => ({ ...prev, files }));
  };

  // 文件验证处理
  const onValidate: UploadProps['onValidate'] = (params) => {
    const { files, type } = params;
    console.log('onValidate', params);
    if (type === 'FILE_OVER_SIZE_LIMIT') {
      MessagePlugin.warning(`${files.map((t) => t.name).join('、')} 等文件大小超出限制，已自动过滤`, 5000);
    } else if (type === 'FILES_OVER_LENGTH_LIMIT') {
      MessagePlugin.warning('文件数量超出限制，仅上传未超出数量的文件');
    }
  };

  // 格式化响应
  const formatResponse: UploadProps['formatResponse'] = (res) => {
    if (!res) {
      return { status: 'fail', error: '上传失败，原因：文件过大或网络不通' };
    }
    return res;
  };

  // 提交表单
  const handleSubmit = async () => {
    try {
      await form.validate();
      setLoading(true);
      
      // 模拟API调用
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      MessagePlugin.success('I/O点检工单创建成功！');
      navigate('/workorder/io-check');
    } catch (error) {
      console.error('表单验证失败:', error);
    } finally {
      setLoading(false);
    }
  };

  // 重置表单
  const handleReset = () => {
    form.reset();
    setFormData({
      deviceNumber: '',
      customerName: '',
      files: [],
    });
  };

  // 返回列表
  const handleBack = () => {
    navigate('/workorder/io-check');
  };

  return (
    <div className={`${CommonStyle.pageWithPadding} ${CommonStyle.pageWithColor}`}>
      <div className={Style.formContainer}>
        <div className={Style.titleText} style={{ marginBottom: 32 }}>I/O点检工单信息</div>
        
        <Form
          form={form}
          labelAlign='top'
          style={{ width: '100%' }}
          onReset={handleReset}
          onSubmit={handleSubmit}
        >
          <Row gutter={[32, 24]}>
            <Col span={6}>
              <FormItem
                label="设备编号"
                name="deviceNumber"
                rules={[
                  { required: true, message: '请选择设备编号' },
                ]}
              >
                <Select
                  value={formData.deviceNumber}
                  onChange={handleDeviceChange}
                  placeholder="请选择设备编号"
                  filterable
                  clearable
                  options={DEVICE_OPTIONS}
                />
              </FormItem>
            </Col>
            <Col span={6}>
              <FormItem
                label="客户名称"
                name="customerName"
              >
                <Input
                  value={formData.customerName}
                  placeholder="根据设备编号自动填充"
                  disabled
                />
              </FormItem>
            </Col>
          </Row>

          <FormItem
            label="文件导入"
            name="files"
            rules={[
              { required: true, message: '请上传检测文件' },
            ]}
          >
            <Upload
              files={formData.files}
              onChange={handleFileChange}
              action="https://service-bv448zsw-1257786608.gz.apigw.tencentcs.com/api/upload-demo"
              accept=".xls,.xlsx,.csv"
              placeholder="支持上传 .xls/.xlsx/.csv 格式文件，最多5个文件"
              theme="file-flow"
              multiple
              max={5}
              autoUpload={false}
              showThumbnail={false}
              allowUploadDuplicateFile={true}
              onValidate={onValidate}
              formatResponse={formatResponse}
            />
          </FormItem>

          <FormItem className={Style.buttonContainer}>
            <Space size="large">
              <Button
                theme="primary"
                type='submit'
                loading={loading}
              >
                提交
              </Button>
              <Button
                theme="default"
                variant="base"
                type='reset'
              >
                重置
              </Button>
              <Button
                theme="default"
                variant="base"
                onClick={handleBack}
              >
                返回
              </Button>
            </Space>
          </FormItem>
        </Form>
      </div>
    </div>
  );
};

export default AddIOInspectionPage;