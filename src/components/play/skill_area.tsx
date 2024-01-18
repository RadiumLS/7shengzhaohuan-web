// 对局过程中的角色技能展示区域

import React, { useEffect, useState } from "react";
import { PlayerName, computeTriggerActions, goNextPhase, switchChar } from "../../redux/play";
import { useAppDispatch, useAppSelector } from "../../redux/hooks";
import { PhaseType, TriggerType } from "../../type/enums";
import { RollPhase, Skill, StartPhase } from "@src/type/play";


const SkillArea : React.FC<{player: PlayerName}> = (prop) => {
  const { player } = prop;
  const [skills, setSkills] = useState<Skill[]>([]);
  const dispatch = useAppDispatch();

  const currPhase = useAppSelector((state) => state.play.currPhase);
  const playState = useAppSelector((state) => state.play);
  const playerState = useAppSelector((state) => player === 'boku' ? state.play.bokuState : state.play.kimiState);
  useEffect(() => {
    const activeIndex = playerState.activeCharIndex;
    const originSkills =  activeIndex === undefined ? [] : playerState.chars[activeIndex].skills;
    // TODO: 计算费用之后再更新到组件的skills中
    setSkills(originSkills);
  }, [currPhase, playState, playerState]);

  return <div
    className="flex w-full h-full gap-4"
  >
    {skills.map((skill) => {
      return <div className="">
        name: {skill.name}
        cost: {JSON.stringify(skill.cost)}
      </div>
    })}
  </div>
}

export default SkillArea;