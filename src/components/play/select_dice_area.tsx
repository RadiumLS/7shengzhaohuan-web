// 对局过程中选择要消耗的骰子的区域的组件

import { PhaseType, Element } from "../../type/enums";
import { useAppDispatch, useAppSelector } from "../../redux/hooks";
import { Dice, PlayerName, goNextPhase, rollDice, rerollDice, setDice } from "../../redux/play"
import { useEffect, useState } from "react";
import { OneDice } from "./roll_dice_area";
import { checkCostMatch, spellCosts, spellDices } from "../../utils/dice";
import { RoundPhase } from "@src/type/play";

export const SelectDiceArea : React.FC<{player: PlayerName}> = (prop) => {
  const { player } = prop;
  const pName = player === 'boku' ? '本方' : '对方';
  const [diceMatchCost, setDiceMatchCost] = useState<boolean>(false);
  const [selectedFlags, setSelectedFlags] = useState<boolean[]>([]);
  const switchSelectedIndex = (index: number) => {
    setSelectedFlags((prev) => {
      const newFlags = [...prev];
      newFlags[index] = !newFlags[index];
      return newFlags;
    });
  }
  const [confirm, setConfirm] = useState<boolean>(false);

  const dispatch = useAppDispatch();

  const currPhase = useAppSelector((state) => state.play.currPhase);
  const dices = useAppSelector((state) => player === 'boku' ? state.play.bokuState.dice : state.play.kimiState.dice);
  const requireCost =  useAppSelector((state) => player === 'boku' ? state.play.bokuState.requireCost : state.play.kimiState.requireCost);
  const playerState = useAppSelector((state) => player === 'boku' ? state.play.bokuState : state.play.kimiState);
  useEffect(() => {
    setSelectedFlags(new Array(dices.length).fill(false));
  }, [dices]);
  const confirmDice = () => {
    // 检查骰子是否满足消耗条件
    if(!diceMatchCost) {
      return;
    }
    const energyCost = requireCost?.find((cost) => cost.type === 'energy');
    // 有充能需求的情况下要检查充能
    if(energyCost) {
      const activeIndex = playerState.activeCharIndex;
      const char =  activeIndex === undefined ? playerState.chars[0] : playerState.chars[activeIndex];
      if(char.energy != energyCost.cost) return;
    }
    // 剩余骰子
    const leftDices = dices.filter((dice, diceIndex) => (!selectedFlags[diceIndex]));
    dispatch(setDice({
      player: player,
      dices: leftDices,
    }));
    const nextPhase: RoundPhase = {
      id: 0,
      round: currPhase?.round || 0,
      player: player,
      name: `结算技能阶段`,
      type: PhaseType.Process,
      isActive: false,
      record: [],
    };
    const nextPhaseAction = goNextPhase({
      nextPhase,
    });
    // XXX: 技能的结算移动到Process的Phase中处理了
    dispatch(nextPhaseAction);
  };
  useEffect(() => {
    if(requireCost) {
      const selectedDices = dices.filter((dice, diceIndex) => (selectedFlags[diceIndex]))
      setDiceMatchCost(checkCostMatch(requireCost, selectedDices));
    }
  }, [selectedFlags, dices, requireCost]);
  return <div className={`releative border-solid border-4 h-full ${player === 'boku' ? `border-boku bg-bgboku` : `border-kimi bg-bgkimi`}`}>
    {requireCost && <div className="absolute border-solid border-1 left-full w-20 bg-gray-500">
      需要消耗: {spellCosts(requireCost)}
      <br />
      已经选择: {spellDices(dices.filter((dice, index) => selectedFlags[index]))}
      <br />
      是否匹配：{diceMatchCost ? '匹配' : '不匹配'}
      <br />
      <button onClick={confirmDice}>
        {pName}确认消耗骰子
      </button>
    </div>}
    
    <div className="w-16 flex flex-col">
      {dices.map((dice, index) => {
        return <div
          className={`w-16 h-16 ${selectedFlags[index] ? 'bg-red-500' : ''}`}
          onClick={() => switchSelectedIndex(index)}
          key={index}
        >
            <OneDice dice={dice}></OneDice>
        </div>
      })}
    </div>
  </div>;
}