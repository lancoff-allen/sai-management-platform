import { lazy } from 'react';
import { ControlPlatformIcon } from 'tdesign-icons-react';
import { IRouter } from '../index';

const result: IRouter[] = [
  {
    path: '/device',
    meta: {
      title: '设备管理',
      Icon: ControlPlatformIcon,
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
        path: 'add-device',
        Component: lazy(() => import('pages/Device/AddDevice')),
        meta: {
          title: '新增设备',
          hidden: true,
        },
      },
      {
        path: 'category',
        Component: lazy(() => import('pages/Device/Category')),
        meta: {
          title: '设备分类',
        },
      },
      // 后续添加新增设备分类路由
      // {
      //   path: 'add-category',
      //   Component: lazy(() => import('pages/Device/AddCategory')),
      //   meta: {
      //     title: '新增设备分类',
      //     hidden: true,
      //   },
      // },
    ],
  },
];

export default result;