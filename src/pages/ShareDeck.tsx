// 牌组分享页，用于卡组分享码的解析与生成
import '../styles/deck.css';
import { useState } from 'react';
import { decode, encode } from '../utils/share_code';
import { DeckCharCard } from '../components/DeckCard';

interface ShareDeckProps {
  defaultDeckCode?: string;
}
function ShareDeck({defaultDeckCode}: ShareDeckProps) {
  const [deckCode, setDeckCode] = useState('AZFx1wsOAWFR30IOBfER4JAPCgEB4ZEPCuFx75gQDCLRA74RDTIRBMMRDcIhDcoRDdEB');
  const [cardIdList, setCardIdList] = useState<number[]>([]);
  const [encodeCode, setEncodeCode] = useState('');
  const [salt, setSalt] = useState(0);
  const [showHealth, setShowHealth] = useState(true);
  return <div style={{display: 'flex'}}>
    <div style={{flex: '0 1', minWidth: '220px', marginRight: '20px'}}>
      TODO: 搞个独立的卡牌选择器
      <div style={{width: '100%'}}>
        <label>卡组代码：</label>
        <textarea value={deckCode || ''} onChange={(e) => {
          setDeckCode(e.target.value);
        }}></textarea>
        <button onClick={() => setCardIdList(decode(deckCode || ''))}>Decode</button>
        <p style={{wordBreak: 'break-word'}}>
          {JSON.stringify(cardIdList)}
        </p>
      </div>
      <div style={{width: '100%'}}>
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
        <DeckCharCard id={5369} showHealth={showHealth}/>
      </div>
      <div className='deck-char-card' style={{
        left: '31.7vh',
        top: '11vh',
      }}>
        <DeckCharCard id={5369} showHealth={showHealth}/>
      </div>
      <div className='deck-char-card' style={{
        left: '41.7vh',
        top: '11vh',
      }}>
        <DeckCharCard id={5369} showHealth={showHealth}/>
      </div>
      TODO: 行动牌展示
    </div>
  </div>
}

export default ShareDeck;
