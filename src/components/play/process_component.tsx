// 进行结算的组件

import { useAppDispatch, useAppSelector } from "../../redux/hooks";
import { appendElement, computeTriggerActions, dealDamage, setProcessingAction } from "../../redux/play";
import { PhaseType, TriggerType } from "../../type/enums";
import { useEffect, useState } from "react";
import { Damage, DamageChange, DeltaCost, HistoryMessage, RollPhase, Skill, StartPhase } from "../../type/play";
import { computeDamages } from "../../utils/damage";

const ACTION_INTERVAL = 1000;
/** 正在结算中的effect类型 */
enum ProcessingEffectType {
  /** 技能 */
  SkillEffect,
  /** 倒下 */
  DownEffect,
  /** 使用技能后 */
  SkillAfterEffect,
  /** 切换角色后 */
  SwitchAfterEffect,
  /** 下一个行动方或者回合结束 */
  NextRoundPhase,
}
const peType = ProcessingEffectType

export const ProcessComponent : React.FC = (prop) => {
  const [processing, setProcessing] = useState<boolean>(false);
  const [processingType, setProcessingType] = useState<ProcessingEffectType>(peType.SkillEffect)
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
          // TODO: 记录一下对应的消息
        }, i * ACTION_INTERVAL)
      }
      setTimeout(() => {
        // TODO: 结算完毕后, 判断是否需要进行下一阶段
        setProcessingType((originType) => {
          if(originType === peType.SkillEffect || originType === peType.SkillAfterEffect) {
            return peType.DownEffect;
          }
          if(originType === peType.DownEffect) {
            return peType.SkillAfterEffect;
          }
          return originType;
        })
      }, effectList.length * ACTION_INTERVAL)
    } else {
      setProcessingType(peType.NextRoundPhase);
    }
  }, [effectList])

  useEffect(() => {
    if(processingType === peType.DownEffect) {
      // TODO: 检查倒下的判断
      // TODO: 设置新的effectList
    }
    if(processingType === peType.SwitchAfterEffect) {
      // TODO: 检查有没有「切换角色后」的effect
      // TODO: 设置新的effectList
    }
    if(processingType === peType.SkillAfterEffect) {
      // TODO: 检查有没有「使用技能后」的effect
      // TODO: 设置新的effectList
      // TODO: 如果没有新的effectList，则setEffectList为空数组, 触发行动方的检查
    }
    if(processingType === peType.NextRoundPhase) {
      // TODO: 检查下个阶段是对方行动/本方行动/回合结束
    }
  }, [processingType])

  const checkSkillAfterEffect = (skill: Skill) => {
  }

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