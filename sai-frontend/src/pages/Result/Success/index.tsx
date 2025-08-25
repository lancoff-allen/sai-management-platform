import React, { memo } from 'react';
import { Button } from 'tdesign-react';
import { CheckCircleIcon } from 'tdesign-icons-react';
import { useNavigate, useLocation } from 'react-router-dom';

import style from './index.module.less';

interface SuccessState {
  title?: string;
  description?: string;
  customerName?: string;
}

const Success = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const state = location.state as SuccessState || {};
  
  const {
    title = '项目已创建成功',
    description = '可以联系负责人分发应用',
    customerName
  } = state;

  const handlePrimaryAction = () => {
    // 根据不同场景执行主要操作
    if (customerName) {
      // 客户场景：继续新增客户
      navigate('/customer/add-customer');
    } else {
      // 默认场景：返回首页
      navigate('/');
    }
  };

  const handleSecondaryAction = () => {
    // 根据不同场景执行次要操作
    if (customerName) {
      // 客户场景：返回客户列表
      navigate('/customer/list');
    } else {
      // 原有的查看进度逻辑
      console.log('查看进度');
    }
  };

  return (
    <div className={style.Content}>
      <CheckCircleIcon className={style.icon} />
      <div className={style.title}>{title}</div>
      <div className={style.description}>
        {customerName ? `客户 "${customerName}" 已成功创建！${description}` : description}
      </div>
      <div>
        <Button theme='primary' onClick={handlePrimaryAction}>
          {customerName ? '继续新增' : '返回首页'}
        </Button>
        <Button className={style.rightButton} theme='default' onClick={handleSecondaryAction}>
          {customerName ? '返回客户列表' : '查看进度'}
        </Button>
      </div>
    </div>
  );
};

export default memo(Success);
