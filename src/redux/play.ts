// 对局过程中的redux
import { createSlice } from '@reduxjs/toolkit'
import { PayloadAction } from '@reduxjs/toolkit/dist/createAction';
import type { Deck } from './deck';
import { ActionCard } from '../type/card';

// TODO: 需要大量设计
/**
 * 骰子类型
 * @param Element 元素骰
 * @param omni 万能骰
 */
type Dice = Element | 'omni';
type Support = string;
/**
 * 对局中的玩家状态
 * @member deck 卡组
 */
interface PlayerState {
  deck: Deck,
  dice: Dice[],
  hand: ActionCard[],
}
// 用boku和kimi来指代两个玩家
// boku kimi
/**
 * 对局State
 * @param bokuDeck 本方的卡组
 * @param kimiDeck 对手方的卡组
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