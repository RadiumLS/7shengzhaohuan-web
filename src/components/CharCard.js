// 角色卡牌，用于展示角色卡牌
import GenshinCard from './GenshinCard'
import MonsterCard from './MonsterCard'

const genshinCardIds = [];
// 初始版本的角色卡牌id
for(let i = 5356; i<= 5376; i++) {
  genshinCardIds.push(`${i}`);
}

const monsterCardIds = [];
// 初始版本的原魔卡牌id
for(let i = 5523; i<= 5528; i++) {
  monsterCardIds.push(`${i}`);
}

function CharCard({ id, style, size }) {
  if(genshinCardIds.indexOf(id) > 0) return <GenshinCard id={id} style={style} size={size}></GenshinCard>
  if(monsterCardIds.indexOf(id) > 0) return <MonsterCard id={id} style={style} size={size}></MonsterCard>
  return <MonsterCard id={id} style={style} size={size}></MonsterCard>
}
export default CharCard;
