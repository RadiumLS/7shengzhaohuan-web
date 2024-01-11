// 对局模拟中使用到的大量类型定义

import { type PlayState, type PlayerName } from "../redux/play";
import { type } from './../redux/index';
import {
  type Weapon,
  type PhaseType,
  type Element,
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
 * 角色实体
 */
interface CharEntity extends LogicEntity {
  id: number,
  // 012决定是左中右角色
  index: number,
  /**
   * 角色牌名称
   */
  name: string,
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
}

/**
 * 对局中的各个阶段的基类
 */
interface RoundPhase {
  /**
   * 阶段的id
   */
  id: number,
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
 * 行动阶段
 */
interface ActionPhase extends RoundPhase {
}
/**
 * 结束阶段
 */
interface EndPhase extends RoundPhase {
}