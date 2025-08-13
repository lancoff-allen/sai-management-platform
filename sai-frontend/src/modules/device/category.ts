import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { RootState } from '../store';
import { getDeviceCategoryList, IDeviceCategory } from 'services/device';

const namespace = 'device/category';

interface IInitialState {
  pageLoading: boolean;
  loading: boolean;
  current: number;
  pageSize: number;
  total: number;
  categoryList: IDeviceCategory[];
}

const initialState: IInitialState = {
  pageLoading: true,
  loading: true,
  current: 1,
  pageSize: 12,
  total: 0,
  categoryList: [],
};

export const getList = createAsyncThunk(
  `${namespace}/getList`,
  async (params: { pageSize: number; current: number }) => {
    const { pageSize, current } = params;
    const result = await getDeviceCategoryList({
      pageSize,
      current,
    });
    return {
      list: result?.list,
      total: result?.total,
      pageSize: params.pageSize,
      current: params.current,
    };
  },
);

const deviceCategorySlice = createSlice({
  name: namespace,
  initialState,
  reducers: {
    clearPageState: () => initialState,
    switchPageLoading: (state, action: PayloadAction<boolean>) => {
      state.pageLoading = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getList.pending, (state) => {
        state.loading = true;
      })
      .addCase(getList.fulfilled, (state, action) => {
        state.loading = false;
        state.categoryList = action.payload?.list;
        state.total = action.payload?.total;
        state.pageSize = action.payload?.pageSize;
        state.current = action.payload?.current;
      })
      .addCase(getList.rejected, (state) => {
        state.loading = false;
      });
  },
});

export const { clearPageState, switchPageLoading } = deviceCategorySlice.actions;

export const selectDeviceCategory = (state: RootState) => state.deviceCategory;

export default deviceCategorySlice.reducer;