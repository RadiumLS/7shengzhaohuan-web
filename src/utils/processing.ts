// 结算的相关工具类, 主要在process_component中使用
import { PlayState, PlayerName, computeTriggerActions, getAllEntity, goNextPhase, setCharDown } from '../redux/play';
import { PhaseType, TriggerType } from '../type/enums';
import { all } from 'axios';
import { CharEntity, RoundPhase } from '../type/play';
import { PayloadAction } from '@reduxjs/toolkit';

/**
 * 核心的判断是否有角色倒下的工具函数
 * @param state 计算时候的全局state
 * @returns 
 */
export const computeCharDownEffect = (state: Readonly<PlayState>) : {
  /** 计算后的其他副作用, 可以dispatch */
  effects: PayloadAction<unknown>[],
  /** 生效了的实体id */
  appliedEntityIds: number[],
} => {
  const retEffects: PayloadAction<unknown>[]  = [];
  const needSwitchCharPlayer = [];
  // TODO: 检查是否又阻止倒下之类的效果
  const allActions = computeTriggerActions(state, TriggerType.CharDownBefore, []);
  // 检查血量为0或者以下的角色, 将其置为倒下状态
  const allChar: CharEntity[] = [...state.bokuState.chars, ...state.kimiState.chars]
  for(let i=0; i < allChar.length; i++) {
    const oneChar = allChar[i];
    if(!oneChar.isDown && oneChar.health <= 0) {
      retEffects.push(setCharDown({
        charId: oneChar.id,
      }));
      needSwitchCharPlayer.push(oneChar.player);
    }
  }
  // 切换角色阶段在setCharDown中处理

  // TODO: 野猪公主的判断要怎么处理好呢？
  // - 可能考虑给野猪公主增加CharDownBeforeTrigger, 或者直接这里做特殊处理？

  return {
    effects: retEffects,
    appliedEntityIds: [],
  }
}

/**
 * 核心的处理「使用技能后」触发器的工具函数
 * @param state 计算时候的全局state
 * @returns 
 */
export const computeAfterSkillEffect = (state: Readonly<PlayState>) : {
  /** 计算后的其他副作用, 可以dispatch */
  effects: PayloadAction<unknown>[],
  /** 生效了的实体id */
  appliedEntityIds: number[],
} => {
  // TODO: 计算使用技能后触发器产生的effect
  return {
    effects: [],
    appliedEntityIds: [],
  }
}
/**
 * 核心的处理下一个行动方的工具函数
 * @param state 计算时候的全局state
 * @returns 
 */
export const computeNextRoundPhaseEffect = (state: Readonly<PlayState>) : {
  /** 计算后的其他副作用, 可以dispatch */
  effects: PayloadAction<unknown>[],
  /** 生效了的实体id */
  appliedEntityIds: number[],
} => {
  const retEffects: PayloadAction<unknown>[]  = [];
  const { currPhase } = state;
  // 计算下一个行动方
  if(currPhase) {
    const currPlayer = currPhase.player;
    const playerState = currPlayer === 'boku' ? state.bokuState : state.kimiState;
    const nextPlayer = playerState.continueActionFlag ? currPlayer : (currPlayer === 'boku' ? 'kimi' : 'boku');
    const nextPhase: RoundPhase = {
      id: 0,
      round: state.currPhase?.round || 0,
      player: nextPlayer,
      name: `${nextPlayer === 'boku' ? '本方': '对方'}行动阶段`,
      type: PhaseType.Action,
      isActive: false,
      record: [],
    };
    retEffects.push(goNextPhase({
      nextPhase, 
    }));
  }
  return {
    effects: retEffects,
    appliedEntityIds: [],
  }
}