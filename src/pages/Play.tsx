// 游玩页, 用于对局模拟

import { useCallback, useState } from "react";
import { PlayerName, computeTriggerActions, drawCardsFromPile, goNextPhase, initPlayersChar, initPlayersPile, resetEntityId, rollDice, setPlayerDeckCode, startDuel, switchChar } from "../redux/play";
import { useAppDispatch, useAppSelector } from "../redux/hooks";
import { Deck } from "../redux/deck";
import MovableWrapper from "../components/play/movable_wrapper";
import CharArea from "../components/play/char_area";
// import { StartPhase } from "../type/play";
import StaringHands from "../components/play/starting_hands";
import { PhaseType, TriggerType } from "../type/enums";
import Hands from "../components/play/hands";
import { RollDiceArea } from "../components/play/roll_dice_area";
import { SelectDiceArea } from "../components/play/select_dice_area";
import { RoundPhase } from "../type/play";
import SkillArea from "../components/play/skill_area";
import { spellEntityById } from "../utils/entity_class";
import { spellDamageType } from "../utils/damage";
import { ProcessComponent } from "../components/play/process_component";

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
  const playState = useAppSelector((state) => state.play);
  const bokuDeck = useAppSelector((state) => state.play.bokuState.deck);
  const kimiDeck = useAppSelector((state) => state.play.kimiState.deck);
  const currPhase = useAppSelector((state) => state.play.currPhase);
  const historyMessages = useAppSelector((state) => state.play.historyMessages);
  const costMessages = useAppSelector((state) => state.play.costMessages);
  const estimateDamages = useAppSelector((state) => state.play.estimateDamages);
  const damageMessages = useAppSelector((state) => state.play.damageMessages);

  const bokuPile = useAppSelector((state) => state.play.bokuState.pileCards);

  const goPlay = () => {
    setPlaying(true);
    // 对局开始时重置entityId
    resetEntityId();
    dispatch(initPlayersChar());
    dispatch(initPlayersPile());
    dispatch(startDuel({offensive: offensive}));
  }

  const developSwitchChar = useCallback(() => {
    setPlaying(true);
    const defensive = offensive === 'boku' ? 'kimi' : 'boku';
    const offensiveInitAction = switchChar({player: offensive, charIndex: 1});
    const defensiveInitAction = switchChar({player: defensive, charIndex: 1});
    const offenSiveSwitchTriggerActions = computeTriggerActions(playState, TriggerType.SwitchEnd, [offensiveInitAction]);
    for(let i = 0; i < offenSiveSwitchTriggerActions.length; i++) {
      dispatch(offenSiveSwitchTriggerActions[i]);
    }
    const defensiveSwitchTriggerActions = computeTriggerActions(playState, TriggerType.SwitchEnd, [defensiveInitAction]);
    for(let i = 0; i < defensiveSwitchTriggerActions.length; i++) {
      dispatch(defensiveSwitchTriggerActions[i]);
    }
  }, [playState]);
  const developButtonClick = () => {
    const defensive = offensive === 'boku' ? 'kimi' : 'boku';
    dispatch(setPlayerDeckCode({
      player: offensive,
      deck: developDeck1,
    }));
    dispatch(setPlayerDeckCode({
      player: defensive,
      deck: developDeck2,
    }));
    dispatch(initPlayersChar());
    dispatch(initPlayersPile());
    // dispatch(startDuel({offensive: offensive}));
    dispatch(drawCardsFromPile({
      player: offensive,
      count: 5,
    }));
    dispatch(drawCardsFromPile({
      player: defensive,
      count: 5,
    }));
    dispatch(rollDice({
      player: offensive,
      count: 9,
      diceType: 'omni',
    }))
    dispatch(rollDice({
      player: defensive,
      count: 8,
    }))
    const nextPhase: RoundPhase = {
      id: 0,
      round: 1,
      player: offensive,
      name: `${offensive === 'boku' ? '本方': '对方'}行动阶段`,
      type: PhaseType.Action,
      isActive: false,
      record: [],
    };
    dispatch(goNextPhase({nextPhase}));
  }

  if(playing) {
    return <div className="bp-main-panel" style={{
      backgroundImage: 'url("/static/bg/bp_bg.png")',
      position: 'relative',
    }}>
      <div className="absolute w-40 min-h-20 border-solid border-4 border-white bg-[#fffa] left-4 top-4">
        当前阶段: <br/>
        {currPhase?.name}<br/>
        当前行动方: <br/>
        {currPhase?.player && currPhase?.player === 'boku' ? '本方' : '对方'}<br/>
      </div>
      <div className="absolute w-40 max-h-[450px] overflow-auto border-solid border-4 border-white bg-[#fffa] left-4 top-40">
        {historyMessages.map((message, index) => {
          return <p>
            {message.message}
          </p>;
        })}
      </div>
      <div className="absolute w-60 max-h-[450px] overflow-auto border-solid border-4 border-white bg-[#fffa] left-40 top-40">
        费用计算信息: <br/>
        {costMessages?.map((message, index) => {
          return <p>
            {message.message}
          </p>;
        })}
      </div>
      <div className="absolute w-60 max-h-[450px] overflow-auto border-solid border-4 border-white bg-[#fffa] left-40 top-80">
        伤害计算信息: <br/>
        {damageMessages?.map((message, index) => {
          return <p>
            {message.message}
          </p>;
        })}
        伤害估算: <br />
        {estimateDamages?.map((damage, index) => {
            const targetEntity = spellEntityById(playState, damage.target);
            return <p>{targetEntity} 受到 {damage.point} 点 {spellDamageType(damage.element)} 伤害</p>
          })
        }
      </div>
      <div className="absolute w-60 max-h-[450px] overflow-auto border-solid border-4 border-white bg-[#fffa] left-80 top-80">
        <ProcessComponent></ProcessComponent>
      </div>
      <MovableWrapper defaultPostion={{
        title: 'developArea',
        top: '12%',
        left: '70%',
        width: '30vw',
        height: '20vh',
      }}>
        Boku Pile size: {bokuPile?.length}
        <br/>
      </MovableWrapper>
      <MovableWrapper defaultPostion={{
        title: '对方角色区域',
        top: '22%',
        left: '35%',
        width: '30vw',
        height: '20vh',
      }} >
        <CharArea player='kimi'/>
      </MovableWrapper>
      <MovableWrapper defaultPostion={{
        title: '对方手牌区域',
        top: '12%',
        left: '25%',
        width: '50vw',
        height: '120px',
      }} >
        <Hands player='kimi'/>
      </MovableWrapper>
      <MovableWrapper defaultPostion={{
        title: '本方角色区域',
        top: '55%',
        left: '35%',
        width: '30vw',
        height: '20vh',
      }} >
        <CharArea player='boku'/>
      </MovableWrapper>
      <MovableWrapper defaultPostion={{
        title: '本方手牌区域',
        top: '72%',
        left: '25%',
        width: '50vw',
        height: '120px',
      }} >
        <Hands player='boku'/>
      </MovableWrapper>

      {(currPhase?.type === PhaseType.StartDraw || currPhase?.type === PhaseType.StartSwitch) && 
        currPhase.player === 'boku' &&  <MovableWrapper defaultPostion={{
            title: '本方起始手牌区域',
            top: '40%',
            left: '20%',
            width: '450px',
            height: '175px',
          }}>
            <StaringHands player="boku"/>
          </MovableWrapper>
      }
      {(currPhase?.type === PhaseType.StartDraw || currPhase?.type === PhaseType.StartSwitch) && 
        currPhase.player === 'kimi' &&  <MovableWrapper defaultPostion={{
            title: '对方起始手牌区域',
            top: '20%',
            left: '20%',
            width: '450px',
            height: '175px',
          }}>
            <StaringHands player="kimi"/>
          </MovableWrapper>
      }
      {(currPhase?.type === PhaseType.Roll || currPhase?.type === PhaseType.Reroll) &&
        currPhase.player === 'kimi' &&  <MovableWrapper defaultPostion={{
            title: '对方投掷骰子组件',
            top: '20%',
            left: '20%',
            width: '450px',
            height: '175px',
          }}>
            <RollDiceArea player="kimi"/>
          </MovableWrapper>
      }
      {(currPhase?.type === PhaseType.Roll || currPhase?.type === PhaseType.Reroll) &&
        currPhase.player === 'boku' &&  <MovableWrapper defaultPostion={{
            title: '本方投掷骰子组件',
            top: '40%',
            left: '20%',
            width: '450px',
            height: '175px',
          }}>
            <RollDiceArea player="boku"/>
          </MovableWrapper>
      }
      {(currPhase?.type === PhaseType.Action) &&
        <>
          <MovableWrapper defaultPostion={{
              title: '本方选择骰子组件',
              top: '20%',
              left: '80%',
              width: '75px',
              height: '500px',
            }}>
            <SelectDiceArea player="boku"/>
          </MovableWrapper>
          <MovableWrapper defaultPostion={{
              title: '对方选择骰子组件',
              top: '20%',
              left: '20%',
              width: '75px',
              height: '500px',
            }}>
            <SelectDiceArea player="kimi"/>
          </MovableWrapper>
          <MovableWrapper defaultPostion={{
              title: '本方技能展示组件',
              top: '80%',
              left: '70%',
              width: '300px',
              height: '50px',
            }}>
            <SkillArea player="boku"/>
          </MovableWrapper>
        </>
      }
      对局模拟的组件/页面
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
    <div>
      <button onClick={developButtonClick}>Debug专用按钮</button><br/>
      <button onClick={developSwitchChar}>Debug专用按钮2</button>
    </div>
  </div>
}

export default Play;
