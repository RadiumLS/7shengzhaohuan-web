// 对局过程中投掷骰子的区域组件

import { PhaseType, Element } from "../../type/enums";
import { useAppDispatch, useAppSelector } from "../../redux/hooks";
import { Dice, PlayerName, rollDice } from "../../redux/play"

export const OneDice: React.FC<{dice: Dice}> = ({dice}) => {
  const diceConfig: Record<Dice, {name: string, className: string}> = {
    [Element.Pyro]: {
      name: "火",
      className: ""
    },
    [Element.Hydro]: {
      name: "水",
      className: ""
    },
    [Element.Geo]: {
      name: "岩",
      className: ""
    },
    [Element.Electro]: {
      name: "雷",
      className: ""
    },
    [Element.Dendro]: {
      name: "草",
      className: ""
    },
    [Element.Cryo]: {
      name: "冰",
      className: ""
    },
    [Element.Anemo]: {
      name: "风",
      className: ""
    },
    omni: {
      name: "万",
      className: ""
    }
  }
  return <div className={`border-solid border-1 border-red ${diceConfig[dice].className}`}>
    <span >
      {diceConfig[dice].name}
    </span>
  </div>
}

export const RollDiceArea : React.FC<{player: PlayerName}> = (prop) => {
  const { player } = prop;
  const pName = player === 'boku' ? '本方' : '对方';

  const dispatch = useAppDispatch();

  const currPhase = useAppSelector((state) => state.play.currPhase);
  const dices = useAppSelector((state) => player === 'boku' ? state.play.bokuState.dice : state.play.kimiState.dice);
  const startRollDice = () => {
    dispatch(rollDice({
      player,
      count: 8,
    }))
  };
  return <div className={`border-solid border-4 h-full ${player === 'boku' ? `border-boku bg-bgboku` : `border-kimi bg-bgkimi`}`}>
    {currPhase?.type === PhaseType.Roll && <button onClick={startRollDice}>
      投掷{pName}回合初始骰子
    </button>
    }
    <div className="flex">
      {dices.map((dice) => {
        // TODO: 增加骰子的点击事件
        return <div >
          <OneDice dice={dice}></OneDice>
        </div>
      })}
    </div>
  </div>;
}