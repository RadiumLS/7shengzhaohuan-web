// 食物牌
import cardsPicBig from '../static/cards/food_big.jpg';
import cardsPicSmall from '../static/cards/food_small.jpg';
import { CardOption } from '../type/card';
const picRow = 2;
const picColumn = 4;

const getPosition = function(id: number) {
  let row = 0;
  let column = 0;
  let index = 0;
  if(id >= 5474 && id <= 5479) {
    index = id - 5474;
  }
  if(id == 5491) {
    index = 6
  }
  if(id == 5529) {
    index = 7
  }
  // XXX: 后续的更多卡牌可能不符合这个规律，需要额外处理
  row = Math.floor(index / 4);
  column = index - row * 4;
  return {
    row,
    column,
  }
};

function FoodCard({ id, style, size }: CardOption) {
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
export default FoodCard;
