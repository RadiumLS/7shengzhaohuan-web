// 对局模拟中使用到的大量类型定义

import { type PlayState, type PlayerName } from "../redux/play";
import { type } from './../redux/index';
import { CardCost } from "./card";
import {
  type ActionCardType,
  type Weapon,
  type PhaseType,
  type Element,
  type SkillType,
  type DamageType
} from './enums'
import { type PayloadAction } from '@reduxjs/toolkit/dist/createAction';

/**
 * 触发器, 在不同的阶段被触发, 然后执行一些操作
 * 接受系列payload, 返回处理后的系列payload
 * 如果需要保存记录, 也通过payload来处理
 * 实际逻辑处理的时候在某个时间点之后, 通过dispatch来触发全部的payload
 */
interface Trigger {
  (state: Readonly<PlayState>, actions: PayloadAction<unknown>[]): PayloadAction<unknown>[];
}
/**
 * 逻辑记录, 用来记录所有的逻辑操作
 */
type LogicRecord = {
  player?: PlayerName,
  entity?: LogicEntity,
  phase?: RoundPhase,
  record?: string,
};
/**
 * 逻辑实体, 被用来反复遍历以确定卡牌效果等
 */
interface LogicEntity {
  id: number,
  /**
   * 实体从属于哪一方
   */
  player: PlayerName,
  /**
   * 实体的名字, 方便展示
   */
  name?: string,
  triggerMap: Partial<Record<TriggerType, Trigger[]>>;
}

interface EquipmentEngity extends LogicEntity {
}
/**
 * 支援实体
 */
interface SupportEntity extends LogicEntity {
};
/**
 * 召唤物实体
 */
interface SummonsEntity extends LogicEntity {
};
/**
 * 角色状态实体, 注意与出战状态区分
 */
interface CharStateEntity extends LogicEntity {
}
/**
 * 出战状态实体, 注意与角色状态区分
 */
interface ActiveStateEntity extends LogicEntity {
}
/**
 * 技能, 但并不是一个常驻实体
 */
interface Skill {
  /** 属于哪个玩家, 用于进行目标判断 */
  player: PlayerName;
  /** 技能的id */
  id: number;
  /** 技能隶属于哪个角色 */
  charId: number;
  icon?: string;
  name: string;
  type: SkillType;
  desc?: string;
  cost: CardCost;
  effect?: (state: Readonly<PlayState>) => PayloadAction<unknown>[];
}
// 被动技能, 直接在CharEntity的Trigger中体现, 不直接作为一个实体
/**
 * 角色实体
 */
interface CharEntity extends LogicEntity {
  // 012决定是左中右角色
  index: number,
  /**
   * 角色牌名称
   */
  name: string,
  /** 卡牌图片 */
  icon?: string,
  /** 卡牌小图片 */
  smallIcon?: string,
  /**
   * 角色牌元素, 用于骰子排序以及检索, 注意是个列表
   */
  element?: Element[],
  /**
   * 当前生命值
   */
  health: number,
  /**
   * 当前充能
   */
  energy: number,
  /**
   * 充能上限
   */
  energyMax: number,
  /**
   * 武器类型
   */
  weaponType: Weapon,
  /**
   * 角色状态
   */
  charState: CharStateEntity[],
  /**
   * 附着元素
   */
  appledElement: Element[],
  /**
   * 武器
   */
  weapon?: EquipmentEngity,
  /**
   * 圣遗物
   */
  equipment?: EquipmentEngity,
  /**
   * 天赋
   */
  talent?: EquipmentEngity,
  /**
   * 技能列表
   */
  skills: Skill[],
}

/**
 * 对局中的各个阶段的基类
 */
interface RoundPhase {
  /**
   * 阶段的id
   */
  id: number,
  /** 阶段隶属于第几回合 */
  round: number,
  /**
   * 阶段的名称
   */
  name: string,
  /**
   * 阶段的类型
   */
  type: PhaseType,
  /**
   * 是否是当前阶段
   */
  isActive: boolean,
  /**
   * 是否已经结束
   */
  isDone?: boolean,
  /**
   * 阶段所对应的玩家
   */
  player?: PlayerName,
  /**
   * 阶段发生的逻辑记录的列表
   */
  record: LogicRecord[],
}
// FIXME: 大量的阶段类型被移动至PhaseType中, 考虑这里的类型定义是否要保留
/**
 * 对局开始阶段, 被拆分成两步了, 抽牌和替换重抽
 */
interface StartPhase extends RoundPhase {
  /**
   * 先手方
   */
  offensive: PlayerName,
}
/**
 * 投掷阶段
 */
interface RollPhase extends RoundPhase {
  /**
   * 先手方
   */
  offensive: PlayerName,
}
/**
 * 重掷骰子阶段
 * 投掷阶段后, 行动阶段内都有可能触发重掷骰子
 */
interface RerollPhase extends RoundPhase {
  /**
   * 分别对应投掷阶段和行动阶段触发的重掷
   */
  rerollType: 'roll' | 'action';
  /**
   * 先手方
   */
  offensive?: PlayerName,
}

/**
 * 描述费用变化的类型
 */
interface DeltaCost {
  // 指定某类卡牌/技能的费用变化
  player: PlayerName;
  actionCardTypes: ActionCardType[];
  skillTypes: SkillType[];
  // 指定具体的卡牌/技能/角色技能的费用变化
  charIds?: number[];
  skillIds?: number[];
  cardIds?: number[];
  // TODO: 切人时候的费用变化预计需要额外处理, 比如切换至某角色减费, 从某角色切换走减费
  /** 具体费用变化了多少 */
  cost?: CardCost;
  /** 触发的实体的id */
  entityId?: number;
}

/**
 * 对局途中发生的一切都会以HistoryMessage的形式记录下来
 */
interface HistoryMessage {
  id?: number;
  phase?: RoundPhase;
  player?: PlayerName;
  entityName?: string;
  message: string;
  /**
   * 是否私有, 考虑有些信息是只有自己能看到的,
   * 比如抽到了什么牌, 掷出了什么骰子
   */
  private?: boolean;
}
/**
 * 对局中的伤害
 */
interface Damage {
  /** 伤害来源, 类型为实体id */
  source: number;
  /** 伤害目标, 类型为实体id */
  target: number;
  /** 伤害的类型, 例如技能/普攻/元素爆发/元素反应 */
  damageType: DamageType;
  /** 元素类型, 比7元素多物理和穿刺两种类型 */
  element: Element | 'physical' | 'pierce';
  /** 伤害值 */
  point: number;
}
/**
 * 描述伤害变化的interface
 */
interface DamageChange {
  // 伤害变化谓词, 具有很高的优先级, 如果有谓词存在, 那么不使用常规的判断, 而是完全交由谓词判断
  predicate?: (state: Readonly<PlayState>, originDamage: Damage) => {
    newDamage: Damage,
    applied: boolean,
    message?: string,
  };
  // 生效的伤害类型, 为空则表示全部生效
  damageTypes: DamageType[]; 
  // 对指定来源的实体生效, 为空则表示全部生效 
  sourceIds: number[];
  // 对指定目标的实体生效, 为空则表示全部生效 
  targetIds: number[];
  // 生效的元素类型
  element: (Element | 'physical' | 'pierce')[];
  delta: number;
  // TODO: 增加伤害变化谓词： 伤害变化的函数 f(state, Damage) => Damage
  // - 并且优先级比delta要高
  damageElementChange?: (Element | 'physical' | 'pierce'); // 元素类型转换
  // 伤害变化的来源id
  entityId: number;
  // 伤害变化生效后的消息
  message?: string;
}