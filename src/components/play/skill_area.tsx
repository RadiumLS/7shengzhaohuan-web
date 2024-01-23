// 对局过程中的角色技能展示区域

import React, { useEffect, useState } from "react";
import { PlayerName, computeTriggerActions, goNextPhase, setActiveSkill, setCurrentMessages, setRequireCost, switchChar } from "../../redux/play";
import { useAppDispatch, useAppSelector } from "../../redux/hooks";
import { PhaseType, TriggerType } from "../../type/enums";
import { DeltaCost, HistoryMessage, RollPhase, Skill, StartPhase } from "@src/type/play";
import { all } from "axios";
import { CardCost } from "@src/type/card";
import { computeSkillCost } from "../../utils/dice";
import { spellEntityById } from "../../utils/entity_class";


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
            message: `${spellEntityById(playState , deltaCost.entityId)}生效, 费用 ${deltaCost.cost}`
          });
          return {
            ...prevSkill,
            cost: computedCost,
          }
        } else {
          return prevSkill;
        }
      }, skill);
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
    dispatch(setCurrentMessages(appliedMessages[index]));
    dispatch(setRequireCost({
      player,
      requireCost: skills[index].cost,
    }));
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