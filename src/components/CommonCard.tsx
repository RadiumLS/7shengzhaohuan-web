// 通用行动牌
import cardsPicBig from '../static/cards/common_big.jpg';
import cardsPicSmall from '../static/cards/common_small.jpg';
import { CardOption } from '../type/card';
const picRow = 3;
const picColumn = 5;

const getPosition = function(id: number) {
  let row = 0;
  let column = 0;
  let index = 0;
  if(id >= 5399 && id <= 5402) {
    index = id - 5399;
  }
  if(id >= 5480 && id <= 5482) {
    index = id - 5480 + 4;
  }
  if(id >= 5485 && id <= 5490) {
    index = id - 5485 + 7;
  }
  if(id == 5492) {
    index = 13
  }
  if(id == 5530) {
    index = 14
  }
  row = Math.floor(index / 5);
  column = index - row * 5;
  // XXX: 后续的更多卡牌可能不符合这个规律，需要额外处理
  return {
    row,
    column,
  }
};

function CommonCard({ id, style, size }: CardOption) {
  const pic = size === 'small' ? cardsPicSmall : cardsPicBig;
  const { row, column } = getPosition(parseInt(id, 10));
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
export default CommonCard;
