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
  // TODO: 可能需要进行一下排序, 把万能骰往前面放
  return rollResult;
}

//TODO: 做个骰子牌序展示的工具函数, 优先将指定类型的骰子展示在前方
//TODO: 做个概率计算的工具函数出来, 方便牌手进行分析