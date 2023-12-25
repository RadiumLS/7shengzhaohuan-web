// 应用在play页面下的起始手牌选择器组件

import React, { useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "../../redux/hooks";
import { PlayerName, addRecordToCurrPhase, drawCardsFromPile, goNextPhase } from "../../redux/play";
import { PhaseType } from "../../type/enums";
import { StartPhase } from "../../type/play";

type ShartingHandPorp = {
  player: PlayerName,
}

const StaringHands : React.FC<ShartingHandPorp> = (prop) => {
  const { player } = prop;
  const [s1, setS1] = useState<boolean>(false);
  const [s2, setS2] = useState<boolean>(false);
  const [s3, setS3] = useState<boolean>(false);
  const [s4, setS4] = useState<boolean>(false);
  const [s5, setS5] = useState<boolean>(false);
  const switchMarkList = [s1, s2, s3, s4, s5];
  const setSwitchMark = (index: number) => {
    const funcList = [setS1, setS2, setS3, setS4, setS5];
    funcList[index]((prev) => !prev);
  }
  const dispatch = useAppDispatch();
  // TODO: 选择并替换手牌
  // TODO: 展示区域内容

  const currPhase = useAppSelector((state) => state.play.currPhase);
  const tempCards = useAppSelector((state) => player === 'boku' ? state.play.bokuState.tempCards : state.play.kimiState.tempCards);
  // 触发抽5张牌
  const startDraw = () => {
    if(currPhase?.type === PhaseType.StartDraw && currPhase?.player === player && currPhase?.isDone === false) {
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
    return <div className="">
      {currPhase.player === player && <div>
        <button onClick={startDraw}>抽{`${player === 'boku' ? '本方': '对方'}`}起始牌</button>
        <div className="flex gap-2">
          {tempCards.map((oneCard, index) => {
            const {id} = oneCard;
            return <div className="flex-1 relative" onClick={() => setSwitchMark(index)}>
              <img src={`/static/icons/${id}.png`} key={`temp_card_${index}`}
                className="w-full"
              />
              {switchMarkList[index] && <div className="absolute w-full h-1/2 bg-slate-400 top-1/4">
                TODO：标记换牌的图片
              </div>}
            </div>
          })}
        </div>
        TODO 标记要替换的牌，并且替换<br/>
        <button className="" >确认替换</button>
      </div>}
    </div>;
  } else {
    return <></>
  }
}
export default StaringHands;