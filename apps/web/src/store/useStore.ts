import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import { authSlice, type AuthSlice } from './slices/authSlice';
import { uiSlice, type UISlice } from './slices/uiSlice';

export type StoreState = AuthSlice & UISlice;

export const useStore = create<StoreState>()(
  devtools(
    (...a) => ({
      ...authSlice(...a),
      ...uiSlice(...a),
    }),
    {
      name: 'mathsolve-store',
    }
  )
);
