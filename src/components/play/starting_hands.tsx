// 应用在play页面下的起始手牌选择器组件

import React, { useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "../../redux/hooks";
import { PlayerName, addRecordToCurrPhase, drawCardsFromPile, dropTempCards, goNextPhase, pushHandCards, returnCardsToPile } from "../../redux/play";
import { ActionCardType, PhaseType } from "../../type/enums";
import { StartPhase } from "../../type/play";
import { ActionCard } from "../../type/card";

type ShartingHandPorp = {
  player: PlayerName,
}

const StaringHands : React.FC<ShartingHandPorp> = (prop) => {
  const { player } = prop;
  const [switched, setSwitched] = useState<boolean>(false);
  // 最后的初始手牌确认
  const [confirm, setConfirm] = useState<boolean>(false);
  const [s1, setS1] = useState<boolean>(false);
  const [s2, setS2] = useState<boolean>(false);
  const [s3, setS3] = useState<boolean>(false);
  const [s4, setS4] = useState<boolean>(false);
  const [s5, setS5] = useState<boolean>(false);
  const switchMarkList = [s1, s2, s3, s4, s5];
  const setSwitchMarkList = [setS1, setS2, setS3, setS4, setS5];
  const setSwitchMark = (index: number) => {
    if(switched) return;
    const funcList = [setS1, setS2, setS3, setS4, setS5];
    funcList[index]((prev) => !prev);
  }
  const [returnCards, setReturnCards] = useState<ActionCard[]>([]); // 用于记录要换回的卡牌的index
  const dispatch = useAppDispatch();

  const currPhase = useAppSelector((state) => state.play.currPhase);
  const tempCards = useAppSelector((state) => player === 'boku' ? state.play.bokuState.tempCards : state.play.kimiState.tempCards);
  const pileCards = useAppSelector((state) => player === 'boku' ? state.play.bokuState.pileCards : state.play.kimiState.pileCards);
  // 触发抽5张牌
  const startDraw = () => {
    if(currPhase?.type === PhaseType.StartDraw && currPhase?.player === player && currPhase?.isDone === false) {
      let arcaneCount = 0
      if(pileCards) {
        for(let i = 0; i < pileCards.length; i++) {
          if(pileCards[i].type === 'arcane') {
            arcaneCount++;
          }
        }
      }
      if(arcaneCount === 0) {
        dispatch(drawCardsFromPile({
          player: currPhase.player,
          count: 5,
        }));
      } else {
        dispatch(drawCardsFromPile({
          player: currPhase.player,
          count: arcaneCount,
          type: ActionCardType.Arcane,
        }));
        dispatch(drawCardsFromPile({
          player: currPhase.player,
          count: 5 - arcaneCount,
        }));
      }
    }
  };
  useEffect(() => {
    // StartDraw阶段已经抽了5张牌之后就记录并且跳转下一阶段
    if(currPhase?.type === PhaseType.StartDraw && currPhase?.player === player) {
      if(tempCards?.length === 5) {
        dispatch(addRecordToCurrPhase({
          // TODO: 保存抽取的卡牌的列表到记录中
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
    // 进行了换牌之后就记录并且跳转下一阶段
    if(switched && currPhase?.type === PhaseType.StartSwitch && currPhase?.player === player) {
      // 仍然以是否抽到5张牌为判断依据
      if(tempCards?.length === 5) {
        // 先重置掉所有的switchMark
        for(let i = 0; i < switchMarkList.length; i++) {
          if(switchMarkList[i]) {
            setSwitchMarkList[i](false);
          }
        }
        dispatch(addRecordToCurrPhase({
          // TODO: 保存抽取的卡牌的列表到记录中
          record: {
            player: player,
            phase: currPhase,
            record: '更换卡牌后初始手牌5张：'
          }
        }));
        // 将替换的牌放回牌堆中
        dispatch(returnCardsToPile({
          player,
          cards: returnCards,
        }))
      }
    }
  }, [tempCards]);
  const switchCards = () => {
    if(switched) return;
    const switchIndex = [];
    const cardsToReturn = [];
    for(let i = 0; i < switchMarkList.length; i++) {
      if(switchMarkList[i]) {
        switchIndex.push(i);
        cardsToReturn.push(tempCards[i]);
      }
    }
    dispatch(dropTempCards({
      player,
      indexs: switchIndex,
    }))
    dispatch(drawCardsFromPile({
      player,
      count: switchIndex.length,
    }));
    setSwitched(true);
    setReturnCards(cardsToReturn);
  };
  const finalConfirm = () => {
    setConfirm(true);
    // tempCards进手牌
    dispatch(pushHandCards({
      player,
      cards: tempCards,
    }));
    if((currPhase as StartPhase).offensive === player) {
      // 当前角色是先手方, 则开启后手方的抽卡
      const defensivePlayer = player === 'boku' ? 'kimi' : 'boku';
      const nextPhase: StartPhase = {
        id: 0,
        player: defensivePlayer,
        name: `开始阶段_后手抽牌`,
        type: PhaseType.StartDraw,
        isActive: false,
        record: [],
        offensive: (currPhase as StartPhase).offensive,
      };
      dispatch(goNextPhase({
        nextPhase, 
      }))
    } else {
      // 当前角色不是先手方, 则说明双方初始牌抽取完毕
      // 开启选择出战角色阶段, 由CharArea组件做处理
      const nextPhase: StartPhase = {
        id: 0,
        player: (currPhase as StartPhase).offensive,
        name: `开始阶段_先手方选择出战角色`,
        type: PhaseType.StartSelectChar,
        isActive: false,
        record: [],
        offensive: (currPhase as StartPhase).offensive,
      };
      dispatch(goNextPhase({
        nextPhase, 
      }))
    }
  };

  if(currPhase?.type === PhaseType.StartDraw || currPhase?.type === PhaseType.StartSwitch) {
    return <div className="">
      {currPhase.player === player && <div>
        { currPhase?.type === PhaseType.StartDraw && <button onClick={startDraw}>抽{`${player === 'boku' ? '本方': '对方'}`}起始牌</button>}
        <div className="flex gap-2">
          {tempCards.map((oneCard, index) => {
            const {id} = oneCard;
            return <div className="flex-1 relative" onClick={() => setSwitchMark(index)} key={`temp_card_${index}`}>
              <img src={`/static/icons/${id}.png`} 
                className="w-full"
              />
              {switchMarkList[index] && <div className="absolute w-full h-1/2 bg-slate-400 top-1/4">
                TODO：标记换牌的图片
              </div>}
            </div>
          })}
        </div>
        {currPhase?.type === PhaseType.StartSwitch && !switched && <button className="" onClick={switchCards}>确认替换</button>}
        {switched && !confirm && <button className="" onClick={finalConfirm}>{`${player === 'boku' ? '本方': '对方'}`}起始手牌确认</button>}
      </div>}
    </div>;
  } else {
    return <></>
  }
}
export default StaringHands;