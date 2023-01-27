// 米游社牌组页，用于展示米游社的牌组列表以及牌组信息
import { useParams, useNavigate, redirect } from "react-router-dom";
import { useState, useEffect } from 'react';
import { getMiyousheDeck, getMiyousheDeckList } from '../data/MiyousheDeck';
import { getCardByNickName } from '../components/CharCard';
import Deck from './Deck';
import '../styles/deck.css'
function MiyousheDeck() {
  const { deckId } = useParams();
  const [ deckList, setDeckList] = useState([]);
  const [charCards, setCharCards] = useState([]);
  const [deckCards, setDeckCards] = useState([]);
  const navigate = useNavigate();
  useEffect(() => {
    getMiyousheDeckList().then((deckList) => {
      setDeckList(deckList);
    });
  }, []);
  useEffect(() => {
    if(deckId) {
      getMiyousheDeck(deckId).then(({charCardNames, cardIds}) => {
        if (cardIds !== undefined) {
          setDeckCards(cardIds.map((oneId) => {
            return { id: oneId }
          }));
        }
        setCharCards(charCardNames.map((oneName) => {
          const card = getCardByNickName(oneName);
          return card === undefined ? { id: 0 } : card;
        }))
      });
    }
  }, [deckId]);
  if(deckId) {
    return <>
      <a onClick={() => {
        navigate(`/miyoushe`);
      }}>返回卡组列表</a>&nbsp;&nbsp;&nbsp;&nbsp;
      <a target="_blank" href={`https://bbs.mihoyo.com/ys/strategy/content/${deckId}/detail`}>去米游社的页面查看</a>
      <Deck charCards={charCards} deckCards={deckCards}/>
    </>
  }
  return <>
  米游社卡组列表，点击查看卡组图片
  <p>
    <DeckList deckList={deckList}/>
  </p>
  </>
}
function DeckList({ deckList }) {
  const navigate = useNavigate();
  return deckList.map((oneDeck, index) => {
    return <div className="miyoushe-deck" onClick={() => {
      navigate(`/miyoushe/${oneDeck.deckId}`);
    }}>
      <h4>{oneDeck.title}</h4>
      <p>{oneDeck.summary}</p>
    </div>;
  })
}

export default MiyousheDeck;
