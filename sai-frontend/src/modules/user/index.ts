import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { RootState } from '../store';
import { loginApi, logoutApi, getUserInfoApi, LoginRequest } from 'services/auth';

const namespace = 'user';
const TOKEN_NAME = 'tdesign-starter';

const initialState = {
  token: localStorage.getItem(TOKEN_NAME) || '',
  userInfo: {},
  loading: false,
  error: null as string | null,
};

// 登录异步 action
export const login = createAsyncThunk(
  `${namespace}/login`,
  async (userInfo: { account: string; password: string; tenantCode?: string }) => {
    const loginParams: LoginRequest = {
      username: userInfo.account,
      password: userInfo.password,
      tenantCode: userInfo.tenantCode || 'default', // 默认租户
    };
    
    const response = await loginApi(loginParams);
    return response;
  }
);

// 登出异步 action
export const logout = createAsyncThunk(
  `${namespace}/logout`,
  async (_, { getState }) => {
    const state = getState() as RootState;
    if (state.user.token) {
      await logoutApi();
    }
    localStorage.removeItem(TOKEN_NAME);
  }
);

// 获取用户信息异步 action
export const getUserInfo = createAsyncThunk(
  `${namespace}/getUserInfo`,
  async (_, { getState }) => {
    const state = getState() as RootState;
    if (!state.user.token) {
      throw new Error('No token available');
    }
    
    const userInfo = await getUserInfoApi();
    return userInfo;
  }
);

const userSlice = createSlice({
  name: namespace,
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    setToken: (state, action) => {
      state.token = action.payload;
      localStorage.setItem(TOKEN_NAME, action.payload);
    },
  },
  extraReducers: (builder) => {
    builder
      // 登录相关
      .addCase(login.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(login.fulfilled, (state, action) => {
        state.loading = false;
        state.token = action.payload.token;
        state.userInfo = action.payload.userInfo || {};
        localStorage.setItem(TOKEN_NAME, action.payload.token);
      })
      .addCase(login.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || '登录失败';
      })
      // 登出相关
      .addCase(logout.fulfilled, (state) => {
        state.token = '';
        state.userInfo = {};
        state.error = null;
      })
      // 获取用户信息相关
      .addCase(getUserInfo.fulfilled, (state, action) => {
        state.userInfo = action.payload;
      });
  },
});

export const selectUser = (state: RootState) => state.user;
export const { clearError, setToken } = userSlice.actions;

export default userSlice.reducer;
