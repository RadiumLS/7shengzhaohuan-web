// 进行结算的组件

import { useAppDispatch, useAppSelector } from "../../redux/hooks";
import { appendElement, computeTriggerActions, dealDamage, setProcessingAction } from "../../redux/play";
import { PhaseType, TriggerType } from "../../type/enums";
import { useEffect, useState } from "react";
import { Damage, DamageChange, DeltaCost, HistoryMessage, RollPhase, Skill, StartPhase } from "../../type/play";
import { computeDamages } from "../../utils/damage";

const ACTION_INTERVAL = 1000;

export const ProcessComponent : React.FC = (prop) => {
  const [processing, setProcessing] = useState<boolean>(false);
  const [currEffect, setCurrEffect] = useState<any>(undefined);
  const [effectList, setEffectList] = useState<any[]>([]);
  const dispatch = useAppDispatch();
  const currPhase = useAppSelector((state) => state.play.currPhase);
  const playState = useAppSelector((state) => state.play);
  const activeSkill = useAppSelector((state) => {
    const currPhase = state.play.currPhase;
    const player = currPhase?.player;
    return player === 'boku' ? state.play.bokuState.activeSkill : state.play.kimiState.activeSkill;
  });
  useEffect(() => {
    if(currPhase?.type === PhaseType.Process && !processing) {
      setProcessing(true);
    }
  }, [currPhase, processing])

  useEffect(() => {
    if(activeSkill && activeSkill.effect && processing && playState) {
      const payloadList = [];
      const skillEffects = activeSkill.effect(playState)
      // TODO: 处理DamageChange等事件, 最后得到真正的effectList
      const allActions = computeTriggerActions(playState, TriggerType.DamageChangeBefore, []);
      const changeDamagePayloads =
        allActions.filter((action) => action.type === 'play/changeDamage')
          .map((action) => action.payload as DamageChange);
      const originDamagePayloads =
        skillEffects.filter((action) => action.type === 'play/dealDamage')
          .map((action) => action.payload as Damage);
      for(let i = 0; i< originDamagePayloads.length; i++) {
        const oneDamage = originDamagePayloads[i];
        const {
          computedDamages,
          elementChanges,
          effect,
          appliedEntityIds,
          messages,
        } = computeDamages(playState, oneDamage, changeDamagePayloads);
        payloadList.push(...(computedDamages.map((damage) => (dealDamage(damage)))));
        payloadList.push(...(elementChanges.map((elementChange) => (appendElement(elementChange)))));
      }
      setEffectList(payloadList);
    }
  }, [activeSkill, processing]);
  useEffect(() => {
    if(effectList.length > 0) {
      for(let i=0; i< effectList.length; i++) {
        setTimeout(() => {
          dispatch(effectList[i]);
          dispatch(setProcessingAction(effectList[i]));
        }, i * ACTION_INTERVAL)
      }
      setTimeout(() => {
        // TODO: 结算完毕后, 判断是否需要进行下一阶段
      }, effectList.length * ACTION_INTERVAL)
    }
  }, [effectList])

  if(currPhase?.type !== PhaseType.Process) {
    return <></>;
  }
  // const playerState = useAppSelector((state) => player === 'boku' ? state.play.bokuState : state.play.kimiState);
  // TODO: 获取激活的技能, 逐一展示其效果
  // TODO: 并且更新历史信息
  // TODO: 进行阵亡/游戏结束的判定
  // TODO: 没有新的效果需要结算后, 判断进行另一方的行动阶段, 还是继续自己行动
  return <div>
    processing: {JSON.stringify(processing)}
  </div>
}