// 对局模拟中使用到的大量类型定义

import { PlayerName } from "../redux/play";

/**
 * 触发器, 在不同的阶段被触发, 然后执行一些操作
 */
type Trigger = () => LogicRecord[];
/**
 * 逻辑记录, 用来记录所有的逻辑操作
 */
type LogicRecord = {};
/**
 * 逻辑实体, 被用来反复遍历以确定卡牌效果等
 */
interface LogicEntity {
  // TODO: 一大堆的……触发器
  /**
   * 投掷时触发器, 如7种元素的圣遗物
   */
  diceTrigger?: Trigger[],
  /**
   * 产生伤害时触发器, 如武器牌和绽放反应产生的草原核
   */
  damageTrigger?: Trigger[],
  /**
   * 造成伤害时触发器, 如结晶盾和减伤状态
   */
  hitTirgger?: Trigger[],
  /**
   * 敌方使用技能后触发器, 如可莉的元素爆发产生的轰轰火花, 还有愚人众的阴谋
   */
  enemySkillTrigger?: Trigger[],
  /**
   * 元素反应触发器, 如草神的蕴种印和支援牌常九爷
   */
  reactionTrigger?: Trigger[],
  /**
   * 切换人物后触发器, 如凯亚的元素爆发产生的冰棱
   */
  switchEndTrigger?: Trigger[],
  /**
   * 切换人物前触发器, 如支援牌凯瑟琳和藏镜仕女天赋牌
   */
  switchStartTrigger?: Trigger[],
  // 先写这么点……好像还有非常多……
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
   * 阶段发生的逻辑记录的列表
   */
  record: LogicRecord[],
}
/**
 * 对局开始阶段
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