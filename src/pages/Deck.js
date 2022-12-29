// 牌组页，用于展示牌组的信息
import { Layout } from 'antd';
// import backgroundPic from '../static/deck_background.png'
import backgroundPic from '../static/deck_background2.png'

const charCards = [];
const deckCards = [];
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
    }}>
      卡组名称
    </div>
  </>
}

export default Deck;



