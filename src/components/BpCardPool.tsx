// BP时使用的英雄池组件

import { Button } from "antd";
import { useState } from "react";
import { useAppDispatch, useAppSelector } from "../redux/hooks";
import { DeckCard } from "./DeckCard";
// import xx from "@static/cards/5369.png";
// import xx from "../static/cards/5369.png";

// 可能需要显示额外的信息
function BpCardPool() {
  const pool = useAppSelector((state) => state.banpick.publicPool.chars);
  const [focusCardIndex, setFocusCardIndex] = useState(-1);
  const dispatch = useAppDispatch();
  return <div className={'bp-char-pool-wrapper'}>
    {
      pool.map((oneChar, index) =>
        <div className='bp-char-pool-one-char' onClick={() => setFocusCardIndex(index)}>
          { oneChar.state === 'banned' && <>banned</>}
          { oneChar.state === 'picked' && <>{oneChar.owner} picked</>}
          {
            index === focusCardIndex && <div className='bp-char-pool-action'>
                <Button className='bp-bp-btn' onClick={() => alert('TODO: 处理bp的事件，根据当前bp阶段处理')}>Ban/Pick</Button>
              </div>
          }
          <DeckCard id={oneChar.id.toString()} className={'bp-public-pool-card'}/>
        </div>
      )
    }
  </div>;
}
export {
  BpCardPool
}
