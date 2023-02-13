import { createSlice, CreateSliceOptions } from '@reduxjs/toolkit'
import { PayloadAction } from '@reduxjs/toolkit/dist/createAction';
import { CardInfo } from '../type/card';

type Player = string;
interface CharCard extends CardInfo {
  // 持有者
  owner?: Player,
  // 状态：被ban，被选，还在池中
  state: 'banned' | 'picked' | '',
}
// 角色池
interface CharPool {
  // owner: 'pick' | 'blue' | 'orange',
  chars: CharCard[],
}
// BP阶段
interface BPPhase {
  id: string,
  type: 'ban' | 'pick',
  // 由哪个玩家进行bp，有可能出现规则bp的情况
  player: Player,
  // 需要ban或者pick多少个角色
  count: number,
  // 已经ban或者pick的角色的列表
  chars: CharCard[],
  // 时间限制
  timeLimit: number,
  // 时间限制类型，单个角色BP限时或者是整个阶段限时
  tlType: 'char' | 'phase',
  // XXX: 可能需要处理公共时间的情况，类似dota2的bp时间限制
}
interface BanpickState {
  xx: string[],
  publicPool: CharPool,
  playerPool: {
    [key: Player]: CharPool,
  },
  // bp规则，是bp阶段的集合
  bpRule: BPPhase[],
}

let initialState: BanpickState = {
  xx: [],
  bpRule: [],
  publicPool: {
    chars: [],
  },
  playerPool: {}
};

const banpickCharPoolSlice = createSlice({
  name: 'banpickCharPool',
  initialState,
  reducers: {
    
    createPool: function(state, action: PayloadAction<string>) {
      state.xx.push(action.payload);
    }
  }
});

export const { createPool } = banpickCharPoolSlice.actions
export default banpickCharPoolSlice.reducer