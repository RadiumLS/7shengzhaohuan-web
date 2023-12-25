export enum ActionCardType {
  Equipment = 'equipment', // 圣遗物
  Weapon = 'weapon', // 武器
  Talent = 'talent', // 天赋
  Food = 'food', // 食物 料理
  Companion = 'companion', // 伙伴
  Location = 'location', // 场地
  Item = 'item', // 道具
  Resonance = 'resonance', // 共鸣牌, 包括骰子牌和共鸣牌
  Arcane = 'arcane', // 秘传牌
}
export enum PhaseType {
  /**
   * 对局开始阶段, 抽5张牌
   */
  StartDraw = 'start_draw',
  /**
   * 对局开始阶段, 替换重抽
   */
  StartSwitch = 'start_switch',
  /**
   * 回合开始的投掷阶段
   */
  Roll = 'roll',
  /**
   * 回合中的行动阶段
   */
  Action = 'action',
  /**
   * 回合结束阶段, 抽牌, 结算召唤物
   */
  End = 'end',
}
