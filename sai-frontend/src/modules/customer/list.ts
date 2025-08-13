import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { RootState } from '../store';
import { getCustomerList, ICustomer, ICustomerListParams } from 'services/customer';

const namespace = 'customer/list';

interface IInitialState {
  loading: boolean;
  current: number;
  pageSize: number;
  total: number;
  customerList: ICustomer[];
}

const initialState: IInitialState = {
  loading: false,
  current: 1,
  pageSize: 10,
  total: 0,
  customerList: [],
};

export const getList = createAsyncThunk(
  `${namespace}/getList`,
  async (params: ICustomerListParams) => {
    const response = await getCustomerList(params);
    return response;
  },
);

const customerListSlice = createSlice({
  name: namespace,
  initialState,
  reducers: {
    clearPageState: (state) => {
      Object.assign(state, initialState);
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getList.pending, (state) => {
        state.loading = true;
      })
      .addCase(getList.fulfilled, (state, action) => {
        state.loading = false;
        state.customerList = action.payload.list;
        state.total = action.payload.total;
      })
      .addCase(getList.rejected, (state) => {
        state.loading = false;
      });
  },
});

export const { clearPageState } = customerListSlice.actions;

export const selectCustomerList = (state: RootState) => state.customerList;

export default customerListSlice.reducer;