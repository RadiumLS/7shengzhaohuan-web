// 对局过程中的redux
import { createSlice } from '@reduxjs/toolkit'
import { PayloadAction } from '@reduxjs/toolkit/dist/createAction';
import type { Deck } from './deck';
import { ActionCard, CardCost, CostType } from '@src/type/card';
import {
  ActiveStateEntity, CharEntity, CharStateEntity,
  Damage,
  DamageChange,
  DeltaCost,
  HistoryMessage,
  LogicEntity,
  LogicRecord, RoundPhase, Skill, StartPhase, SummonsEntity, SupportEntity, Trigger 
} from '@src/type/play';
import { decode } from '../utils/share_code';
import actionCardData from '../data/action_card.json';
import arrayShuffle from 'array-shuffle';
import { ActionCardType, PhaseType, TriggerType, Element } from '../type/enums';
import {getCharacterEntityClassById} from '../utils/entity_class';
import { rollRandomDice, sortDice } from '../utils/dice'
import { spellDices } from './../utils/dice';

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

let globalEntityId = 0;
export const getEntityId = () => {
  return globalEntityId++;
}
export const resetEntityId = () => {
  globalEntityId = 0;
}


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
  /** 使用技能/卡牌需要消耗的骰子, 配合骰子选择器使用 */
  requireCost?: CardCost;
  /** 当前要使用的卡牌 */
  activeCard?: ActionCard;
  /** 当前要使用的技能 */
  activeSkill?: Skill;
  /** 生效了的费用变化实体id */
  effectedCostEntityIds?: number[];
  /** 有人倒下的回合数的列表 */
  charDownRounds: number[];
  /** 需要进行倒下切人的标记 */
  charDownNeedSwitch?: boolean;
  /** 连续行动的标志量 */
  continueActionFlag?: boolean,
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
  /** 临时阶段, 注意用于角色倒下后的切换角色 */
  tempPhase?: RoundPhase,
  historyMessages: HistoryMessage[],
  costMessages?: HistoryMessage[],
  damageMessages?: HistoryMessage[],
  /** 估算的伤害 */
  estimateDamages?: Damage[],
  /** 结算中的action */
  processingAction?: PayloadAction<unknown>,
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
    charDownRounds: [],
    continueActionFlag: true,
  },
  kimiState: {
    dice: [],
    hand: [],
    support: [],
    summons: [],
    chars: [],
    activeState: [],
    tempCards: [],
    charDownRounds: [],
  },
  historyPhase: [],
  historyMessages: [],
};

