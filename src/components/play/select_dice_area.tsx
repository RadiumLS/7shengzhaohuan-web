// 对局过程中选择要消耗的骰子的区域的组件

import { PhaseType, Element } from "../../type/enums";
import { useAppDispatch, useAppSelector } from "../../redux/hooks";
import { Dice, PlayerName, goNextPhase, rollDice, rerollDice } from "../../redux/play"
import { useEffect, useState } from "react";
import { OneDice } from "./roll_dice_area";

export const SelectDiceArea : React.FC<{player: PlayerName}> = (prop) => {
  const { player } = prop;
  const pName = player === 'boku' ? '本方' : '对方';
  const [selectedFlags, setSelectedFlags] = useState<boolean[]>([]);
  const switchSelectedIndex = (index: number) => {
    setSelectedFlags((prev) => {
      const newFlags = [...prev];
      newFlags[index] = !newFlags[index];
      return newFlags;
    })
  }
  const [confirm, setConfirm] = useState<boolean>(false);

  const dispatch = useAppDispatch();

  const currPhase = useAppSelector((state) => state.play.currPhase);
  const dices = useAppSelector((state) => player === 'boku' ? state.play.bokuState.dice : state.play.kimiState.dice);
  useEffect(() => {
    setSelectedFlags(new Array(dices.length).fill(false));
  }, [dices]);
  const confirmDice = () => {
  };
  return <div className={`border-solid border-4 h-full ${player === 'boku' ? `border-boku bg-bgboku` : `border-kimi bg-bgkimi`}`}>
    {confirm && <button onClick={confirmDice}>
      {pName}骰子确认
    </button>
    }
    <div className="w-16 flex flex-col">
      {dices.map((dice, index) => {
        return <div className={`w-16 h-16 ${selectedFlags[index] ? 'bg-red-500' : ''}`} onClick={() => switchSelectedIndex(index)}>
            <OneDice dice={dice}></OneDice>
        </div>
      })}
    </div>
  </div>;
}