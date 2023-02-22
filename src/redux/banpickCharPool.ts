import { createSlice, CreateSliceOptions } from '@reduxjs/toolkit'
import { PayloadAction } from '@reduxjs/toolkit/dist/createAction';
import { CardInfo } from '../type/card';
import { cardInfos as genshinCardInfos } from '../components/GenshinCard';
import { cardInfos as monsterCardInfos } from '../components/MonsterCard';

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
// BP行为
interface BPAction {
  type: 'ban' | 'pick',
  playerName: string,
  cardId: number,
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

const initialCharPool = genshinCardInfos.concat(monsterCardInfos);
let initialState: BanpickState = {
  bpActions: [],
  bpRule: [{
    name: '橙色禁用1',
    type: 'ban',
    player: {
      name:'orange',
    },
    chars: [],
    count: 1,
  }, {
    name: '橙色选3',
    type: 'pick',
    player: {
      name:'orange',
    },
    chars: [],
    count: 3,
  }, {
    name: '蓝色选3',
    type: 'pick',
    player: {
      name:'blue',
    },
    chars: [],
    count: 3,
  }],
  curPhase: null,
  publicPool: {
    chars: initialCharPool,
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
    nickName: '蓝色方',
    color: '##5688CA',
  }, {
    name: 'orange',
    nickName: '橙色方',
    color: '#DDAD4A',
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
    editPlayer: function(state, action: PayloadAction<Player>) {
      const { name, nickName, color } = action.payload;
      const originPlayer = state.playerList.find(onePlayer => onePlayer.name === name);
      if(originPlayer) {
        originPlayer.nickName = nickName ? nickName : originPlayer.nickName;
        originPlayer.color = color ? color : originPlayer.color;
      }
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
    },
    startBP: function(state) {
      state.curPhase = state.bpRule[0];
      state.bpActions = [];
      state.playerPool = {};
      for(let i = 0; i < state.playerList.length; i++) {
        const playerName = state.playerList[i].name;
        state.playerPool[playerName] = {
          chars: [],
        };
      }
      state.publicPool = {
        chars: initialCharPool,
      };
    },
    nextBPPhase: function(state) {
      const pIndex = state.bpRule.findIndex((onePhase) => onePhase.name === state.curPhase?.name);
      state.curPhase = state.bpRule[pIndex + 1];
    },
    setCurPhaseIndex: function(state, action: PayloadAction<number>) {
      state.curPhase = state.bpRule[action.payload];
    },
    bpPublicChar: function (state, action: PayloadAction<BPAction>) {
      state.bpActions.push(action.payload);
      const { type, playerName, cardId } = action.payload;
      const card = state.publicPool.chars.find((oneCard) => oneCard.id === cardId);
      if(card !== undefined) {
        if (type === 'pick') {
          card.owner = { name: playerName };
          card.state = 'picked';
          state.playerPool[playerName].chars.push({...card});
        } else if (type === 'ban') {
          card.state = 'banned';
        }
        state.curPhase?.chars.push(card);
        if(state.curPhase?.chars.length === state.curPhase?.count) {
          const pIndex = state.bpRule.findIndex((onePhase) => onePhase.name === state.curPhase?.name);
          state.curPhase = state.bpRule[pIndex + 1];
        }
      }
    },
  }
});

export const {
  createPool,
  addPlayer,
  editPlayer,
  delPlayerAt,
  addBpPhase,
  delBpPhaseAt,
  delAllBpPhase,
  startBP,
  nextBPPhase,
  setCurPhaseIndex,
  bpPublicChar,
} = banpickCharPoolSlice.actions
export default banpickCharPoolSlice.reducer