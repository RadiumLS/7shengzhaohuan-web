// 对局过程中的角色技能展示区域

import React, { useEffect, useState } from "react";
import { PlayerName, computeTriggerActions, goNextPhase, setActiveSkill, setCostMessages, setDamageMessages, setRequireCost, switchChar } from "../../redux/play";
import { useAppDispatch, useAppSelector } from "../../redux/hooks";
import { PhaseType, TriggerType } from "../../type/enums";
import { Damage, DamageChange, DeltaCost, HistoryMessage, RollPhase, Skill, StartPhase } from "@src/type/play";
import { all } from "axios";
import { CardCost } from "@src/type/card";
import { computeSkillCost, spellCosts } from "../../utils/dice";
import { spellEntityById } from "../../utils/entity_class";
import { computeDamages } from './../../utils/damage';


const SkillArea : React.FC<{player: PlayerName}> = (prop) => {
  const { player } = prop;
  const [skills, setSkills] = useState<Skill[]>([]);
  const [activeSkillIndex, setActiveSkillIndex] = useState<number>(-1);
  // 技能的费用变化生效了的信息
  const [appliedMessages, setAppliedMessages] = useState<HistoryMessage[][]>([]);
  // const [deltaCostActions, setDeltaCostActions] = useState<DeltaCost[]>([]);
  const dispatch = useAppDispatch();

  const currPhase = useAppSelector((state) => state.play.currPhase);
  const playState = useAppSelector((state) => state.play);
  const playerState = useAppSelector((state) => player === 'boku' ? state.play.bokuState : state.play.kimiState);
  useEffect(() => {
    const activeIndex = playerState.activeCharIndex;
    const originSkills =  activeIndex === undefined ? [] : playerState.chars[activeIndex].skills;
    const allActions = computeTriggerActions(playState, TriggerType.CostBefore, []);
    const deltaCostPayloads = allActions.filter((action) => action.type === 'play/changeCost').map((action) => action.payload as DeltaCost);
    const deltaCostAppliedMessages: HistoryMessage[][] = [];
    const computedSkills = originSkills.map((skill, index) => {
      deltaCostAppliedMessages[index] = [];
      const reduceComputedSkill = deltaCostPayloads.reduce((prevSkill, deltaCost) => {
        const {applied, computedCost} = computeSkillCost(prevSkill, deltaCost);
        if(applied) {
          deltaCostAppliedMessages[index].push({
            message: `${spellEntityById(playState , deltaCost.entityId)}生效, 费用 ${spellCosts(deltaCost.cost)}`
          });
          return {
            ...prevSkill,
            cost: computedCost,
          }
        } else {
          return prevSkill;
        }
      }, skill);
      setAppliedMessages(deltaCostAppliedMessages);
      return reduceComputedSkill;
    });
    setSkills(computedSkills);
  }, [currPhase, playState, playerState]);

  const setActiveSkillByIndex = (index: number) => {
    setActiveSkillIndex(index);
    dispatch(setActiveSkill({
      player,
      activeSkill: skills[index],
    }));
    dispatch(setCostMessages(appliedMessages[index]));
    dispatch(setRequireCost({
      player,
      requireCost: skills[index].cost,
    }));
    const skill = skills[index];
    // TODO: 收集伤害试算的结果，然后想办法进行展示
    const damages: Damage[] = [];
    // TODO: 收集伤害试算的消息, 然后想办法进行展示
    const damageMessages: HistoryMessage[] = [];
    if(skill.effect) {
      // 伤害试算是在这里触发的
      const actions = skill.effect(playState);
      const allActions = computeTriggerActions(playState, TriggerType.DamageChangeBefore, []);
      // TODO: 元素反应的相关Trigger也要在此处计算
      const changeDamagePayloads =
        allActions.filter((action) => action.type === 'play/changeDamage')
          .map((action) => action.payload as DamageChange);
      const originDamagePayloads =
        actions.filter((action) => action.type === 'play/dealDamage')
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
        damageMessages.push(...messages);
      }
    }
    // TODO: 补充行动后Trigger等的伤害试算
    // 展示伤害计算的信息
    dispatch(setDamageMessages(damageMessages));
  }

  return <div
    className="flex w-full h-full gap-4"
  >
    {skills.map((skill, index) => {
      return <div className={`${index === activeSkillIndex ? 'bg-red-500' : ''}`}
        onClick={() => {setActiveSkillByIndex(index)}}
      >
        name: {skill.name}
        cost: {JSON.stringify(skill.cost)}
      </div>
    })}
  </div>
}

export default SkillArea;