// 结算的相关工具类, 主要在process_component中使用
import { PlayState, PlayerName, computeTriggerActions, getAllEntity, setCharDown } from '../redux/play';
import { TriggerType } from '../type/enums';
import { all } from 'axios';
import { CharEntity } from '../type/play';
import { PayloadAction } from '@reduxjs/toolkit';

/**
 * 核心的伤害计算工具函数, 元素反应的处理也在这个函数内
 * @param state 计算时候的全局state
 * @returns 
 */
export const computeCharDownEffect = (state: Readonly<PlayState>) : {
  /** 计算后的其他副作用, 可以dispatch */
  effects: PayloadAction<unknown>[],
  /** 生效了的实体id */
  appliedEntityIds: number[],
} => {
  const retEffect: PayloadAction<unknown>[]  = [];
  // TODO: 检查是否又阻止倒下之类的效果
  const allActions = computeTriggerActions(state, TriggerType.CharDownBefore, []);
  // 检查血量为0或者以下的角色, 将其置为倒下状态
  const allChar: CharEntity[] = [...state.bokuState.chars, ...state.kimiState.chars]
  for(let i=0; i < allChar.length; i++) {
    const oneChar = allChar[i];
    if(!oneChar.isDown && oneChar.health <= 0) {
      retEffect.push(setCharDown({
        charId: oneChar.id,
      }));
    }
  }
  // TODO: 野猪公主的判断要怎么处理好呢？
  // - 可能考虑给野猪公主增加CharDownBeforeTrigger, 或者直接这里做特殊处理？

  return {
    effects: retEffect,
    appliedEntityIds: [],
  }
}