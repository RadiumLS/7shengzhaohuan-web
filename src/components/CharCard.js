// 角色卡牌，用于展示角色卡牌
import GenshinCard from './GenshinCard'
import YuanmoCard from './YuanmoCard'

const genshinCardIds = [];
// 初始版本的角色卡牌id
for(let i = 5356; i<= 5376; i++) {
  genshinCardIds.push(`${i}`);
}

const yuanmoCardIds = [];
// 初始版本的原魔卡牌id
for(let i = 5523; i<= 5528; i++) {
  yuanmoCardIds.push(`${i}`);
}

function CharCard({ id, style, size }) {
  if(genshinCardIds.indexOf(id) > 0) return <GenshinCard id={id} style={style} size={size}></GenshinCard>
  if(yuanmoCardIds.indexOf(id) > 0) return <YuanmoCard id={id} style={style} size={size}></YuanmoCard>
}
export default CharCard;




