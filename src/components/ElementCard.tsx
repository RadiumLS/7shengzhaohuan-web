// 元素共鸣牌
import cardsPicBig from '../static/cards/element_big.jpg';
import cardsPicSmall from '../static/cards/element_small.jpg';
const picRow = 2;
const picColumn = 7;

const getPosition = function(id) {
  let row = 0;
  let column = 0;
  let index = 0;
  if(id == 5377) {
    index = 0;
  }
  if(id >= 5386 && id <= 5398) {
    index = id - 5386 + 1;
  }
  // XXX: 后续的更多卡牌可能不符合这个规律，需要额外处理
  row = Math.floor(index / 7);
  column = index - row * 7;
  return {
    row,
    column,
  }
};

function ElementCard({ id, style, size }) {
  const pic = size === 'small' ? cardsPicSmall : cardsPicBig;
  const { row, column } = getPosition(id);
  return <div style={style}>
    <div style={{
      width: '100%',
      height: '100%',
      backgroundImage: `url(${pic})`,
      backgroundSize: `${picColumn * 100}%`,
      backgroundPosition: `-${100 * column}% ${row * (100/(picRow - 1))}%`
    }}>
    </div>
  </div>;
}
export default ElementCard;
