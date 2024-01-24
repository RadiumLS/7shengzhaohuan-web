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
/** 骰子转换为字符串以方便在信息记录中阅读 */
export const spellDices = (dices: Dice[]): string => {
  const nameMap: Record<Dice, string> = {
    omni: '万',
    [Element.Pyro]: '火',
    [Element.Hydro]: '水',
    [Element.Geo]: '岩',
    [Element.Electro]: '雷',
    [Element.Dendro]: '草',
    [Element.Cryo]: '冰',
    [Element.Anemo]: '风',
  };
  return dices.map((dice) => nameMap[dice]).join('');
}
export const spellCosts = (costs?: CardCost): string => {
  if(costs === undefined) return '';
  const nameMap: Record<CostType, string> = {
    [Element.Pyro]: '火骰子',
    [Element.Hydro]: '水骰子',
    [Element.Geo]: '岩骰子',
    [Element.Electro]: '雷骰子',
    [Element.Dendro]: '草骰子',
    [Element.Cryo]: '冰骰子',
    [Element.Anemo]: '风骰子',
    matching: '同色骰',
    unaligned: '任意骰',
    energy: '充能',
    element: '元素骰'
  };
  return costs.map((cost) => `${nameMap[cost.type]}${cost.cost}`).join('');
}

/**
 * 计算费用变化, 工具函数, 纯函数
 * @param originCost 原始费用
 * @param deltaCost delta费用
 * @returns 计算后的费用, 不会被减到0以下
 */
export const calculateCost = (originCost: CardCost, deltaCost: CardCost): CardCost => {
  // TODO: 处理「元素骰」减费的情况, 可能需要特殊处理
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
    const newCost = cost.cost + (deltaMap[cost.type] || 0);
    return {
      type: cost.type,
      cost: newCost < 0 ? 0 : newCost,
    }
  });
}
/**
 * 比较两个费用是否完全一致
 */
const isSameCost = (a: CardCost, b: CardCost): boolean => {
  if(a.length !== b.length) return false;
  const costMap: Partial<Record<CostType, number>> = {};
  for(let i = 0; i < a.length; i++) {
    const cost = a[i];
    costMap[cost.type] = cost.cost;
  }
  for(let i = 0; i < b.length; i++) {
    const cost = b[i];
    if(costMap[cost.type] !== cost.cost) return false;
  }
  return true;
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
    computedCost = calculateCost(skill.cost, cost || []);
    // XXX: 注意, 费用计算后如果没有变化, 则不会标记applied
    if(!isSameCost(skill.cost, computedCost)) {
      applied = true;
    }
  }

  return {
    computedCost,
    applied,
  };
}
// TODO: 需要一个工具函数：f(cardEntity, deltaCost) => cost ; 计算卡牌的费用

// 检查requireCost和dices是否匹配的工具函数
export const checkCostMatch = (requireCost: CardCost, dices: Dice[]): boolean => {
  // 如果不需要任何骰子, 则直接返回true
  if(requireCost.length === 0) return true;
  const remainDices = sortDice([...dices]);
  let requireDiceCount = 0;
  // 先检查骰子数量是否一致
  const requireCostDict: Record<CostType, number> = {
    matching: 0,
    unaligned: 0,
    [Element.Pyro]: 0,
    [Element.Hydro]: 0,
    [Element.Geo]: 0,
    [Element.Electro]: 0,
    [Element.Dendro]: 0,
    [Element.Cryo]: 0,
    [Element.Anemo]: 0,
    energy: 0,
    element: 0
  };
  // 过一遍骰子需求数量
  for(let i = 0; i < requireCost.length; i++) {
    const oneCost = requireCost[i];
    requireDiceCount += oneCost.cost;
    requireCostDict[oneCost.type] += oneCost.cost;
  }
  // 移除energy和element两个特殊情况的消耗
  requireCostDict.energy = 0;
  requireCostDict.element = 0;
  // 如果需求的总骰子不对应, 则直接返回false
  if(requireDiceCount !== dices.length) return false;
  // 检查是否只需求一种颜色的骰子
  let mixRequire = true;
  let compareElement: (CostType | undefined) = undefined;
  let oneCostElement: (CostType | undefined) = undefined;
  for(const key in requireCostDict) {
    const value = requireCostDict[key as CostType];
    if(value === 1) oneCostElement = key as CostType;
    if(value === requireDiceCount) {
      mixRequire = false;
      compareElement = key as CostType;
      break;
    };
  }
  // 如果只需求一种颜色的骰子
  if(!mixRequire) {
    // 如果需求的全部是任意骰, 则只匹配数量后返回true
    if(compareElement === 'unaligned') return true;
    // 如果需求的全部是单色骰, 则匹配数量并且检查颜色
    for(let i = 0; i < remainDices.length; i++) {
      const dice = remainDices[i];
      if(dice === 'omni') continue;
      // 如果需求的是同色骰, 则变更比较色为第一个非万能骰的颜色
      if(compareElement === 'matching') {
        compareElement = dice;
        continue;
      }
      if(dice !== compareElement) return false;
    }
    return true;
  } else {
    // TODO: 需求的是混合骰的情况
    // 目前只有普通攻击是1元素骰+2任意骰的消耗
    const unalignCost = requireCostDict.unaligned;
    // 如果除了任意骰之外, 只消耗一个元素骰的情况 (普通攻击大部分是这种)
    if((requireDiceCount - unalignCost) === 1) {
      if(dices.includes('omni')) {
        return true;
      }
      if(dices.includes(oneCostElement as Element)) {
        return true;
      }
    } else {
      // 远期要考虑同色骰m+任意骰n的情况？
      // XXX: 每考虑这种情况, 先直接返回false
      return false;
    }

    return false;
  }
}

//TODO: 做个概率计算的工具函数出来, 方便牌手进行分析