// BP时使用的英雄池组件

import { Button } from "antd";
import { useState } from "react";
import { bpPublicChar } from "../redux/banpickCharPool";
import { useAppDispatch, useAppSelector } from "../redux/hooks";
import { DeckCard } from "./DeckCard";

// 未来扩展一下i18n，先放个函数包一下
const t = (i18n: string) => i18n;

// 可能需要显示额外的信息
function BpCardPool() {
  const pool = useAppSelector((state) => state.banpick.publicPool.chars);
  const [focusCardIndex, setFocusCardIndex] = useState(-1);
  const curPhase = useAppSelector((state) => state.banpick.curPhase);
  const dispatch = useAppDispatch();
  return <div className={'bp-char-pool-wrapper'}>
    {
      pool.map((oneChar, index) =>
        <div className='bp-char-pool-one-char' key={oneChar.id} onClick={(e) => {
          setFocusCardIndex(index != focusCardIndex ? index : -1);
        }}>
          { oneChar.state === 'banned' && <div className='bp-char-pool-mask bp-char-pool-banned'>{t('已禁用')}</div>}
          { oneChar.state === 'picked' && <div className='bp-char-pool-mask bp-char-pool-picked'>{oneChar.owner?.name} {t('已选用')}</div>}
          {
            index === focusCardIndex  && <div className='bp-char-pool-mask bp-char-pool-action'>
              { !oneChar.state && curPhase &&
                <Button className='bp-bp-btn' onClick={(e) => {
                  if(curPhase) {
                    setFocusCardIndex(-1);
                    e.stopPropagation();
                    dispatch(bpPublicChar({
                      type: curPhase.type,
                      playerName: curPhase.player.name,
                      cardId: oneChar.id,
                    }))
                  }
                }}>{curPhase.type === 'pick' ? t('选用') : t('禁用')}</Button>
              }
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
