// 对局过程中的redux
import { createSlice } from '@reduxjs/toolkit'
import { PayloadAction } from '@reduxjs/toolkit/dist/createAction';
import type { Deck } from './deck';
import { ActionCard, ActionCardType, CostType } from '../type/card';
import { CharEntity, LogicRecord, RoundPhase, StartPhase, SummonsEntity, SupportEntity } from '../type/play';
import { decode, encode } from '../utils/share_code';
import actionCardData from '../data/action_card.json';

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
  /**
   * 对局开始后, 牌堆中的牌的列表
   */
  pileCards?: ActionCard[];
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
  currPhase?: RoundPhase,
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
    },
    // 初始化两个玩家的牌堆
    initPlayersPile: function(state) {
      const bokuDeck = state.bokuState.deck;
      const kimiDeck = state.kimiState.deck;
      const bokuActionIds = decode(bokuDeck?.deckCode || '').slice(3);
      const kimiActionIds = decode(kimiDeck?.deckCode || '').slice(3);
      const actionCardIdSet = new Set([...bokuActionIds, ...kimiActionIds]);
      const actionCardMap: Record<number, ActionCard> = {};
      for(let i = 0; i < actionCardData.length; i++) {
        const oneCard = actionCardData[i];
        if(actionCardIdSet.has(oneCard.id)) {
          actionCardMap[oneCard.id] = {
            ...oneCard,
            id: oneCard.id,
            name: oneCard.name,
            cost: oneCard.cost.map((oneCost) => ({
              type: oneCost.type as CostType,
              cost: oneCost.cost,
            })),
            type: oneCard.type as ActionCardType,
            cardType: 'action',
            tag: [],
          }
        }
      }
      state.bokuState.pileCards = bokuActionIds.map((id) => actionCardMap[id]);
      state.kimiState.pileCards = kimiActionIds.map((id) => actionCardMap[id]);
    },
    // 从牌堆随机抽牌
    drawCardsFromPile: function(state, action: PayloadAction<{
      player: PlayerName,
      count: number,
      type?: ActionCardType,
    }>) {
      // TODO: 洗牌并且抽牌
      // TODO: 从牌堆按要求抽牌
    },
    // TODO: 把牌放回牌堆

    // 开始对局, 产生一对新的StartPhase
    startDuel: function(state, action: PayloadAction<{offensive: PlayerName}>)  {
      // TODO: 如果是真实对局, 那么两人的StartPhase是同时开始的
      const { offensive } = action.payload;
      const offensiveStartPhase: StartPhase = {
        offensive: offensive,
        player: offensive,
        id: 0,
        name: '开始阶段_先手抽牌',
        isActive: true,
        record: []
      };
      const defensiveStartPhase: StartPhase = {
        offensive: offensive,
        player: offensive === 'boku' ? 'kimi' : 'boku',
        id: 0,
        name: '开始阶段_后手抽牌',
        isActive: false,
        record: []
      };
      state.currPhase = offensiveStartPhase;
      state.nextPhase = defensiveStartPhase;
    },
    // 朝当前阶段添加一条逻辑记录
    addRecordToCurrPhase: function(state, action: PayloadAction<{record: LogicRecord}>) {
      const { record } = action.payload;
      state.currPhase?.record.push(record);
    },
    goNextPhase: function(state, action: PayloadAction<{nextPhase: RoundPhase}>) {
      // TODO: 完成当前阶段, 跳到下一阶段
    },
  }
});

export const {
  setPlayerDeckCode,
  initPlayersChar,
  initPlayersPile,
  startDuel,
  addRecordToCurrPhase,
} = playSlice.actions
export default playSlice.reducer