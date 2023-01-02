// 武器牌
import cardsPicBig from '../static/cards/weapon_big.jpg';
import cardsPicSmall from '../static/cards/weapon_small.jpg';

const getPosition = function(id) {
  let row = 0;
  let column = 0;
  if(id >= 5406 && id <= 5420) {
    const index = id - 5406;
    row = Math.floor(index / 5);
    column = index - row * 5;
  }
  // XXX: 后续的更多卡牌可能不符合这个规律，需要额外处理
  return {
    row,
    column,
  }
};

function WeaponCard({ id, style, size }) {
  const pic = size === 'small' ? cardsPicSmall : cardsPicBig;
  const { row, column } = getPosition(id);
  return <div style={style}>
    <div style={{
      width: '100%',
      height: '100%',
      backgroundImage: `url(${pic})`,
      backgroundSize: '500%',
      backgroundPosition: `-${100 * column}% -${100 * row}%`
    }}>
    </div>
  </div>;
}
export default WeaponCard;




