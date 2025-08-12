import { lazy } from 'react';
import { UsergroupIcon } from 'tdesign-icons-react';
import { IRouter } from '../index';

const result: IRouter[] = [
  {
    path: '/customer',
    Component: lazy(() => import('pages/Result/Maintenance')),
    meta: {
      title: '客户管理',
      Icon: UsergroupIcon,
    },
  },
];

export default result;