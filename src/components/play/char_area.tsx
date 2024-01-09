// 对局过程中的角色牌展示区域

import React, { useState } from "react";
import { PlayerName, computeTriggerActions, switchChar } from "../../redux/play";
import { useAppDispatch, useAppSelector } from "../../redux/hooks";
import { TriggerType } from "../../type/enums";


const CharArea : React.FC<{player: PlayerName}> = (prop) => {
  const { player } = prop;
  const [switchConfirm, setSwitchConfirm] = useState<boolean>(false);
  const [switchIndex, setSwitchIndex] = useState<number>(0);
  // TODO: 展示角色牌
  // TODO: 展示血量、充能
  // TODO: 展示出战状态
  // TODO: 展示角色状态
  // TODO: 展示装备、天赋状态
  // TODO: 切换角色的逻辑估计要写这里面了
  const dispatch = useAppDispatch();

  const currPhase = useAppSelector((state) => state.play.currPhase);
  const playState = useAppSelector((state) => state.play);
  const playerState = useAppSelector((state) => player === 'boku' ? state.play.bokuState : state.play.kimiState);
  const chars = useAppSelector((state) => player === 'boku' ? state.play.bokuState.chars : state.play.kimiState.chars);
  const switchToChar = (index: number) => {
    const initAction = switchChar({player, charIndex: index});
    const allTriggerAction = computeTriggerActions(playState, TriggerType.SwitchEnd, [initAction]);
    for(let i = 0; i < allTriggerAction.length; i++) {
      dispatch(allTriggerAction[i]);
    }
    // TODO: 触发切换角色的逻辑
  };
  return <div
    className="flex w-full h-full gap-4"
  >
    {
      chars.map((oneChar, index) => {
        const {id} = oneChar;
        return <div
          className={`flex-1 relative ${playerState.activeCharIndex === index && (player === 'boku' ? '-top-8' : 'top-8')}`}
          key={`boku_char_${index}`}
          onClick={() => {
            setSwitchConfirm((prev) => !prev);
            setSwitchIndex(index);
          }}
        >
          <div className="relative w-full h-full">
            <div className="absolute w-8 h-8 top-0 left-0 flex text-2xl text-white">
              {
                // TODO: 用组件展示血量
                oneChar.health
              }
            </div>
            <div className="absolute w-8 h-16 top-0 right-0 flex text-2xl text-white">
              {
                // TODO: 用组件展示充能
                oneChar.energy
              }
            </div>
            {
              // TODO: 展示装备区域, 包括天赋、武器、圣遗物
            }
            <img src={`/static/icons/${id}.png`} className="max-h-full"/>
            <div className="absolute w-full h-8 top-32 flex">
              {oneChar.charState.map((oneState, index) => {
                // TODO: 角色状态的展示, 需要补充图片
                return <div className="flex-1 ">
                  {oneState.name}
                </div>
              })}
            </div>
            {switchConfirm && switchIndex === index &&
              <div className="absolute w-full h-1/2 bg-slate-400 top-1/4">
                TODO: 标记切换角色的图片
                <br/>
                <button onClick={() => {switchToChar(index)}}>确定切换</button>
              </div>
            }
            {playerState.activeCharIndex === index && playerState.activeState.length > 0 &&
              <div className="absolute w-full h-8 top-full flex">
                {playerState.activeState.map((oneState, index) => {
                  // TODO: 出战状态的展示, 需要补充图片
                  return <div className="flex-1 ">
                    {oneState.name}
                  </div>
                })}
              </div>
            }
          </div>
        </div>;
      })
    }
  </div>
}

export default CharArea;