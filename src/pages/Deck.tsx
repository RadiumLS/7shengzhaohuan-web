// 牌组页，用于展示牌组的信息
// import backgroundPic from '../static/deck_background.png'
// import backgroundPic from '../static/deck_background2.png';
import { CharCard } from '../components/CharCard';
import { ActionCard } from '../components/ActionCard';
import '../styles/deck.css';
import { CardSimpleInfo } from '../type/card';

// const deckCards = cardIds;
function AllActionCard({deckCards} : {deckCards: CardSimpleInfo[]}) {
  if(deckCards === undefined) return <></>;
  return <>
    {deckCards.map((oneCard, index) => {
      const row = Math.floor(index/6);
      const column = index - (row * 6);
      return <ActionCard id={`${oneCard.id}`} style={{
          height: '9.5vh',
          width: '5.6vh',
          left: `${15 + 7 * column}.5vh`,
          top: `${32 + 10.93 * row}vh`,
          position: 'absolute',
      }}/>;
    })}
  </>;
}
    // <img src={require(`${cardsStaticPath}${char.icon}`).default} alt={char.name}></img>
function Deck({charCards, deckCards}: {charCards: CardSimpleInfo[], deckCards: CardSimpleInfo[]}) {
  return <>
    <div className="deck-panel">
      <CharCard id={charCards && charCards[0] && charCards[0].id.toString()} size='small' style={{
        width: '8.3vh',
        height: '14.4vh',
        position: 'absolute',
        left: '21.7vh',
        top: '11vh',
      }}/>
      <CharCard id={charCards && charCards[1] && charCards[1].id.toString()} size='small' style={{
        width: '8.3vh',
        height: '14.4vh',
        position: 'absolute',
        left: '31.7vh',
        top: '11vh',
      }}/>
      <CharCard id={charCards && charCards[2] && charCards[2].id.toString()} size='small' style={{
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
