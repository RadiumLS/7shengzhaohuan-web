import { CSSProperties } from 'react';
import { type } from './../redux/index';

/** 七种元素类型 */
enum Element {
  Pyro = 'pryo', // 火
  Hydro = 'hydro', // 水
  Geo = 'geo', // 岩
  Electro = 'electro', // 雷
  Dendro = 'dendro', // 草
  Cryo = 'cryo', // 冰
  Anemo = 'anemo', // 风
}
/** 卡牌消耗类型, 分元素骰, 无属性骰, 还有充能 */
type CostType = Element | 'unaligned' | 'energy';
/** 消耗, 记录数量和类型*/
type Cost = {
  type: CostType,
  cost: number;
}
/** 卡牌消耗 */
type CardCost = Cost[];
/** 卡牌类型, 分角色卡和行动卡 */
type CardType = 'character' | 'action';
/** 阵营 */
enum Faction {
  Monster = 'monster', // 魔物
  Mondstadt = 'mondstadt', // 蒙德
  Liyue = 'liyue', // 璃月
  Inazuma = 'inazuma', // 稻妻
  Sumeru = 'sumeru', // 须弥
  Fatui = 'fatui', // 愚人众
}
enum Weapon {
  Sword = 'sword', // 单手剑
  Bow = 'bow', // 弓
  Claymore = 'claymore', // 双手剑
  Catalyst = 'catalyst', // 法器
  Polearm = 'Polearm', // 长柄武器
  Other = 'other', // 其他武器, 通常是原魔
}

/**
 * 卡牌的基本属性
 * @property {number} id 卡组分享码中指定的id
 */
interface CardBase {
  id: number;
  name: string;
  nickName?: string[];
  cardType: CardType;
}

/**
 * 角色牌
 * @property {number} health 生命值
 * @property {Element} element 元素
 * @property {Faction[]} faction 阵营
 * @property {Weapon} weapon 武器类型
 * @property {number?} engry 充能
 */
interface CharCard extends CardBase {
  health: number;
  element: Element;
  faction: Faction[];
  weapon: Weapon;
  engry?: number;
}

enum ActionCardType {
  Equipment = 'equipment', // 圣遗物
  Weapon = 'weapon', // 武器
  Talent = 'talent', // 天赋
  Food = 'food', // 食物 料理
  Companion = 'companion', // 伙伴
  Location = 'location', // 场地
  Resonance = 'resonance', // 共鸣牌, 包括骰子牌和共鸣牌
  Arcane = 'arcane', // 秘传牌
}

interface ActionCard extends CardBase {
  cost: CardCost;
  type: 'event' | ActionCardType;
  tag: string[];
}

/**
 * @deprecated
 */
interface CardOption {
  // XXX: 米游社的卡片id
  id: string,
  // 客户端内的卡片id, 在卡组分享码中使用
  genshinCardId?: number,
  // fandom wiki的卡片id, 暂时没有使用, 考虑给英文那边使用？
  // fandomCardId?: string,
  style?: CSSProperties,
  size?: 'big' | 'small',
  className?: string,
}

/**
 * @deprecated
 */
interface CardSimpleInfo {
  id: number
}
/**
 * @deprecated
 */
interface CardInfo extends CardSimpleInfo {
  name: string,
  nickName?: string[],
  icon?: string,
  life?: number,
  energy?: number,
  element?: string,
  weapon?: string,
  camp?: string,
  title?: string,
  story?: string,
}

/**
 * @deprecated
 */
interface MiyousheDeck {
  deckId?: number | string,
  ext: string | any,
  title: string,
  summary: string,
  icon: string,
  content_id?: string,
}