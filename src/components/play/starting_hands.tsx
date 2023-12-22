// 应用在play页面下的起始手牌选择器组件

import React from "react";
import { useAppSelector } from "../../redux/hooks";
import type { StartPhase } from "../../type/play";
import { PlayerName } from "../../redux/play";


const StaringHands : React.FC = (prop) => {
  // TODO: 抽5张牌
  // TODO: 选择并替换手牌
  // TODO: 展示区域内容
  const currPhase = useAppSelector((state) => state.play.currPhase);
  if((currPhase as StartPhase).offensive) {
    return <div>
      TODO
    </div>
  } else {
    return <></>
  }
}
export default StaringHands;