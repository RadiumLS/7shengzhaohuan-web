// bp模拟页
import { createPool } from '../redux/banpickCharPool'
import { useState } from 'react';
import { Button, Space } from 'antd';
import { BanpickRule } from '../components/BanpickRule';
import '../styles/bp.css';
import { BpCardPool } from '../components/BpCardPool';
import { useAppSelector } from '../redux/hooks';
import { DeckCard } from '../components/DeckCard';

// 未来扩展一下i18n，先放个函数包一下
const t = (i18n: string) => i18n;

// const Banpick = connect(mapStateToProps, mapDispatchToProps)(function({xx}: {xx:string[]}) {
const Banpick = (function() {
  // 是否正在进行bp
  const [ bping, setBping] = useState<Boolean>(false);
  const playerList = useAppSelector((state) => state.banpick.playerList);
  const playerPool = useAppSelector((state) => state.banpick.playerPool);
  // const dispatch = useAppDispatch();
  // 正在bp时展示bp的相关信息
  if(bping) {
    return <div className="bp-main-panel" style={{
       backgroundImage: 'url("/static/bg/bp_bg.png")',
    }}>
      <Button onClick={() => setBping(false)}>{t('返回BP页')}</Button>
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
      <br></br>
      TODO: 页面布局 <br></br>
      TODO：英雄池的展示 <br></br>
      TODO：bp操作的进行 <br></br>
      TODO：bp阶段的流转<br></br>
    </div>;
  }
  return <>
    <Space>
      <Button onClick={() => setBping(true)}>{t('开始单人BP')}</Button>
    </Space>
    <BanpickRule/>
  </>
})

export {
  Banpick, 
};
