// 应用在play页面下的起始手牌选择器组件

import React, { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "../../redux/hooks";
import { PlayerName, addRecordToCurrPhase, drawCardsFromPile, goNextPhase } from "../../redux/play";
import { PhaseType } from "../../type/enums";
import { StartPhase } from "../../type/play";

type ShartingHandPorp = {
  player: PlayerName,
}

const StaringHands : React.FC<ShartingHandPorp> = (prop) => {
  const { player } = prop;
  const dispatch = useAppDispatch();
  // TODO: 选择并替换手牌
  // TODO: 展示区域内容
  const currPhase = useAppSelector((state) => state.play.currPhase);
  const tempCards = useAppSelector((state) => player === 'boku' ? state.play.bokuState.tempCards : state.play.kimiState.tempCards);
  // 触发抽5张牌
  const startDraw = () => {
    if(currPhase?.type === PhaseType.StartDraw && currPhase?.player === player && currPhase?.isDone === false) {
      console.log(`====== 1000 dispatch drawCardsFromPile`);
      dispatch(drawCardsFromPile({
        player: currPhase.player,
        count: 5,
      }));
    }
  };
  // 已经抽了5张牌之后就记录并且跳转下一阶段
  useEffect(() => {
    if(currPhase?.type === PhaseType.StartDraw && currPhase?.player === player) {
      if(tempCards?.length === 5) {
        console.log(`====== 1100 dispatch addRecordToCurrPhase`);
        dispatch(addRecordToCurrPhase({
          record: {
            player: player,
            phase: currPhase,
            record: '已经抽了5张牌'
          }
        }))
        const nextPhase: StartPhase = {
          id: 0,
          player: player,
          name: `${player}选择替换手牌`,
          type: PhaseType.StartSwitch,
          isActive: false,
          record: [],
          offensive: (currPhase as StartPhase).offensive,
        };
        dispatch(goNextPhase({
          nextPhase, 
        }))
      }
    }
  }, [tempCards]);
  if(currPhase?.type === PhaseType.StartDraw || currPhase?.type === PhaseType.StartSwitch) {
    // 是当前玩家的之后才展示
    return <>
      {currPhase.player === player && <div>
        TODO<br/>
        <button onClick={startDraw}>抽起始牌</button>
        {tempCards?.length}
      </div>}
    </>
  } else {
    return <></>
  }
}
export default StaringHands;