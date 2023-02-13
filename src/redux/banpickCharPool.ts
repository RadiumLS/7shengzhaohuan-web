import { createSlice, CreateSliceOptions } from '@reduxjs/toolkit'
import { PayloadAction } from '@reduxjs/toolkit/dist/createAction';

type BanpickChar = string;
let initialState: BanpickChar[] = [];

const banpickCharPoolSlice = createSlice({
  name: 'banpickCharPool',
  initialState,
  reducers: {
    createPool: function(state, action: PayloadAction<BanpickChar>) {
      state.push(action.payload);
    }
  }
});

export const { createPool } = banpickCharPoolSlice.actions
export default banpickCharPoolSlice.reducer