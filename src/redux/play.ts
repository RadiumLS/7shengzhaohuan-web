// 对局过程中的redux
import { createSlice } from '@reduxjs/toolkit'
import { PayloadAction } from '@reduxjs/toolkit/dist/createAction';
import type { Deck } from './deck';
import { ActionCard, CostType } from '@src/type/card';
import {
  ActiveStateEntity, CharEntity, CharStateEntity,
  LogicEntity,
  LogicRecord, RoundPhase, StartPhase, SummonsEntity, SupportEntity, Trigger 
} from '@src/type/play';
import { decode } from '../utils/share_code';
import actionCardData from '../data/action_card.json';
import arrayShuffle from 'array-shuffle';
import { ActionCardType, PhaseType, TriggerType, Element } from '../type/enums';
import {getCharacterEntityClassById} from '../utils/entity_class';
import { rollRandomDice, sortDice } from '../utils/dice'

// TODO: 需要大量设计
/**
 * 骰子类型
 * @param Element 元素骰
 * @param omni 万能骰
 */
export type Dice = Element | 'omni';
// 要投掷的骰子类型
export type RollDice = Dice | 'random';
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
  activeCharIndex?: number,
  /**
   * 出战状态实体, 注意不是挂在角色上的状态
   */
  activeState: ActiveStateEntity[],
  /**
   * 对局开始后, 牌堆中的牌的列表
   */
  pileCards?: ActionCard[];
  /**
   * 起始手牌的替换区, 后续作弊的时候也可以使用这个
   */
  tempCards: ActionCard[];
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
export interface PlayState {
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
    activeState: [],
    tempCards: [],
  },
  kimiState: {
    dice: [],
    hand: [],
    support: [],
    summons: [],
    chars: [],
    activeState: [],
    tempCards: [],
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
      const characterClass = getCharacterEntityClassById(5);
      const bokuCharEntity = [0,1,2].map((index) => characterClass('boku', index));
      const kimiCharEntity = [0,1,2].map((index) => characterClass('kimi', index));

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
      const {player, count, type} = action.payload;
      const pool: ActionCard[] = [];
      const pile = player === 'boku' ? state.bokuState.pileCards : state.kimiState.pileCards;
      const drawCards: ActionCard[] = [];

      // 如果没有牌堆或者牌堆为空, 那么直接返回
      if(!pile || pile.length === 0) return;

      // 指定类型的情况下抽卡池的范围不同
      if(type) {
        pool.push(...(pile.filter((card) => card.type === type) || []));
      } else {
        pool.push(...(pile || []));
      }
      // 可抽选卡为空的时候直接返回不做任何处理
      if(pool.length > 0) {
        // 如果抽选卡的数量小于抽卡数量, 那么直接所有抽选卡进临时区
        if(pool.length <= count) {
          drawCards.push(...pool);
        } else {
          drawCards.push(...arrayShuffle(pool).slice(0, count));
        }
      }
      const newPile = [];
      const drawMarkCards: (ActionCard & {markDraw: boolean})[] = drawCards.map((card) => ({...card, markDraw: false}));
      for(let i = 0; i < (pile.length || 0); i++) {
        const oneCard = pile[i];
        let isDraw = false;
        for(let j = 0; j < drawMarkCards.length; j++) {
          const oneDrawCard = drawMarkCards[j];
          if(oneCard.id === oneDrawCard.id && oneDrawCard.markDraw === false) {
            oneDrawCard.markDraw = true;
            isDraw = true;
            break;
          }
        }
        if(!isDraw) newPile.push(oneCard);
      }

      if(player === 'boku') {
        state.bokuState.tempCards.push(...drawCards);
        state.bokuState.pileCards = newPile;
      } else {
        state.kimiState.tempCards.push(...drawCards);
        state.kimiState.pileCards = newPile;
      }
    },
    /**
     * 丢弃临时区的牌, 以index为参数 
     */
    dropTempCards: function(state, action: PayloadAction<{player: PlayerName, indexs: number[]}>) {
      const { player, indexs } = action.payload;
      const originTempCards: (ActionCard & {markDrop?: boolean})[] = [];
      originTempCards.push(...(player === 'boku' ? state.bokuState.tempCards : state.kimiState.tempCards));
      for(let i = 0; i < indexs.length; i++) {
        originTempCards[indexs[i]].markDrop = true;
      }
      const newTempCards:ActionCard[] = [];
      for(let i = 0; i < originTempCards.length; i++) {
        if(!originTempCards[i].markDrop) {
          newTempCards.push(originTempCards[i]);
        }
      }
      if(player === 'boku') {
        state.bokuState.tempCards = newTempCards;
      } else {
        state.kimiState.tempCards = newTempCards;
      }
    },
    /**
     * 直接增加卡牌到临时区, 可以用于作弊
     */
    pushTempCards: function(state, action: PayloadAction<{player: PlayerName, cards: ActionCard[]}>) {
      // TODO:
    },
    // 把牌放回牌堆
    returnCardsToPile: function(state, action: PayloadAction<{player: PlayerName, cards: ActionCard[]}>) {
      const {player, cards} = action.payload;
      if(player === 'boku') {
        state.bokuState.pileCards?.push(...cards);
      } else {
        state.kimiState.pileCards?.push(...cards);
      }
    },
    // 增加卡牌到手牌
    pushHandCards: function(state, action: PayloadAction<{player: PlayerName, cards: ActionCard[]}>) {
      const {player, cards} = action.payload;
      if(player === 'boku') {
        state.bokuState.hand.push(...cards);
      } else {
        state.kimiState.hand.push(...cards);
      }
    },

    // 开始对局, 产生一对新的StartPhase
    startDuel: function(state, action: PayloadAction<{offensive: PlayerName}>)  {
      // TODO: 如果是真实对局, 那么两人的StartPhase是同时开始的
      const { offensive } = action.payload;
      const offensiveStartPhase: StartPhase = {
        offensive: offensive,
        player: offensive,
        id: 0,
        name: '开始阶段_先手抽牌',
        type: PhaseType.StartDraw,
        // type: PhaseType.StartDraw,
        isActive: true,
        isDone: false,
        record: []
      };
      state.currPhase = offensiveStartPhase;
    },
    // 朝当前阶段添加一条逻辑记录
    addRecordToCurrPhase: function(state, action: PayloadAction<{record: LogicRecord}>) {
      const { record } = action.payload;
      state.currPhase?.record.push(record);
    },
    goNextPhase: function(state, action: PayloadAction<{nextPhase: RoundPhase}>) {
      // TODO: 完成当前阶段, 跳到下一阶段
      const currPhase = state.currPhase;
      if(currPhase) {
        currPhase.isDone = true;
        currPhase.isActive = false;
        state.historyPhase.push(currPhase);
      }
      const nextPhase = action.payload.nextPhase;
      nextPhase.isActive = true;
      nextPhase.isDone = false;
      state.currPhase = nextPhase;
    },
    switchChar: function(state, action: PayloadAction<{player: PlayerName, charIndex: number}>) {
      const { player, charIndex } = action.payload;
      if(player === 'boku') {
        state.bokuState.activeCharIndex = charIndex;
      } else {
        state.kimiState.activeCharIndex = charIndex;
      }
    },
    // 开局阶段投掷骰子, 注意和重新投掷是有区别的
    rollDice: function(state, action: PayloadAction<{
      player: PlayerName,
      count: number,
      diceType?: RollDice,
    }>) {
      const { player, count, diceType } = action.payload;
      const chars = player === 'boku' ? state.bokuState.chars : state.kimiState.chars;
      const priorElements = chars.reduce((prev: Element[], char) => {
        return prev.concat(char.element ? char.element : [])
      }, []);
      const rollResult: Dice[] = [];
      if(diceType === 'random' || diceType === undefined) {
        rollResult.push(...(sortDice(rollRandomDice(count), priorElements)));
      } else {
        rollResult.push(...(new Array(count).fill(diceType)));
      }
      if(player === 'boku') {
        state.bokuState.dice.push(...rollResult);
      } else {
        state.kimiState.dice.push(...rollResult);
      }
    },
    // 重新投掷骰子, 在回合开始投掷阶段或者由于乾坤一掷等卡牌触发
    rerollDice: function(state, action: PayloadAction<{
      player: PlayerName,
      reroolIndexs: number[],
    }>) {
      const { player, reroolIndexs } = action.payload;
      const chars = player === 'boku' ? state.bokuState.chars : state.kimiState.chars;
      const priorElements = chars.reduce((prev: Element[], char) => {
        return prev.concat(char.element ? char.element : [])
      }, []);
      const originDice = player === 'boku' ? state.bokuState.dice : state.kimiState.dice;
      const keepDice = originDice.filter((dice, index) => !reroolIndexs.includes(index));
      const newDice = rollRandomDice(reroolIndexs.length);
      const sortedDices = sortDice([...keepDice, ...newDice], priorElements)
      if(player === 'boku') {
        state.bokuState.dice = sortedDices;
      } else {
        state.kimiState.dice = sortedDices;
      }
    },
    // 开始处理一个逻辑帧
    beginFrame: function(state, action: PayloadAction<{startAction: PayloadAction[]}>) {
      // 注意, 这里是逻辑帧的起始, 也就是说, 一个逻辑帧可能会有多个action
      // 但是, 这些action是按照顺序处理的
      const { startAction } = action.payload;
      // TODO: 这里先提出一个抽象的函数
      // 这个函数会将遍历全部的entity列表, 然后提取对应的trigger去处理 一个action
      const xxFunc: (action: PayloadAction[]) => PayloadAction[] = (actions: PayloadAction[]) => {
        return actions;
      };
    },
    // 创建角色状态
    createCharState: function(state, action: PayloadAction<{charStateEntity: CharStateEntity, charIndex: number}>) {
      const { charStateEntity, charIndex } = action.payload;
      const { player } = charStateEntity;
      const targetChar = player === 'boku' ? state.bokuState.chars[charIndex] : state.kimiState.chars[charIndex];
      targetChar.charState.push(charStateEntity);
    },
  }
});

