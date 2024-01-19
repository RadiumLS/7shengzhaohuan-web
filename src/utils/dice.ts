// 骰子相关的工具类
import { CardCost, CostType } from '@src/type/card';
import { Dice } from '../redux/play';
import { Element } from '../type/enums';
import { DeltaCost, Skill } from '@src/type/play';

export const rollRandomDice = (count: number): Dice[] => {
  const randomDice: Dice[] = [
    'omni',
    Element.Anemo,
    Element.Cryo,
    Element.Dendro,
    Element.Electro,
    Element.Geo,
    Element.Hydro,
    Element.Pyro,
  ];

  const rollResult: Dice[] = [];
  for (let i = 0; i < count; i++) {
    // 随机投掷一个骰子
    rollResult.push(randomDice[Math.floor(Math.random() * 8)]);
  }
  return sortDice(rollResult);
}

//骰子排序, 优先级: 万能 > 优先元素 > 其他; 同优先级按照数量排序;
export const sortDice = (dice: Dice[], priorElement?: Element[]): Dice[] => {
  const priorMap: Record<Dice, number> = {
    omni: 100000,
    [Element.Pyro]: 1,
    [Element.Hydro]: 2,
    [Element.Geo]: 3,
    [Element.Electro]: 4,
    [Element.Dendro]: 5,
    [Element.Cryo]: 6,
    [Element.Anemo]: 7,
  };
  for(let i = 0; i < dice.length; i++) {
    priorMap[dice[i]] += 1000;
  }
  if(priorElement) {
    for(let i = 0; i < priorElement.length; i++) {
      priorMap[priorElement[i]] = 10000 + i;
    }
  }
  return dice.sort((a, b) => {
    return priorMap[b] - priorMap[a];
  });
}

/**
 * 计算费用变化, 工具函数, 纯函数
 * @param originCost 原始费用
 * @param deltaCost delta费用
 * @returns 计算后的费用
 */
export const calculateCost = (originCost: CardCost, deltaCost: CardCost): CardCost => {
  const deltaMap: Partial<Record<CostType, number>> = {};
  for(let i = 0; i < deltaCost.length; i++) {
    const cost = deltaCost[i];
    if(typeof deltaMap[cost.type] === 'number') {
      deltaMap[cost.type] = (deltaMap[cost.type] || 0) + cost.cost;
    } else {
      deltaMap[cost.type] = cost.cost;
    }
  }
  return originCost.map((cost) => {
    return {
      type: cost.type,
      cost: (cost.cost + (deltaMap[cost.type] || 0))
    }
  });
}
/**
 * 工具函数: 计算指定技能的费用, 如果不适用减费则会返回原始费用
 * @param skill 需要计算的技能
 * @param deltaCostAction 实体的CostBefore触发器产生的deltaCostAction
 * @returns {
 *  computedCost: 计算后的费用,
 *  applied: Action是否应用在了技能上,
 * }
 */
export const computeSkillCost = (skill: Skill, deltaCostAction: DeltaCost): {
  computedCost: CardCost,
  applied: boolean,
}=> {
  let applied = false;
  let computedCost = [...skill.cost];
  // XXX: charId的匹配在外面一层计算, 不在这里计算
  const {skillTypes, /* charIds, */ skillIds, cost} = deltaCostAction;
  if(skillTypes.includes(skill.type) || skillIds?.includes(skill.id)) {
    // XXX: 注意, 即使费用变化为0, applied也会被标记
    applied = true;
    computedCost = calculateCost(skill.cost, cost || []);
  }
  // XXX: 注意, 费用降低到0之后的计算请在外侧进行, 这里是个纯函数

  return {
    computedCost,
    applied,
  };
}
// TODO: 需要一个工具函数：f(cardEntity, deltaCost) => cost ; 计算卡牌的费用

//TODO: 做个概率计算的工具函数出来, 方便牌手进行分析