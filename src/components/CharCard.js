// 角色卡牌，用于展示角色卡牌
import { GenshinCard, isGenshinCard } from './GenshinCard'
import { MonsterCard, isMonsterCard }from './MonsterCard'

function CharCard({ id, style, size }) {
  if(isGenshinCard(id)) return <GenshinCard id={id} style={style} size={size}></GenshinCard>
  if(isMonsterCard(id)) return <MonsterCard id={id} style={style} size={size}></MonsterCard>
  return <MonsterCard id={id} style={style} size={size}></MonsterCard>
}
export default CharCard;
