// 卡组中使用的卡牌组件

import { CardOption } from "../type/card";
// import xx from "@static/cards/5369.png";
// import xx from "../static/cards/5369.png";

// 相对其他地方来说，只需要展示图片和位置
function DeckCard({ id, style, size, className }: CardOption) {
  // 卡牌id决定图片路径
  // 约定好图片都放在/static路径下
  // TODO: size考虑直接使用阿里云oss的相关querystring参数，直接获取特定的大小以及质量
  return <div style={style} className={className}>
    <img src={`/static/icons/${id}.png`} style={{
      width: '100%',
      height: '100%',
    }}>
    </img>
  </div>;
}
export {
  DeckCard
}
