import { configureStore, combineReducers } from '@reduxjs/toolkit';
import { TypedUseSelectorHook, useSelector, useDispatch } from 'react-redux';

import global from './global';
import user from './user';
import listBase from './list/base';
import listSelect from './list/select';
import listCard from './list/card';
import deviceCategory from './device/category';
import deviceList from './device/list';
import customerListReducer from './customer/list';

const reducer = combineReducers({
  global,
  user,
  listBase,
  listSelect,
  listCard,
  deviceCategory,
  deviceList,
});

export const store = configureStore({
  reducer: {
    global,
    user,
    listBase,
    listSelect,
    listCard,
    deviceCategory,
    deviceList,
    customerList: customerListReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export const useAppDispatch = () => useDispatch<AppDispatch>();
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;

export default store;
