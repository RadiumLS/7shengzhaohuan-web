// 规则页
import { startBP } from '../redux/banpickCharPool'
import { useState } from 'react';
import { Button, Space } from 'antd';
import { BanpickRule } from '../components/BanpickRule';
import '../styles/bp.css';
import { BpCardPool } from '../components/BpCardPool';
import { useAppDispatch, useAppSelector } from '../redux/hooks';
import { DeckCard } from '../components/DeckCard';
import { setCurrRule } from '../redux/rules';
import { Player, BPPhase } from '../type/bp';

// 未来扩展一下i18n，先放个函数包一下
const t = (i18n: string) => i18n;

// const Banpick = connect(mapStateToProps, mapDispatchToProps)(function({xx}: {xx:string[]}) {
const Rules = (function() {
  // 是否正在编辑规则
  const [editing, setEditing] = useState<Boolean>(false);
  const ruleList = useAppSelector((state) => state.bpRule.ruleList);
  // const bpActions = useAppSelector((state) => state.banpick.bpActions);
  // const dispatch = useAppDispatch();
  if(!editing) {
    return <>
      规则列表页，点击规则进行查看
      <div>
        {ruleList.map((oneRule) => {
          return <div className="miyoushe-deck" onClick={() => {
            setCurrRule(oneRule);
            setEditing(true);
          }}>
            <h4>{oneRule.name}</h4>
            <p>{oneRule.author && `作者: ${oneRule.author}`}</p>
            <p>{oneRule.desc && `描述: ${oneRule.desc}`}</p>
          </div>;
        })}
      </div>
    </>
  } else {
    return <>
      <Button onClick={() => setEditing(false)}>{t('返回规则列表页')}</Button>
      <BanpickRule
        bpRule={[]}
        bpPlayer={[]}
        addPlayer={(playerToAdd) => {
        }}
        editPlayer={(playerToEdit) => {
        }}
        addBpPhase={(phaseToAdd) => {
        }}
        delBpPhaseAt={(index) => {
        }}
      />
    </>
  }
})

export {
  Rules, 
};
