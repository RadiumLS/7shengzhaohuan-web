// 牌组页，用于展示牌组的信息
// import backgroundPic from '../static/deck_background.png'
// import backgroundPic from '../static/deck_background2.png';
import { DeckCard } from '../components/DeckCard';
import '../styles/deck.css';
import { CardSimpleInfo } from '../type/card';

// const deckCards = cardIds;
function AllActionCard({deckCards} : {deckCards: CardSimpleInfo[]}) {
  if(deckCards === undefined) return <></>;
  return <>
    {deckCards.map((oneCard, index) => {
      const row = Math.floor(index/6);
      const column = index - (row * 6);
      return <DeckCard id={`${oneCard.id}`} className='deck-action-card' style={{
        left: `${15 + 7 * column}.5vh`,
        top: `${32 + 10.93 * row}vh`,
      }}/>;
    })}
  </>;
}
    // <img src={require(`${cardsStaticPath}${char.icon}`).default} alt={char.name}></img>
function Deck({charCards, deckCards}: {charCards: CardSimpleInfo[], deckCards: CardSimpleInfo[]}) {
  const getCharCardId = function(index: number) {
    return charCards && charCards[index] && charCards[index].id.toString();
  }
  return <>
    <div className="deck-panel">
      <DeckCard id={getCharCardId(0)} size='small' className='deck-char-card' style={{
        left: '21.7vh',
        top: '11vh',
      }}/>
      <DeckCard id={getCharCardId(1)} size='small' className='deck-char-card' style={{
        left: '31.7vh',
        top: '11vh',
      }}/>
      <DeckCard id={getCharCardId(2)} size='small' className='deck-char-card' style={{
        left: '41.7vh',
        top: '11vh',
      }}/>
      <AllActionCard deckCards={deckCards}/>
    </div>
  </>
}

export default Deck;
