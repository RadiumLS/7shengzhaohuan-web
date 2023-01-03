// 牌组页，用于展示牌组的信息
import { Layout } from 'antd';
// import backgroundPic from '../static/deck_background.png'
import backgroundPic from '../static/deck_background2.png';
import { charCards } from '../data/Character';
import cards from '../static/cards/5369.png';
import cards2 from '../static/cards/5480.png'
import CharCard from '../components/CharCard';
import ActionCard from '../components/ActionCard';

const demoDeckCards = [];
for(let i = 0; i < 30; i++) {
  demoDeckCards.push({
    id: 5481,
  });
}
// TODO: 使用有意义的卡组信息
const deckCards = demoDeckCards;
function _CharCard({ id, style }) {
  const char = charCards[id];
  return <div style={style}>
    <div style={{
      width: '100%',
      height: '100%',
      backgroundImage: `url(${cards})`,
      backgroundSize: 'cover',
    }}>
    </div>
  </div>;
}
function _ActionCard({ id, style }) {
  return <div style={style}>
    <div style={{
      width: '100%',
      height: '100%',
      backgroundImage: `url(${cards2})`,
      backgroundSize: 'cover',
    }}>
    </div>
  </div>;
}
function AllActionCard() {
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
function Deck({ children }) {

  // TODO: add background
  // TODO: show charCards
  // TODO: show deckCards
  return <>
    <div style={{
      backgroundImage: `url(${backgroundPic})`,
      width: '73vh',
      height: '100vh',
      margin: '0 auto',
      backgroundSize: 'cover',
      position: 'relative',
    }}>
      <CharCard id='5524' size='small' style={{
        width: '8.3vh',
        height: '14.4vh',
        position: 'absolute',
        left: '21.7vh',
        top: '11vh',
      }}/>
      <CharCard id='5358' size='small' style={{
        width: '8.3vh',
        height: '14.4vh',
        position: 'absolute',
        left: '31.7vh',
        top: '11vh',
      }}/>
      <CharCard id='5359' size='small' style={{
        width: '8.3vh',
        height: '14.4vh',
        position: 'absolute',
        left: '41.7vh',
        top: '11vh',
      }}/>
      <AllActionCard/>
    </div>
  </>
}

export default Deck;



