import { createSlice, CreateSliceOptions } from '@reduxjs/toolkit'
import { PayloadAction } from '@reduxjs/toolkit/dist/createAction';
import { CardInfo } from '../type/card';

interface Player {
  name: string,
  nickName?: string,
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
  state: 'banned' | 'picked' | '',
}
// 角色池
interface CharPool {
  // owner: 'pick' | 'blue' | 'orange',
  chars: CharCard[],
}
// BP阶段
interface BPPhase {
  name: string,
  type: 'ban' | 'pick',
  // 由哪个玩家进行bp，有可能出现规则bp的情况
  player: Player,
  // 需要ban或者pick多少个角色
  count: number,
  // 已经ban或者pick的角色的列表
  chars?: CharCard[],
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
}

let initialState: BanpickState = {
  bpRule: [{
    name: '橙色选3',
    type: 'pick',
    player: {
      name:'orange',
    },
    count: 3,
  }, {
    name: '蓝色选3',
    type: 'pick',
    player: {
      name:'blue',
    },
    count: 3,
  }],
  publicPool: {
    chars: [],
  },
  playerPool: {
    // 蓝色和橙色选手
    blue: {
      chars: [],
    },
    orange: {
      chars: [],
    }
  },
  playerList: [{
    name: 'blue',
  }, {
    name: 'orange',
  }]
};

const banpickCharPoolSlice = createSlice({
  name: 'banpickCharPool',
  initialState,
  reducers: {
    createPool: function(state, action: PayloadAction<string>) {
    },
    addPlayer: function(state, action: PayloadAction<Player>) {
      state.playerList.push(action.payload);
    },
    delPlayerAt: function(state, action: PayloadAction<number>) {
      const index = action.payload;
      state.playerList = state.playerList.slice(0, index).concat(state.playerList.slice(index + 1));
    },
    addBpPhase: function(state, action: PayloadAction<BPPhase>) {
      state.bpRule.push(action.payload);
    },
    delBpPhaseAt: function (state, action: PayloadAction<number>) {
      const index = action.payload;
      state.bpRule = state.bpRule.slice(0, index).concat(state.bpRule.slice(index + 1));
    },
    delAllBpPhase: function(state, action: PayloadAction) {
      state.bpRule = [];
    }
  }
});

export const {
  createPool,
  addPlayer,
  delPlayerAt,
  addBpPhase,
  delBpPhaseAt,
  delAllBpPhase,
} = banpickCharPoolSlice.actions
export default banpickCharPoolSlice.reducer