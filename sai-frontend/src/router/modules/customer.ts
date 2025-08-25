import { lazy } from 'react';
import { UserIcon } from 'tdesign-icons-react';
import { IRouter } from '../index';

const result: IRouter[] = [
  {
    path: '/customer',
    meta: {
      title: '客户管理',
      Icon: UserIcon,
    },
    children: [
      {
        path: 'list',
        Component: lazy(() => import('pages/Customer/List')),
        meta: {
          title: '客户列表',
        },
      },
      {
        path: 'add-customer',
        Component: lazy(() => import('pages/Customer/AddCustomer')),
        meta: {
          title: '新增客户',
          hidden: true,  // 添加这行，隐藏菜单项
        },
      },
      {
        path: 'success',
        Component: lazy(() => import('pages/Result/Success')),
        meta: {
          title: '操作成功',
          hidden: true,  // 隐藏菜单项
        },
      },
    ],
  },
];

export default result;