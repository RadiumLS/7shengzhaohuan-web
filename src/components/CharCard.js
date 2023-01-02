// 角色卡牌，用于展示角色卡牌
import { Layout } from 'antd';
import { charCards } from '../data/Character';
import cardsPicBig from '../static/cards/character_big.jpg';
import cardsPicSmall from '../static/cards/character_small.jpg';

const getPosition = function(id) {
  let row = 0;
  let column = 0;
  if(id >= 5356 && id <= 5376) {
    const index = id - 5356;
    row = Math.floor(index / 7);
    column = index - row * 7;
  }
  // XXX: 后续的更多角色卡组可能不符合这个规律，需要额外处理
  return {
    row,
    column,
  }
};

function CharCard({ id, style, size }) {
  console.log(`size is ${size}`);
  const pic = size === 'small' ? cardsPicSmall : cardsPicBig;
  const { row, column } = getPosition(id);
  return <div style={style}>
    <div style={{
      width: '100%',
      height: '100%',
      backgroundImage: `url(${pic})`,
      backgroundSize: '700%',
      backgroundPosition: `-${100 * column}% -${100 * row}%`
    }}>
    </div>
  </div>;
}
export default CharCard;




