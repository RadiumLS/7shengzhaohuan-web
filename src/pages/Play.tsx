// 游玩页, 用于对局模拟

import { useState } from "react";

function Play() {
  const [ playing, setPlaying] = useState<Boolean>(false);

  if(playing) {
    return <div className="bp-main-panel" style={{
      backgroundImage: 'url("/static/bg/bp_bg.png")',
    }}>
      对局模拟的组件/页面
      TODO: 初始抽卡，替换初始卡牌
      TODO: 骰子投掷，骰子重投，固定骰子
      TODO: 打牌
      TODO: 打牌-技能使用
      TODO: 打牌-装备
      TODO: 打牌-伤害结算
      TODO: 打牌-支援牌
      TODO: 打牌-召唤物
      TODO: 打牌-
      TODO: 打牌-
      TODO: 打牌-
    </div>
  }
  return <div>
    TODO: 卡组选择
    <div>
      <label>对手牌组:</label><br/>
      <button onClick={() => {}}>选择牌组</button>
    </div>
    <div>
      <label>本方牌组:</label><br/>
      <button onClick={() => {}}>选择牌组</button>
    </div>
    TODO: 猜先
    <div>
      先手方: 
    </div>
  </div>
}

export default Play;
