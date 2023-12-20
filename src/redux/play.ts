// 对局过程中的redux
import { createSlice } from '@reduxjs/toolkit'
import { PayloadAction } from '@reduxjs/toolkit/dist/createAction';
import type { Deck } from './deck';
import { ActionCard } from '../type/card';
import { CharEntity, RoundPhase, SummonsEntity, SupportEntity } from '../type/play';
import { decode, encode } from '../utils/share_code';

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
    initPlayersChar: function(state)  {
      // TODO: 开始游玩之前从Deck初始化两人的英雄状态
      const bokuDeck = state.bokuState.deck;
      const kimiDeck = state.kimiState.deck;
      const bokuCharIds = decode(bokuDeck?.deckCode || '').slice(0,3);
      const kimiCharIds = decode(kimiDeck?.deckCode || '').slice(0,3);
      // TODO: 角色牌可能有自身的角色状态
      // TODO: 根据角色牌的血量等信息进行初始化
      // XXX: 这里先写假的, 方便调组件使用
      const bokuCharEntity = bokuCharIds.map((charId, index) => {
        return {
          id: charId,
          name: `开发角色_${index}`,
          health: 10,
          energy: 0,
          charState: [],
          appledElement: [],
        };
      })
      const kimiCharEntity = kimiCharIds.map((charId, index) => {
        return {
          id: charId,
          name: `开发角色_${index}`,
          health: 10,
          energy: 0,
          charState: [],
          appledElement: [],
        }
      })
      state.bokuState.chars = bokuCharEntity;
      state.kimiState.chars = kimiCharEntity;
    }
  }
});

export const {
  setPlayerDeckCode,
  initPlayersChar,
} = playSlice.actions
export default playSlice.reducer