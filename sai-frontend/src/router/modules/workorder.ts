import { lazy } from 'react';
import { FileIcon } from 'tdesign-icons-react';
import { IRouter } from '../index';

const result: IRouter[] = [
  {
    path: '/workorder',
    meta: {
      title: '工单管理',
      Icon: FileIcon,
    },
    children: [
      {
        path: 'io-check',
        Component: lazy(() => import('pages/IOInspection/List')),
        meta: {
          title: 'I/O点检',
        },
      },
      {
        path: 'io-check/add',
        Component: lazy(() => import('pages/IOInspection/AddIOInspection')),
        meta: {
          title: '新增I/O点检工单',
          hidden: true,
        },
      },
      {
        path: 'single-action-check',
        Component: lazy(() => import('pages/Result/Maintenance')),
        meta: {
          title: '单动点检',
        },
      },
      {
        path: 'no-load-check',
        Component: lazy(() => import('pages/Result/Maintenance')),
        meta: {
          title: '空载联动',  // 修改：空负荷联动 → 空载联动
        },
      },
      {
        path: 'deviation-check',
        Component: lazy(() => import('pages/Result/Maintenance')),
        meta: {
          title: '纠偏点检',
        },
      },
    ],
  },
];

export default result;