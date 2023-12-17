// 对局过程中的redux
import { createSlice } from '@reduxjs/toolkit'
import { PayloadAction } from '@reduxjs/toolkit/dist/createAction';

// TODO: 需要大量设计
/**
 * 对局State
 */
interface PlayState {
}

const loadFromLocalStorage = () => {
  //TODO: 从localStorage中读取对局信息
}

/**
 * TODO: 保存到localStorage
 * @param state 
 */
const saveToLocalStorage = () => {
}

let initialState: PlayState = {
};

const playSlice = createSlice({
  name: 'play',
  initialState,
  reducers: {
  }
});

export const {
} = playSlice.actions
export default playSlice.reducer