// 支援牌
import cardsPicBig from '../static/cards/support_big.jpg';
import cardsPicSmall from '../static/cards/support_small.jpg';

const getPosition = function(id) {
  let row = 0;
  let column = 0;
  if(id >= 5446 && id <= 5463) {
    const index = id - 5446;
    row = Math.floor(index / 7);
    column = index - row * 7;
  }
  // XXX: 后续的更多卡牌可能不符合这个规律，需要额外处理
  if(id == 5483) {
    row = 2;
    column = 4;
  }
  if(id == 5484) {
    row = 2;
    column = 5;
  }
  return {
    row,
    column,
  }
};

function SupportCard({ id, style, size }) {
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
export default SupportCard;
