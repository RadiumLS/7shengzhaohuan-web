// 牌组页，用于展示牌组的信息
// import backgroundPic from '../static/deck_background.png'
import backgroundPic from '../static/deck_background2.png';
import { CharCard } from '../components/CharCard';
import ActionCard from '../components/ActionCard';

const demoDeckCards = [
];
// TODO: 使用有意义的卡组信息
const _deckCards = demoDeckCards;
// const deckCards = cardIds;
function AllActionCard({deckCards}) {
  if(deckCards === undefined) return <></>;
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
function Deck({charCards, deckCards}) {
  return <>
    <div style={{
      backgroundImage: `url(${backgroundPic})`,
      width: '73vh',
      height: '100vh',
      margin: '0 auto',
      backgroundSize: 'cover',
      position: 'relative',
    }}>
      <CharCard id={charCards && charCards[0] && charCards[0].id} size='small' style={{
        width: '8.3vh',
        height: '14.4vh',
        position: 'absolute',
        left: '21.7vh',
        top: '11vh',
      }}/>
      <CharCard id={charCards && charCards[1] && charCards[1].id} size='small' style={{
        width: '8.3vh',
        height: '14.4vh',
        position: 'absolute',
        left: '31.7vh',
        top: '11vh',
      }}/>
      <CharCard id={charCards && charCards[2] && charCards[2].id} size='small' style={{
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
