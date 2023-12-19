// 游玩页, 用于对局模拟

import { useState } from "react";
import { PlayerName, setPlayerDeckCode } from "../redux/play";
import { useAppDispatch, useAppSelector } from "../redux/hooks";
import { Deck } from "../redux/deck";

const developDeck1: Deck = {
  deckTitle: '开发用卡组1',
  deckCode: 'AUBw9Q0PAmCQ9kkPBXAw+FMPB5CQ+okPCLCg/KIPCtGQCrUQC7GADcIQDOGAEPIRDxAA',
};
const developDeck2: Deck = {
  deckTitle: '开发用卡组2',
  deckCode: 'ATBA5BIOAkAg8U4PBTDg9l4PCWBw/ZwPCdHAC7wQC7HQDsEQDPGQD8kRDRHgE+MRDjAA',
}

function Play() {
  const [ playing, setPlaying] = useState<Boolean>(false);
  const [ offensive, setOffensive] = useState<PlayerName>('boku');
  const dispatch = useAppDispatch();
  const setDeck = (player: PlayerName, deck: Deck) => {
    dispatch(setPlayerDeckCode({
      player: player,
      deck: deck,
    }));
  }
  const bokuDeck = useAppSelector((state) => state.play.bokuState.deck);
  const kimiDeck = useAppSelector((state) => state.play.kimiState.deck);

  const goPlay = () => {
    setPlaying(true);
  }

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
      <label>对手牌组: {kimiDeck?.deckTitle || '未知卡组'}</label><br/>
      <button onClick={() => setDeck('kimi', developDeck1)}>选择牌组</button>
    </div>
    <div>
      <label>本方牌组: {bokuDeck?.deckTitle ||  '未知卡组'}</label><br/>
      <button onClick={() => setDeck('boku', developDeck2)}>选择牌组</button>
    </div>
    TODO: 猜先<br/>
    <button onClick={() => setOffensive('boku')}>本方先手</button>
    <button onClick={() => setOffensive('kimi')}>对方先手</button>
    <div>
      先手方: {offensive === 'kimi' ? '对方' : '本方'}
    </div>
    <div>
      <button onClick={goPlay}>开始模拟</button>
    </div>
  </div>
}

export default Play;
