// 天赋牌
import cardsPicBig from '../static/cards/talent_big.jpg';
import cardsPicSmall from '../static/cards/talent_small.jpg';
import { CardOption } from '../type/card';
const picRow = 5;
const picColumn = 7;

const getPosition = function(id: number) {
  let row = 0;
  let column = 0;
  let index = 0;
  if(id >= 5441 && id <= 5445) {
    index = id - 5441;
  }
  if(id >= 5496 && id <= 5511) {
    index = id - 5496 + 5;
  }
  if(id >= 5379 && id <= 5385) {
    index = id - 5379 + 22;
  }
  // XXX: 后续的更多卡牌可能不符合这个规律，需要额外处理
  row = Math.floor(index / 7);
  column = index - row * 7;
  return {
    row,
    column,
  }
};

function TalentCard({ id, style, size }: CardOption) {
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
export default TalentCard;
