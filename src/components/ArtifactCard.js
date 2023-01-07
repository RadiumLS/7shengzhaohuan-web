// 装备-圣遗物牌
import cardsPicBig from '../static/cards/artifact_big.jpg';
import cardsPicSmall from '../static/cards/artifact_small.jpg';

const getPosition = function(id) {
  let row = 0;
  let column = 0;
  if(id >= 5421 && id <= 5440) {
    const index = id - 5421;
    row = Math.floor(index / 7);
    column = index - row * 7;
  }
  // XXX: 后续的更多卡牌可能不符合这个规律，需要额外处理
  return {
    row,
    column,
  }
};

function ArtifactCard({ id, style, size }) {
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
export default ArtifactCard;
