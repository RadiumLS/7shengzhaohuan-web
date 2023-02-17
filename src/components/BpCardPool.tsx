// BP时使用的英雄池组件

import { useAppSelector } from "../redux/hooks";
import { CardOption } from "../type/card";
import { DeckCard } from "./DeckCard";
// import xx from "@static/cards/5369.png";
// import xx from "../static/cards/5369.png";

// 可能需要显示额外的信息
function BpCardPool() {
  const pool = useAppSelector((state) => state.banpick.publicPool.chars);
  return <div className={'bp-char-pool-wrapper'}>
    {
      pool.map((oneChar) =>
        <DeckCard id={oneChar.id.toString()} className={'bp-public-pool-card'}/>)
    }
  </div>;
}
export {
  BpCardPool
}
