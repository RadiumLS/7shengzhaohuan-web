// 对局过程中投掷骰子的区域组件

import { PhaseType, Element } from "../../type/enums";
import { useAppDispatch, useAppSelector } from "../../redux/hooks";
import { Dice, PlayerName, goNextPhase, rollDice } from "../../redux/play"
import { ActionPhase, RerollPhase, RollPhase } from "@src/type/play";

export const OneDice: React.FC<{dice: Dice}> = ({dice}) => {
  return <div className={`w-16 h-16 border-solid border-1 border-transparent bg-contain flex items-center justify-center`}
    style={{
      backgroundImage: `url(/static/dices/${dice.toLowerCase()}_bg.png)`,
    }}
  >
    <img src={`/static/dices/${dice.toLowerCase()}_el.png`} 
      className="w-8 h-8 absolute flex-1"
    />
  </div>
}

export const RollDiceArea : React.FC<{player: PlayerName}> = (prop) => {
  const { player } = prop;
  const pName = player === 'boku' ? '本方' : '对方';

  const dispatch = useAppDispatch();

  const currPhase = useAppSelector((state) => state.play.currPhase);
  const dices = useAppSelector((state) => player === 'boku' ? state.play.bokuState.dice : state.play.kimiState.dice);
  const startRollDice = () => {
    // TODO: 处理可能的投掷前的Trigger,典型的是元素圣遗物和群玉阁
    dispatch(rollDice({
      player,
      count: 8,
    }))
    // 开始的投掷只会有一次, 马上进入同player的重投阶段
    const nextPhase: RerollPhase = {
      id: 0,
      player: player,
      name: `${player === 'boku' ? '本方': '对方'}选择重掷骰子`,
      type: PhaseType.Reroll,
      rerollType: 'roll',
      offensive: (currPhase as RollPhase).offensive,
      isActive: false,
      record: [],
    };
    dispatch(goNextPhase({nextPhase}));
  };
  const rerollDice = () => {
    // TODO: 重新投掷选中的骰子
    // TODO: 检查所有实体的AfterRerollTrigger, 决定继续重掷还是切换到下一个人投掷
    // 如果已经没有额外的重掷过程
    // 如果当前是先手方则启动后手方的投掷
    if((currPhase as RerollPhase).offensive === player) {
      const nextRollPlayer = player === 'boku' ? 'kimi' : 'boku';
      const nextPhase: RollPhase = {
        id: 0,
        player: nextRollPlayer,
        name: `${nextRollPlayer === 'boku' ? '本方': '对方'}回合开始投掷骰子`,
        type: PhaseType.Roll,
        isActive: false,
        offensive: player,
        record: [],
      };
      dispatch(goNextPhase({nextPhase}));
    } else {
      // TODO: 注意这里应当是已经判断完是否是行动阶段内重掷的逻辑
      // 如果后手方的重掷也已经完成, 那么启动先手方的行动阶段
      const actionPlayer = player === 'boku' ? 'kimi' : 'boku';
      const nextPhase: ActionPhase = {
        id: 0,
        player: actionPlayer,
        name: `${actionPlayer === 'boku' ? '本方': '对方'}行动阶段`,
        type: PhaseType.Action,
        isActive: false,
        record: [],
      };
      dispatch(goNextPhase({nextPhase}));
    }
  };
  return <div className={`border-solid border-4 h-full ${player === 'boku' ? `border-boku bg-bgboku` : `border-kimi bg-bgkimi`}`}>
    {currPhase?.type === PhaseType.Roll && <button onClick={startRollDice}>
      投掷{pName}回合初始骰子
    </button>
    }
    {currPhase?.type === PhaseType.Reroll && <button onClick={rerollDice}>
      {pName}重掷选中的骰子
    </button>
    }
    <div className="flex">
      {dices.map((dice) => {
        // TODO: 增加骰子的点击事件以标记需要重掷的骰子
        return <div className="w-20">
          <OneDice dice={dice}></OneDice>
        </div>
      })}
    </div>
  </div>;
}