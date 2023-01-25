// 牌组页，用于展示牌组的信息
// import backgroundPic from '../static/deck_background.png'
import backgroundPic from '../static/deck_background2.png';
import { CharCard, getCardByNickName } from '../components/CharCard';
import ActionCard from '../components/ActionCard';
import { getMiyousheDeck } from '../data/MiyousheDeck';
import { useState, useEffect } from 'react';

const demoDeckCards = [
];
// TODO: 使用有意义的卡组信息
const _deckCards = demoDeckCards;
// const deckCards = cardIds;
function AllActionCard({deckCards}) {
  return deckCards.map((oneCard, index) => {
    const row = Math.floor(index/6);
    const column = index - (row * 6);
    return <ActionCard id={oneCard.id} style={{
        height: '9.5vh',
        width: '5.6vh',
        left: `${15 + 7 * column}.5vh`,
        top: `${32 + 10.93 * row}vh`,
        position: 'absolute',
    }}/>;
  })
}
    // <img src={require(`${cardsStaticPath}${char.icon}`).default} alt={char.name}></img>
function Deck() {
  const [charCards, setCharCards] = useState([]);
  const [deckCards, setDeckCards] = useState([]);
  useEffect(() => {
    getMiyousheDeck(2661).then(({charCardNames, cardIds}) => {
      setDeckCards(cardIds.map((oneId) => {
        return { id: oneId }
      }));
      setCharCards(charCardNames.map((oneName) => {
        const card = getCardByNickName(oneName);
        return card === undefined ? 0 : card.id;
      }))
    });
  }, []);

  return <>
    <div style={{
      backgroundImage: `url(${backgroundPic})`,
      width: '73vh',
      height: '100vh',
      margin: '0 auto',
      backgroundSize: 'cover',
      position: 'relative',
    }}>
      <CharCard id={charCards && charCards[0]} size='small' style={{
        width: '8.3vh',
        height: '14.4vh',
        position: 'absolute',
        left: '21.7vh',
        top: '11vh',
      }}/>
      <CharCard id={charCards && charCards[1]} size='small' style={{
        width: '8.3vh',
        height: '14.4vh',
        position: 'absolute',
        left: '31.7vh',
        top: '11vh',
      }}/>
      <CharCard id={charCards && charCards[2]} size='small' style={{
        width: '8.3vh',
        height: '14.4vh',
        position: 'absolute',
        left: '41.7vh',
        top: '11vh',
      }}/>
      <AllActionCard deckCards={deckCards}/>
    </div>
  </>
}

export default Deck;
