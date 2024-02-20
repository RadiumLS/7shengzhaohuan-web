// 卡组中使用的卡牌组件

import { ActionCard, CardOption, CharCard } from "../type/card";
// import xx from "@static/cards/5369.png";
// import xx from "../static/cards/5369.png";

// 相对其他地方来说，只需要展示图片和位置
/**
 * @deprecated 
 */
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
/**
 * 卡组中展示的角色牌组件
 */
function DeckCharCard(card: Partial<Pick<CharCard, 'id' | 'health'> & {showHealth: boolean}>) {
  const {id, health} = card;
  // TODO: 展示生命值
  if(id) {
    return <img src={`/static/cards/${id}.png`} style={{
        width: '100%',
        height: '100%',
      }}>
    </img>;
  } else {
    return <></>
  }
}
/**
 * 卡组中展示的行动牌牌组件
 */
function DeckActionCard(card: Partial<Pick<ActionCard, 'id' | 'cost'> & {showCost: boolean}>) {
  const {id, cost} = card;
  return <img src={`/static/cards/${id}.png`} style={{
      width: '100%',
      height: '100%',
    }}>
  </img>;
}
export {
  DeckCard,
  DeckCharCard,
  DeckActionCard
}
