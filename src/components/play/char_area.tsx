// 对局过程中的角色牌展示区域

import React from "react";
import { useAppSelector } from "../../redux/hooks";
import { PlayerName } from "../../redux/play";


const CharArea : React.FC<{player: PlayerName}> = (prop) => {
  // TODO: 展示角色牌
  // TODO: 展示血量、充能
  // TODO: 展示出战状态
  // TODO: 展示角色状态
  // TODO: 展示装备、天赋状态
  // TODO: 切换角色的逻辑估计要写这里面了
  if(prop.player === 'boku') {
    return <BokuCharArea/>;
  } else {
    return <KimiCharArea/>;
  }
}
const BokuCharArea : React.FC = () => {
  const bokuChars = useAppSelector((state) => state.play.bokuState.chars);
  return <div
    className="flex w-full h-full"
  >
    {
      bokuChars.map((oneChar) => {
        const {id} = oneChar;
        return <img src={`/static/icons/${id}.png`}
          className="flex-1"
        >
        </img>;
      })
    }
  </div>
}
const KimiCharArea : React.FC = () => {
  const kimiChars = useAppSelector((state) => state.play.kimiState.chars);
  return <div style={{
    display: 'flex',
    width: '100%',
    height: '100%'
  }}>
    {
      kimiChars.map((oneChar) => {
        const {id} = oneChar;
        return <img src={`/static/icons/${id}.png`} style={{
          flex: '1 1',
        }}>
        </img>;
      })
    }
  </div>
}
export default CharArea;