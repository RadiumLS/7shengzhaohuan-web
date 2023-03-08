import { createSlice, CreateSliceOptions } from '@reduxjs/toolkit'
import { PayloadAction } from '@reduxjs/toolkit/dist/createAction';
import { cardInfos as genshinCardInfos } from '../components/GenshinCard';
import { cardInfos as monsterCardInfos } from '../components/MonsterCard';
import { BanpickState, BPAction, BPPhase, Player } from '../type/bp';

const initialCharPool = genshinCardInfos.concat(monsterCardInfos);
let initialState: BanpickState = {
  bpActions: [],
  bpRule: [{
    name: '第一轮 橙色随机选3',
    type: 'random_pick',
    player: {
      name:'orange',
    },
    chars: [],
    count: 3,
  }, {
    name: '第二轮 橙色随机选3',
    type: 'random_pick',
    player: {
      name:'orange',
    },
    chars: [],
    count: 3,
  }, {
    name: '第三轮 橙色随机选3',
    type: 'random_pick',
    player: {
      name:'orange',
    },
    chars: [],
    count: 3,
  }, {
    name: '第四轮 橙色随机选3',
    type: 'random_pick',
    player: {
      name:'orange',
    },
    chars: [],
    count: 3,
  }, {
    name: '第五轮 橙色随机选3',
    type: 'random_pick',
    player: {
      name:'orange',
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
    color: '#0693E3',
  }, {
    name: 'orange',
    nickName: '橙色方',
    color: '#FF6900',
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
          card.owner = state.playerList.find((onePlayer) => onePlayer.name === playerName);
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