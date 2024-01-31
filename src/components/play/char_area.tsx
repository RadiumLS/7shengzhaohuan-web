// 对局过程中的角色牌展示区域

import React, { useState } from "react";
import { PlayerName, appendHistoryMessages, computeTriggerActions, goNextPhase, switchChar } from "../../redux/play";
import { useAppDispatch, useAppSelector } from "../../redux/hooks";
import { PhaseType, TriggerType } from "../../type/enums";
import { CharEntity, HistoryMessage, RollPhase, StartPhase } from "@src/type/play";
import { Element } from '@src/type/enums';


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

  const trySwitchChar = (index: number) => {
    // 只有开始阶段,回合中的ActionPhase, 还有阵亡时 才能切换角色
    if(currPhase?.player === player) {
      if(currPhase?.type === PhaseType.StartSelectChar
        || currPhase?.type === PhaseType.Action
        || currPhase?.type === PhaseType.DeadSwitch
      ) {
        setSwitchConfirm((prev) => !prev);
        setSwitchIndex(index);
      }
    }
  };
  const switchToChar = (index: number) => {
    // TODO: 根据当前阶段来判断是否需要执行SwitchStart的trigger们
    const initAction = switchChar({player, charIndex: index});
    const historyMessage = appendHistoryMessages({
      messages: [{
        message: `${player === 'boku' ? '我方' : '对方'}切换至角色:${chars[index].name}`,
      }]
    })
    const allTriggerAction = computeTriggerActions(playState, TriggerType.SwitchEnd, [initAction, historyMessage]);

    if(currPhase?.type === PhaseType.StartSelectChar) {
      // 如果是开局选择角色阶段, 根据当前是否是先手角色来决定下一阶段是后手开局选择角色还是回合开始的投掷阶段
      const offensive = (currPhase as StartPhase).offensive;
      if(offensive === player) {
        // 当前角色是先手方, 则开启后手选择出战角色
        const defensivePlayer = player === 'boku' ? 'kimi' : 'boku';
        const nextPhase: StartPhase = {
          id: 0,
          round: 0,
          player: defensivePlayer,
          name: `开始阶段_后手方选择出战角色`,
          type: PhaseType.StartSelectChar,
          isActive: false,
          record: [],
          offensive,
        };
        const nextPhaseAction = goNextPhase({
          nextPhase,
        });
        allTriggerAction.push(nextPhaseAction);
      } else {
        // 当前角色不是先手方, 则说明双方选择出战角色完毕
        // 开启第一个回合的投掷阶段
        const nextPhase: RollPhase = {
          id: 0,
          round: currPhase.round + 1,
          player: offensive,
          name: `回合阶段_先手方投掷阶段`,
          type: PhaseType.Roll,
          isActive: false,
          record: [],
          offensive,
        };
        const nextPhaseAction = goNextPhase({
          nextPhase,
        });
        allTriggerAction.push(nextPhaseAction);
      }
    }
    // TODO: 如果是回合中的行动阶段, 那么要根据是否是快速行动阶段来决定下一阶段是谁的行动阶段
    for(let i = 0; i < allTriggerAction.length; i++) {
      dispatch(allTriggerAction[i]);
    }
  };
  return <div
    className="flex w-full h-full gap-4"
  >
    {
      chars.map((oneChar, index) => {
        const {id, icon} = oneChar;
        return <div
          className={`flex-1 relative ${playerState.activeCharIndex === index && (player === 'boku' ? '-top-8' : 'top-8')}`}
          key={`boku_char_${index}`}
          onClick={() => {
            trySwitchChar(index);
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
            <img src={`${icon}`} className="max-h-full"/>
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