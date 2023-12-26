// 对局过程中的角色牌展示区域

import React from "react";
import { useAppSelector } from "../../redux/hooks";
import { PlayerName } from "../../redux/play";


const CharArea : React.FC<{player: PlayerName}> = (prop) => {
  const { player } = prop;
  // TODO: 展示角色牌
  // TODO: 展示血量、充能
  // TODO: 展示出战状态
  // TODO: 展示角色状态
  // TODO: 展示装备、天赋状态
  // TODO: 切换角色的逻辑估计要写这里面了
  const chars = useAppSelector((state) => player === 'boku' ? state.play.bokuState.chars : state.play.kimiState.chars);
  return <div
    className="flex w-full h-full gap-4"
  >
    {
      chars.map((oneChar, index) => {
        const {id} = oneChar;
        return <img src={`/static/icons/${id}.png`}
          // width={420}
          // height={720}
          className="flex-1 max-h-full"
          key={`boku_char_${index}`}
        >
        </img>;
      })
    }
  </div>
}

export default CharArea;