// 牌组分享页，用于卡组分享码的解析与生成
import '../styles/deck.css';
import { useState } from 'react';
import { decode, encode } from '../utils/share_code';
import { DeckActionCard, DeckCharCard } from '../components/DeckCard';
import { addOneDeck, removeOneDeck, setDeckList } from "../redux/deck";
import { useAppDispatch, useAppSelector } from '../redux/hooks';
import { useEffect } from 'react';

interface ShareDeckProps {
  defaultDeckCode?: string;
}
function ShareDeck({defaultDeckCode}: ShareDeckProps) {
  const [deckTitle, setDeckTitle] = useState<string>('');
  const [deckCode, setDeckCode] = useState(defaultDeckCode || '');
  const [cardIdList, setCardIdList] = useState<number[]>([]);
  const [encodeCode, setEncodeCode] = useState('');
  const [salt, setSalt] = useState(0);
  const [showHealth, setShowHealth] = useState(true);
  const [showCost, setShowCost] = useState(false);

  const dispatch = useAppDispatch();
  const removeDeckAt = (index: number) => {
    dispatch(removeOneDeck(index));
  }
  const addDeck = (title: string, deckCode: string) => {
    dispatch(addOneDeck({
      deckTitle: title,
      deckCode: deckCode,
    }))
  }

  const deckList = useAppSelector((state) => state.deck.deckList);

  useEffect(() => {
    setDeckTitle(`卡组_${deckList ? deckList.length + 1 : 1}`);
  }, [deckList]);
  return <div style={{display: 'flex'}}>
    <div style={{flex: '0 1', minWidth: '220px', marginRight: '20px'}}>
      <h2>卡组列表</h2>
      <div>
        {(deckList && deckList.length !== 0) ? deckList?.map((oneDeck, index) => {
          return <div>
            <h4>{oneDeck.deckTitle || '未命名卡组'}</h4>
            <p style={{wordBreak: 'break-word'}}>卡组分享码：{oneDeck.deckCode}</p>
            <button onClick={() => setCardIdList(decode(oneDeck.deckCode || ''))}>展示卡组</button>
            <button onClick={() => removeDeckAt(index)}>删除卡组</button>
          </div>
        }) : '空空如也'}
      </div>
      <div style={{width: '100%', marginTop: '20px'}}>
        <div>
          <label>新建卡组名称：</label>
          <input type='text' value={deckTitle} onChange={(e) => {setDeckTitle(e.target.value)} }/>
        </div>
        <div>
          <label>卡组代码：</label>
          <textarea value={deckCode || ''} onChange={(e) => {
            setDeckCode(e.target.value);
          }}></textarea>
        </div>
        <button onClick={() => setCardIdList(decode(deckCode || ''))}>展示卡组</button>
        <button onClick={() => addDeck(deckTitle, deckCode)}>添加卡组</button>
      </div>
      <div style={{width: '100%', marginTop:'40px'}}>
        卡组id生成分享码<br/>
        <label>Salt: {salt}</label>
        <input type='text' value={salt} onChange={(e) => {setSalt(parseInt(e.target.value))} }/>
        <button onClick={() => setEncodeCode(encode(cardIdList, salt))}>Encode</button>
        <p style={{wordBreak: 'break-word'}}>
          {JSON.stringify(encodeCode)}
        </p>
      </div>
    </div>
    <div className="deck-panel">
      <div className='deck-char-card' style={{
        left: '21.7vh',
        top: '11vh',
      }}>
        <DeckCharCard id={cardIdList[0]} showHealth={showHealth}/>
      </div>
      <div className='deck-char-card' style={{
        left: '31.7vh',
        top: '11vh',
      }}>
        <DeckCharCard id={cardIdList[1]} showHealth={showHealth}/>
      </div>
      <div className='deck-char-card' style={{
        left: '41.7vh',
        top: '11vh',
      }}>
        <DeckCharCard id={cardIdList[2]} showHealth={showHealth}/>
      </div>
      {cardIdList.slice(3).map((oneCard, index) => {
        const row = Math.floor(index/6);
        const column = index - (row * 6);
        return <div className='deck-action-card' style={{
          left: `${15 + 7 * column}.5vh`,
          top: `${32 + 10.93 * row}vh`,
        }}>
          <DeckActionCard id={oneCard} showCost={showCost}/>
        </div>;
      })}
    </div>
  </div>
}

export default ShareDeck;
