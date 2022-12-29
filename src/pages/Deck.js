// 牌组页，用于展示牌组的信息
import { Layout } from 'antd';
// import backgroundPic from '../static/deck_background.png'
import backgroundPic from '../static/deck_background2.png';
import { charCards } from '../data/Character';
import cards from '../static/cards/5369.png';

const cardsStaticPath = '/static/cards/'
const deckCards = [];
function CharCard({ id, style }) {
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
      <CharCard id='5369' style={{
        width: '8.3vh',
        height: '14.4vh',
        position: 'absolute',
        left: '21.7vh',
        top: '11vh',
      }}/>
      <CharCard id='5369' style={{
        width: '8.3vh',
        height: '14.4vh',
        position: 'absolute',
        left: '31.7vh',
        top: '11vh',
      }}/>
      <CharCard id='5369' style={{
        width: '8.3vh',
        height: '14.4vh',
        position: 'absolute',
        left: '41.7vh',
        top: '11vh',
      }}/>
    </div>
  </>
}

export default Deck;



