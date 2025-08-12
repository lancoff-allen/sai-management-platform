import { lazy } from 'react';
import { AppIcon } from 'tdesign-icons-react';
import { IRouter } from '../index';

const result: IRouter[] = [
  {
    path: '/device',
    meta: {
      title: '设备管理',
      Icon: AppIcon,
    },
    children: [
      {
        path: 'list',
        Component: lazy(() => import('pages/Result/Maintenance')),
        meta: {
          title: '设备列表',
        },
      },
      {
        path: 'category',
        Component: lazy(() => import('pages/Result/Maintenance')),
        meta: {
          title: '设备分类管理',
        },
      },
    ],
  },
];

export default result;