// 伤害的相关工具类
import { CharEntity, Damage, DamageChange, LogicEntity } from '../type/play';
import { PlayState, PlayerName, getAllEntity } from '../redux/play';
import ElementCard from './../components/ElementCard';

type ElementChange = {
  target: number,
  elements: Element[],
}

/**
 * 核心的伤害计算工具函数, 元素反应的处理也在这个函数内
 * @param state 计算时候的全局state
 * @param sourceDamage 原始伤害对象
 * @param damageChanges 伤害变化对象列表, 主要是DamageChangeBefore的Trigger产生的
 * @returns 
 */
export const computeDamages = (state: Readonly<PlayState>, sourceDamage: Damage, damageChanges: DamageChange[]) : {
  /** 计算后的伤害列表, 可以dispatch */
  computedDamages: Damage[],
  /** 计算后的元素变化, 可以dispatch */
  elementChanges: ElementChange[],
  /** 计算后的其他副作用, 可以dispatch */
  effect: unknown[],
  /** 生效了费用变化的实体id, 用于触发DamageChangeAfter */
  appliedEntityIds: number[],
} => {
  return {
    computedDamages: [],
    elementChanges: [],
    effect: [],
    appliedEntityIds: [],
  }
}
