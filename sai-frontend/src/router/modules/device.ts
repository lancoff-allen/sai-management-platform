import { lazy } from 'react';
import { ControlPlatformIcon } from 'tdesign-icons-react';
import { IRouter } from '../index';

const result: IRouter[] = [
  {
    path: '/device',
    meta: {
      title: '设备管理',
      Icon: ControlPlatformIcon,  // 从 AppIcon 改为 ControlPlatformIcon
    },
    children: [
      {
        path: 'list',
        Component: lazy(() => import('pages/Device/List')),
        meta: {
          title: '设备列表',
        },
      },
      {
        path: 'category',
        Component: lazy(() => import('pages/Device/Category')),
        meta: {
          title: '设备分类',
        },
      },
    ],
  },
];

export default result;