const playSlice = createSlice({
  name: 'play',
  initialState,
  reducers: {
    appendHistoryMessages: function(state, action: PayloadAction<{messages: HistoryMessage[]}>) {
      const { messages } = action.payload;
      state.historyMessages.push(...messages);
    },
    setCostMessages: function(state, action: PayloadAction<HistoryMessage[]>) {
      const messages = action.payload;
      state.costMessages = messages;
    },
    setDamageMessages: function(state, action: PayloadAction<HistoryMessage[]>) {
      const messages = action.payload;
      state.damageMessages = messages;
    },
    setEstimateDamages: function(state, action: PayloadAction<Damage[]>) {
      const damages = action.payload;
      state.estimateDamages = damages;
    },
    setProcessingAction: function(state, action: PayloadAction<PayloadAction<unknown>>) {
      const processingAction = action.payload;
      state.processingAction = processingAction;
    },
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
        round: 0,
        name: '开始阶段_先手抽牌',
        type: PhaseType.StartDraw,
        // type: PhaseType.StartDraw,
        isActive: true,
        isDone: false,
        record: []
      };
      state.currPhase = offensiveStartPhase;
      // 重置了对局消息
      state.historyMessages = [{
        message: `对局开始, 先手方为${offensive === 'boku' ? '我方' : '对方'}`,
      }];
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
        state.bokuState.charDownNeedSwitch = false;
      } else {
        state.kimiState.activeCharIndex = charIndex;
        state.kimiState.charDownNeedSwitch = false;
      }
    },
    // 直接设置玩家的骰子
    setDice: function(state, action: PayloadAction<{
      player: PlayerName,
      dices: Dice[],
    }>) {
      const {player, dices} = action.payload;
      const playerState = player === 'boku' ? state.bokuState : state.kimiState;
      playerState.dice = dices;
      state.historyMessages.push({
        message: `${player === 'boku' ? '我方' : '对方'}的骰子为${spellDices(dices)}`,
      });
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
    changeCost: function(state, action:PayloadAction<DeltaCost>) {
      // XXX: 这个changeCost更主要的是为了产生一个约定好的action用于dispatch
      // 所以这个这里的处理反而是空的
    },
    changeDamage: function(state, action:PayloadAction<DamageChange>) {
      // XXX: 这个changeDamage更主要的是为了产生一个约定好的action用于dispatch
      // 所以这个这里的处理反而是空的
    },
    /** 设定需求的骰子数给骰子选择器使用 */
    setRequireCost: function(state, action:PayloadAction<{
      player: PlayerName, 
      requireCost: CardCost,
    }>) {
      const { player, requireCost }= action.payload;
      if(player === 'boku') {
        state.bokuState.requireCost = requireCost;
      } else {
        state.kimiState.requireCost = requireCost;
      }
    },
    /** 设定当前选中将要使用的技能 */
    setActiveSkill: function(state, action: PayloadAction<{
      player: PlayerName, 
      activeSkill: Skill,
    }>) {
      const { player, activeSkill }= action.payload;
      // XXX: 注意, 这里传递的技能的费用信息是不可靠的
      if(player === 'boku') {
        state.bokuState.activeSkill = activeSkill;
      } else {
        state.kimiState.activeSkill = activeSkill;
      }
    },
    /** 将要使用的技能置为空 */
    unsetActiveSkill: function(state, action: PayloadAction<{
      player: PlayerName, 
    }>) {
      const { player }= action.payload;
      // XXX: 注意, 这里传递的技能的费用信息是不可靠的
      if(player === 'boku') {
        state.bokuState.activeSkill = undefined;
      } else {
        state.kimiState.activeSkill = undefined;
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
    // 造成伤害
    dealDamage: function(state, action: PayloadAction<Damage>) {
      const damage = action.payload;
      // 目前只有角色可以受到伤害, 其他的都是消耗层数/可用次数
      const allChar = [...state.bokuState.chars, ...state.kimiState.chars]
      for(let i = 0; i < allChar.length; i++) {
        const char = allChar[i];
        if(char.id === damage.target) {
          char.health -= damage.point;
          // 血量不会降低到0以下
          if(char.health <= 0) {
            char.health = 0;
            // XXX: 角色的倒下在技能结算后处理, 这里只处理血量变化
          }
          break;
        }
      }
    },
    // 将角色置为倒下
    setCharDown: function(state, action: PayloadAction<{charId: number}>) {
      const downCharId = action.payload.charId;
      const allChar = [...state.bokuState.chars, ...state.kimiState.chars]
      const downChar = allChar.find((char) => char.id === downCharId);
      if(downChar) {
        downChar.isDown = true;
        downChar.charState = [];
        downChar.weapon = undefined;
        downChar.equipment = undefined;
        downChar.talent = undefined;
        downChar.energy = 0;
        const playerState = downChar.player === 'boku' ? state.bokuState : state.kimiState;
        // 额外标记对应方有人倒下的回合数
        playerState.charDownRounds.push(state.currPhase?.round || 0);
        const aliveChars = playerState.chars.filter((char) => !char.isDown);
        if(aliveChars.length > 1) {
          playerState.charDownNeedSwitch = true;
        } else if(aliveChars.length === 1) {
          playerState.activeCharIndex = aliveChars[0].index;
        } else if(aliveChars.length === 0) {
          // TODO: 都倒下了, 进入胜负判定阶段
        }
      }
    },
    // 附着元素, 注意, 这里是直接修改附着元素, 不是处理元素反应
    appendElement: function(state, action: PayloadAction<{
      target: number,
      elements: Element[],
    }>) {
      const { target, elements } = action.payload;
      const allChar = [...state.bokuState.chars, ...state.kimiState.chars]
      for(let i = 0; i < allChar.length; i++) {
        const char = allChar[i];
        if(char.id === target) {
          char.appledElement = elements;
        }
      }
    },
  }
});

export const {
  appendHistoryMessages,
  setCostMessages,
  setDamageMessages,
  setEstimateDamages,
  setProcessingAction,
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
  setDice,
  rollDice,
  rerollDice,
  changeCost,
  changeDamage,
  setRequireCost,
  setActiveSkill,
  unsetActiveSkill,
  dealDamage,
  setCharDown,
  appendElement,
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