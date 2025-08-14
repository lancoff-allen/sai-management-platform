import React, { memo, useEffect } from 'react';
import { Drawer, Layout } from 'tdesign-react';
import throttle from 'lodash/throttle';
import { useAppSelector, useAppDispatch } from 'modules/store';
import { selectGlobal, toggleSetting, toggleMenu, ELayout, switchTheme, openSystemTheme } from 'modules/global';
import Setting from './components/Setting';
import AppLayout from './components/AppLayout';
import Style from './index.module.less';

export default memo(() => {
  const globalState = useAppSelector(selectGlobal);
  const dispatch = useAppDispatch();

  const AppContainer = AppLayout[globalState.isFullPage ? ELayout.fullPage : globalState.layout];

  useEffect(() => {
    // 如果开启了跟随系统主题，则调用 openSystemTheme
    if (globalState.systemTheme) {
      dispatch(openSystemTheme());
      
      // 添加系统主题变化监听器
      const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
      const handleSystemThemeChange = (e: MediaQueryListEvent) => {
        if (globalState.systemTheme) {
          dispatch(openSystemTheme());
        }
      };
      
      // 添加监听器
      mediaQuery.addEventListener('change', handleSystemThemeChange);
      
      // 清理函数
      return () => {
        mediaQuery.removeEventListener('change', handleSystemThemeChange);
      };
    } else {
      dispatch(switchTheme(globalState.theme));
    }
  }, [globalState.systemTheme]); // 依赖 systemTheme 状态

  useEffect(() => {
    const handleResize = throttle(() => {
      if (window.innerWidth < 900) {
        dispatch(toggleMenu(true));
      } else if (window.innerWidth > 1000) {
        dispatch(toggleMenu(false));
      }
    }, 100);
    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  return (
    <Layout className={Style.panel}>
      <AppContainer />
      <Drawer
        destroyOnClose
        visible={globalState.setting}
        size='458px'
        footer={false}
        header='页面配置'
        onClose={() => dispatch(toggleSetting())}
      >
        <Setting />
      </Drawer>
    </Layout>
  );
});