export const {
  setPlayerDeckCode,
  initPlayersChar,
  initPlayersPile,
  dropTempCards,
  startDuel,
  addRecordToCurrPhase,
  drawCardsFromPile,
  returnCardsToPile,
  pushHandCards,
  createCharState,
  goNextPhase,
  switchChar,
  rollDice,
  rerollDice,
} = playSlice.actions
export const getAllEntity = (state: Readonly<PlayState>) => {
  // XXX: 可能要考虑Entity的顺序问题……或许需要给Trigger增加优先级？
  const allEntity: LogicEntity[] = [];
  for(let i = 0; i < 3; i++) {
    const bokuOneChar = state.bokuState.chars[i];
    const kimiOneChar = state.kimiState.chars[i];

    allEntity.push(bokuOneChar);
    allEntity.push(...bokuOneChar.charState);
    bokuOneChar.equipment && allEntity.push(bokuOneChar.equipment);
    bokuOneChar.talent && allEntity.push(bokuOneChar.talent);
    bokuOneChar.weapon && allEntity.push(bokuOneChar.weapon);

    allEntity.push(kimiOneChar);
    allEntity.push(...kimiOneChar.charState);
    kimiOneChar.equipment && allEntity.push(kimiOneChar.equipment);
    kimiOneChar.talent && allEntity.push(kimiOneChar.talent);
    kimiOneChar.weapon && allEntity.push(kimiOneChar.weapon);
  }
  allEntity.push(...state.bokuState.activeState);
  allEntity.push(...state.kimiState.activeState);
  allEntity.push(...state.bokuState.support);
  allEntity.push(...state.kimiState.support);
  allEntity.push(...state.bokuState.summons);
  allEntity.push(...state.kimiState.summons);

  return allEntity;
}
// 遍历allEntity, 然后根据指定的trigger来处理并返回action列表
export const computeTriggerActions = (state: Readonly<PlayState>, triggerType: TriggerType, initActions: PayloadAction<unknown>[]) => {
  const allEntity = getAllEntity(state);
  const allTrigger = [];
  for(let i = 0; i < allEntity.length; i++) {
    allTrigger.push(...(allEntity[i].triggerMap[triggerType] || []));
  }
  const allActions = allTrigger.reduce((prevActions, trigger) => {
    return trigger(state, prevActions);
  }, initActions);

  return allActions;
}

export default playSlice.reducer