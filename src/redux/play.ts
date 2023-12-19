// 对局过程中的redux
import { createSlice } from '@reduxjs/toolkit'
import { PayloadAction } from '@reduxjs/toolkit/dist/createAction';
import type { Deck } from './deck';
import { ActionCard } from '../type/card';
import { CharEntity, RoundPhase, SummonsEntity, SupportEntity } from '../type/play';

// TODO: 需要大量设计
/**
 * 骰子类型
 * @param Element 元素骰
 * @param omni 万能骰
 */
type Dice = Element | 'omni';
export type PlayerName = 'boku' | 'kimi';
/**
 * 对局中的玩家状态
 * @member deck 卡组
 */
interface PlayerState {
  deck?: Deck,
  dice: Dice[],
  hand: ActionCard[],
  support: SupportEntity[],
  summons: SummonsEntity[],
  chars: CharEntity[],
}
// 用boku和kimi来指代两个玩家
// boku kimi
/**
 * 对局State
 * @member bokuDeck 本方的卡组
 * @member kimiDeck 对手方的卡组
 * @member historyPhase 对局历史, 以阶段为单位
 * @member nextPhase 下个阶段
 */
interface PlayState {
  bokuState: PlayerState,
  kimiState: PlayerState,
  historyPhase: RoundPhase[],
  nextPhase?: RoundPhase,
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
  bokuState: {
    dice: [],
    hand: [],
    support: [],
    summons: [],
    chars: [],
  },
  kimiState: {
    dice: [],
    hand: [],
    support: [],
    summons: [],
    chars: [],
  },
  historyPhase: [],
};

const playSlice = createSlice({
  name: 'play',
  initialState,
  reducers: {
    setPlayerDeckCode: function(state, action: PayloadAction<{deck: Deck, player: PlayerName}>) {
      const { deck, player } = action.payload;
      if(player === 'boku') {
        state.bokuState.deck = { ...deck };
      } else {
        state.kimiState.deck = { ...deck };
      }
    },
  }
});

export const {
  setPlayerDeckCode,
} = playSlice.actions
export default playSlice.reducer