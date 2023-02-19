// bp模拟页
import { startBP } from '../redux/banpickCharPool'
import { useState } from 'react';
import { Button, Space } from 'antd';
import { BanpickRule } from '../components/BanpickRule';
import '../styles/bp.css';
import { BpCardPool } from '../components/BpCardPool';
import { useAppDispatch, useAppSelector } from '../redux/hooks';
import { DeckCard } from '../components/DeckCard';

// 未来扩展一下i18n，先放个函数包一下
const t = (i18n: string) => i18n;

// const Banpick = connect(mapStateToProps, mapDispatchToProps)(function({xx}: {xx:string[]}) {
const Banpick = (function() {
  // 是否正在进行bp
  const [ bping, setBping] = useState<Boolean>(false);
  const playerList = useAppSelector((state) => state.banpick.playerList);
  const playerPool = useAppSelector((state) => state.banpick.playerPool);
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
        <h5>当前BP阶段: {curPhase?.name}</h5>
        <h5>玩家: {curPhase?.player.name}</h5>
        <h5>{curPhase?.type} {curPhase?.count} 个角色</h5>
        <h5>TODO: 时间限制以及倒计时</h5>
        <Button>TODO: 空ban按钮</Button>
      </div>
      <div className='bp-bp-actions'>
        {bpActions.map((oneAction) => <>
          {JSON.stringify(oneAction)}
        </>)}
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
    <BanpickRule/>
  </>
})

export {
  Banpick, 
};
