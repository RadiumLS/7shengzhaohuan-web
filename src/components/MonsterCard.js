// 原魔角色卡牌，用于展示角色卡牌
import cardsPicBig from '../static/cards/monster_big.jpg';
import cardsPicSmall from '../static/cards/monster_small.jpg';

const getPosition = function(id) {
  let row = 0;
  let column = 0;
  let index = 0
  if(id >= 5523 && id <= 5528) {
    index = id - 5523;
    row = Math.floor(index / 4);
    column = index - row * 4;
  }
  // XXX: 后续的更多卡牌可能不符合这个规律，需要额外处理
  return {
    row,
    column,
  }
};

function MonsterCard({ id, style, size }) {
  const pic = size === 'small' ? cardsPicSmall : cardsPicBig;
  const { row, column } = getPosition(id);
  return <div style={style}>
    <div style={{
      width: '100%',
      height: '100%',
      backgroundImage: `url(${pic})`,
      backgroundSize: '400%',
      backgroundPosition: `-${100 * column}% -${100 * row}%`
    }}>
    </div>
  </div>;
}
export default MonsterCard;




