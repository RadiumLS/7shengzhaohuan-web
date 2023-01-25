// 米游社牌组页，用于展示米游社的牌组列表以及牌组信息
import { useParams, useNavigate, redirect } from "react-router-dom";
import { useState, useEffect } from 'react';
import { getMiyousheDeckList } from '../data/MiyousheDeck';
import '../styles/deck.css'
function MiyousheDeck() {
  const { deckId } = useParams();
  const [ deckList, setDeckList] = useState([]);
  useEffect(() => {
    getMiyousheDeckList().then((deckList) => {
      setDeckList(deckList);
    });
  }, []);
  if(deckId) {
    return <>单个卡组的页面 {deckId}</>
  }
  return <>
  展示卡组列表，然后点击之后展示对应卡组的图片
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
