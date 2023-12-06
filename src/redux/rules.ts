import { createSlice, CreateSliceOptions } from '@reduxjs/toolkit'
import { PayloadAction } from '@reduxjs/toolkit/dist/createAction';
import { cardInfos as genshinCardInfos } from '../components/GenshinCard';
import { cardInfos as monsterCardInfos } from '../components/MonsterCard';
import { BanpickState, BPAction, BPPhase, CharPool, Player } from '../type/bp';

type PlayerName = string;
type RuleName = string;

// bp规则的数据结构
interface BPRule {
  // 规则名称
  name: string,
  // 规则作者名
  author?: string,
  // 规则描述
  desc?: string,
  // 玩家列表
  playerList: Player[],
  // 玩家name映射
  playerMap?: {
    [key: PlayerName]: Player,
  }
  // 英雄池
  publicCharPool: CharPool,
  // bp阶段列表，是主要的规则内容
  bpPhaseList: BPPhase[],
}
interface RuleState {
  ruleList: BPRule[],
  ruleMap: {
    [key: RuleName]: BPRule,
  },
  curRule: BPRule | null,
}

const initialPlayerList: Player[]= [{
  name: 'blue',
  nickName: '蓝色方',
  color: '#0693E3',
}, {
  name: 'orange',
  nickName: '橙色方',
  color: '#FF6900',
}];
const initialPlayerMap: { [key: PlayerName]: Player }= {};
initialPlayerMap[initialPlayerList[0].name] = initialPlayerList[0];
initialPlayerMap[initialPlayerList[1].name] = initialPlayerList[1];
const initialCharPool = genshinCardInfos.concat(monsterCardInfos);
const initialBPRule: BPRule= {
  name: '默认规则',
  author: '苟码',
  desc: '开发途中使用的默认规则',
  playerList: initialPlayerList,
  playerMap: initialPlayerMap,
  publicCharPool: {
    chars: initialCharPool
  },
  bpPhaseList: [{
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
  }]
}

let initialState: RuleState = {
  ruleList: [initialBPRule],
  ruleMap: {
    '默认规则': initialBPRule
  },
  curRule: null,
};

const bpRuleSlice = createSlice({
  name: 'bpRule',
  initialState,
  reducers: {
    setCurrRule: function(state, action: PayloadAction<BPRule>) {
      state.curRule = action.payload;
    },
  }
});

export const {
  setCurrRule
} = bpRuleSlice.actions
export default bpRuleSlice.reducer