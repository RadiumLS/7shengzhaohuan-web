// 伤害的相关工具类
import { CharEntity, Damage, DamageChange, LogicEntity } from '../type/play';
import { PlayState, PlayerName, getAllEntity } from '../redux/play';
import ElementCard from './../components/ElementCard';
import { Element } from '../type/enums';
import { spellEntityById } from './entity_class';

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
  /** 计算产生的消息列表, 可以dispatch */
  messages: {message: string}[],
  /** 生效了费用变化的实体id, 用于触发DamageChangeAfter */
  appliedEntityIds: number[],
  // TODO: 增加返回是否发生了元素反应, 发生了几次元素反应的标准
  // - 应对有的实体是 受到元素反应伤害/产生元素反应后 触发的
} => {
  const appliedEntityIds: number[] = [];
  const messages: {message: string}[] = [];
  // const allChar = [...state.bokuState.chars, ...state.kimiState.chars]
  // 经过一系列DamageChange之后的伤害
  let currDamge = {...sourceDamage};
  for(let i=0; i < damageChanges.length; i++) {
    const damageChange = damageChanges[i];
    const { newDamage, applied, message } = damageChange.predicate ? damageChange.predicate(state, currDamge) : changeOneDamage(currDamge, damageChange);
    if(applied) {
      currDamge = newDamage;
      appliedEntityIds.push(damageChange.entityId);
      messages.push({
        message: `${spellEntityById(state , damageChange.entityId)}生效, ${message || ''}`,
      });
    }
  }
  // let targetChar = allChar.find((char) => char.id === currDamge.target);
  // TODO: 经过元素反应后的伤害
  // 优先处理扩散反应，因为会额外产生两次计算过程
  if(currDamge.element === Element.Anemo) {
    /*
    if([Element.Cryo, Element.Pyro, Element.Hydro, Element.Electro].includes()) {
      // TODO: 会产生零到两个新的伤害对象, 需要对他们递归调用本函数本身……
    }
    */
  }
  // TODO: 还要额外处理一下冰草共存的情况……
  // TODO: 额外检查是否有火共鸣的火元素反应伤害+3
  // TODO: 好吧, 草神的元素爆发带来的出战状态也会加元素反应伤害……
  return {
    // computedDamages: [sourceDamage],
    computedDamages: [currDamge],
    elementChanges: [],
    effect: [],
    appliedEntityIds,
    messages,
  }
}

// 工具函数: Damage受到一个DamageChange更改后产生新的Damage
const changeOneDamage = (originDamage: Damage, damageChange: DamageChange) : {
  newDamage: Damage,
  applied: boolean,
  message?: string,
} => {
  const {damageTypes, sourceIds, targetIds, element, delta, damageElementChange } = damageChange;
  const ret = {
    newDamage: {...originDamage},
    applied: false,
    message: damageChange.message,
  };
  if(damageTypes.length > 0 && !damageTypes.includes(originDamage.damageType)) return ret;
  if(sourceIds.length > 0 && !sourceIds.includes(originDamage.source)) return ret;
  if(targetIds.length > 0 && !targetIds.includes(originDamage.target)) return ret;
  if(element.length > 0 && !element.includes(originDamage.element)) return ret;
  // 四项检查之后, 如果没有提前return, 那么就需要应用对应的DamageChange
  ret.applied = true;
  if(delta) ret.newDamage.point += delta;
  if(damageElementChange) ret.newDamage.element = damageElementChange;
  return ret;
}

// TODO: 工具函数, 计算元素反应
const elementReaction = (chars: CharEntity[], damage: Damage) : {
  newDamage: Damage,
  applied: boolean,
} => {
  const targetChar = chars.find((char) => char.id === damage.target);
  return {
    newDamage: damage,
    applied: false,
  }
}

export const spellDamageType = (damageElement?: (Element | 'physical' | 'pierce')): string => {
  if(damageElement === undefined) return '';
  const nameMap: Record<(Element | 'physical' | 'pierce'), string> = {
    [Element.Pyro]: '火元素',
    [Element.Hydro]: '水元素',
    [Element.Geo]: '岩元素',
    [Element.Electro]: '雷元素',
    [Element.Dendro]: '草元素',
    [Element.Cryo]: '冰元素',
    [Element.Anemo]: '风元素',
    'physical': '物理',
    'pierce': '穿刺',
  };
  return nameMap[damageElement];
}