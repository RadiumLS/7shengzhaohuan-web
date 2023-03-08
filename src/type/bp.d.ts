import { CardInfo } from './card';
 
interface Player {
  name: string,
  nickName?: string,
  // 代表色
  color?: string,
  // 头像
  icon?: string,
  uid?: string,
  biliId?: string,
};
interface CharCard extends CardInfo {
  // 持有者
  owner?: Player,
  // 状态：被ban，被选，还在池中
  state?: 'banned' | 'picked' | '',
}
// 角色池
interface CharPool {
  // owner: 'pick' | 'blue' | 'orange',
  chars: CharCard[],
}
type BPActionType = 'ban' | 'pick' | 'random_ban' | 'random_pick';

// BP行为
interface BPAction {
  // type: 'ban' | 'pick',
  type: BPActionType
  playerName: string,
  cardId: number,
}
// BP阶段
interface BPPhase {
  name: string,
  type: BPActionType,
  // 由哪个玩家进行bp，有可能出现规则bp的情况
  player: Player,
  // 需要ban或者pick多少个角色
  count: number,
  // 已经ban或者pick的角色的列表
  chars: CharCard[],
  // 时间限制
  timeLimit?: number,
  // 时间限制类型，单个角色BP限时或者是整个阶段限时
  tlType?: 'char' | 'phase',
  // XXX: 可能需要处理公共时间的情况，类似dota2的bp时间限制
}
interface BanpickState {
  // TODO: 考虑增加更多属性以方便进行持久化
  publicPool: CharPool,
  playerList: Player[],
  playerPool: {
    [key: string]: CharPool,
  },
  // bp规则，是bp阶段的集合
  bpRule: BPPhase[],
  // 当前BP阶段
  curPhase: BPPhase | null,
  // bp行为记录
  bpActions: BPAction[],
}
