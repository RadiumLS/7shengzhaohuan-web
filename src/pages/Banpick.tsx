// bp模拟页
import { startBP } from '../redux/banpickCharPool'
import { useState } from 'react';
import { Button, Space } from 'antd';
import { addBpPhase, addPlayer, delAllBpPhase, delBpPhaseAt, delPlayerAt, editPlayer } from "../redux/banpickCharPool";
import { BanpickRule } from '../components/BanpickRule';
import '../styles/bp.css';
import { BpCardPool } from '../components/BpCardPool';
import { useAppDispatch, useAppSelector } from '../redux/hooks';
import { DeckCard } from '../components/DeckCard';
import { Player, BPPhase } from '../type/bp';

// 未来扩展一下i18n，先放个函数包一下
const t = (i18n: string) => i18n;

// const Banpick = connect(mapStateToProps, mapDispatchToProps)(function({xx}: {xx:string[]}) {
const Banpick = (function() {
  // 是否正在进行bp
  const [ bping, setBping] = useState<Boolean>(false);
  const bpRule = useAppSelector((state) => state.banpick.bpRule);
  // const bpPlayer = useAppSelector((state) => state.banpick.playerList);
  const playerList = useAppSelector((state) => state.banpick.playerList);
  const playerPool = useAppSelector((state) => state.banpick.playerPool);
  const publicPool = useAppSelector((state) => state.banpick.publicPool);
  const curPhase = useAppSelector((state) => state.banpick.curPhase);
  const bpActions = useAppSelector((state) => state.banpick.bpActions);
  const dispatch = useAppDispatch();
  // 正在bp时展示bp的相关信息
  if(bping) {
    return <div className="bp-main-panel" style={{
       backgroundImage: 'url("/static/bg/bp_bg.png")',
    }}>
      <Button onClick={() => setBping(false)}>{t('返回BP页')}</Button>
      <div className='bp-cur-phase'>
        { curPhase && <>
          <p>当前BP阶段: {curPhase?.name}</p>
          <p>玩家: {playerList.find((p) => p.name === curPhase?.player.name)?.nickName}</p>
          <p>
            颜色: <div className='bp-cur-phase-color' style={{backgroundColor: playerList.find((p) => p.name === curPhase?.player.name)?.color}}></div>
          </p>
          <p>行动: {curPhase?.type} {curPhase?.count} 个角色</p>
          <p>剩余时间: {curPhase?.timeLimit || '无限制'}</p>
        </>
        }
        { !curPhase && <>
          <p>BP已经结束</p>
        </>
        }
        {/*
        <p>TODO: 时间限制以及倒计时</p>
        <Button>TODO: 空ban按钮</Button>
        */}
      </div>
      <div className='bp-bp-actions'>
        {bpActions.map((oneAction) => {
          const player = playerList.find(onePlayer => onePlayer.name === oneAction.playerName)
          const charCard = publicPool.chars.find((oneChar) => oneChar.id == oneAction.cardId );
          return <>
            <p>
              <span style={{color: player?.color }}>{`${player?.nickName}`}</span>
              {`${t(oneAction.type === 'ban' ? '禁用了' : '选取了')}`}
              {`${charCard?.name}`}
            </p>
          </>
        })}
      </div>
      <div className='bp-up-player-pool'>
        {
        playerPool[playerList[0].name].chars.map((oneChar) =>
          <DeckCard id={oneChar.id.toString()} className={'bp-up-pool-card'}/>)
        }
      </div>
      <BpCardPool />
      <div className='bp-down-player-pool'>
        {
        playerPool[playerList[1].name].chars.map((oneChar) =>
          <DeckCard id={oneChar.id.toString()} className={'bp-down-pool-card'}/>)
        }
      </div>
    </div>;
  }
  return <>
    <Space>
      <Button onClick={() => {
        setBping(true);
        dispatch(startBP());
      }}>{t('开始单人BP')}</Button>
    </Space>
    <BanpickRule
      bpRule={bpRule}
      bpPlayer={playerList}
      addPlayer={(playerToAdd) => {
        dispatch(addPlayer(playerToAdd));
      }}
      editPlayer={(playerToEdit) => {
        dispatch(editPlayer(playerToEdit));
      }}
      addBpPhase={(phaseToAdd) => {
        dispatch(addBpPhase(phaseToAdd));
      }}
      delBpPhaseAt={(index) => {
        dispatch(delBpPhaseAt(index));
      }}
    />
  </>
})

export {
  Banpick, 
};
