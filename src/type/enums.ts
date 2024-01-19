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
   * 对局开始阶段, 选择出战角色
   */
  StartSelectChar = 'start_select_char',
  /**
   * 回合开始的投掷阶段
   */
  Roll = 'roll',
  /**
   * 回合开始或者行动中的重新投掷阶段
   */
  Reroll = 'reroll',
  /**
   * 回合中的行动阶段
   */
  Action = 'action',
  /**
   * 回合结束阶段, 抽牌, 结算召唤物
   */
  End = 'end',
  /**
   * 由于阵亡而导致的强制切换角色阶段
   */
  DeadSwitch = 'dead_switch',
}

export enum Element {
  /** 火元素 */
  Pyro = 'pryo',
  /** 水元素 */
  Hydro = 'hydro',
  /** 岩元素 */
  Geo = 'geo',
  /** 雷元素 */
  Electro = 'electro',
  /** 草元素 */
  Dendro = 'dendro',
  /** 冰元素 */
  Cryo = 'cryo',
  /** 风元素 */
  Anemo = 'anemo',
}

export enum Weapon {
  /** 单手剑*/
  Sword = 'sword',
  /** 弓*/
  Bow = 'bow',
  /** 双手剑*/
  Claymore = 'claymore',
  /** 法器*/
  Catalyst = 'catalyst',
  /** 长柄武器*/
  Polearm = 'Polearm',
  /** 其他武器, 通常是原魔*/
  Other = 'other', 
}
export enum SkillType {
  /** 普通攻击*/
  NormalAttack = 'normal_attack',
  /** 元素战技*/
  ElementalSkill = 'elemental_skill',
  /** 元素爆发*/
  ElementalBrust = 'elemental_brust',
}

// 触发器类型, 先写这么点……好像还有非常多……
export enum TriggerType {
  /**
   * 投掷时触发器, 如7种元素的圣遗物
   */
  Dice = 'dice',
  /** 费用计算的触发器, 如7种元素的圣遗物 */
  CostBefore = 'costBefore',
  /** 实际消耗费用后的触发器, 扣减次数之类的内容在这里做 */
  CostAfter = 'costAfter',
  /**
   * 产生伤害时触发器, 如武器牌和绽放反应产生的草原核
   */
  Damage = 'damage',
  /**
   * 造成伤害时触发器, 如结晶盾和减伤状态
   */
  Hit = 'hit',
  /**
   * 敌方使用技能后触发器, 如可莉的元素爆发产生的轰轰火花, 还有愚人众的阴谋
   */
  EnemySkill = 'enemySkill',
  /**
   * 元素反应触发器, 如草神的蕴种印和支援牌常九爷
   */
  Reaction = 'reaction',
  /**
   * 切换人物后触发器, 如凯亚的元素爆发产生的冰棱
   */
  SwitchEnd = 'switchEnd',
  /**
   * 切换人物前触发器, 如支援牌凯瑟琳和藏镜仕女天赋牌
   */
  SwitchStart = 'switchStart',
}