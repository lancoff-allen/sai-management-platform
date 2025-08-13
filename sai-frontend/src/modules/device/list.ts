import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { RootState } from '../store';
import { getDeviceList, IDevice, IDeviceListParams } from 'services/device';

const namespace = 'device/list';

interface IInitialState {
  loading: boolean;
  current: number;
  pageSize: number;
  total: number;
  deviceList: IDevice[];
}

const initialState: IInitialState = {
  loading: true,
  current: 1,
  pageSize: 10,
  total: 0,
  deviceList: [],
};

export const getList = createAsyncThunk(
  `${namespace}/getDeviceList`,
  async (params: IDeviceListParams) => {
    const result = await getDeviceList(params);
    return {
      list: result?.list,
      total: result?.total,
      pageSize: params.pageSize,
      current: params.current,
    };
  },
);

const deviceListSlice = createSlice({
  name: namespace,
  initialState,
  reducers: {
    clearPageState: () => initialState,
  },
  extraReducers: (builder) => {
    builder
      .addCase(getList.pending, (state) => {
        state.loading = true;
      })
      .addCase(getList.fulfilled, (state, action) => {
        state.loading = false;
        state.deviceList = action.payload?.list;
        state.total = action.payload?.total;
        state.pageSize = action.payload?.pageSize;
        state.current = action.payload?.current;
      })
      .addCase(getList.rejected, (state) => {
        state.loading = false;
      });
  },
});

export const { clearPageState } = deviceListSlice.actions;

export const selectDeviceList = (state: RootState) => state.deviceList;

export default deviceListSlice.reducer;