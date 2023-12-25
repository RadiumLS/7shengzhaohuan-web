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
