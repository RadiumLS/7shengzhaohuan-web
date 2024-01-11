// 骰子相关的工具类
import { Dice } from '../redux/play';
import { Element } from '../type/enums';

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

//TODO: 做个概率计算的工具函数出来, 方便牌手进行分析