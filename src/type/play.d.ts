// 对局模拟中使用到的大量类型定义

/**
 * 触发器, 在不同的阶段被触发, 然后执行一些操作
 */
type Trigger = () => void;
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