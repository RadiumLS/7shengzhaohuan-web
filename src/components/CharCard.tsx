// 角色卡牌，用于展示角色卡牌
import { GenshinCard, isGenshinCard, getCardByNickName as checkGenshinNick } from './GenshinCard'
import { MonsterCard, isMonsterCard, getCardByNickName as checkMonsterNick}from './MonsterCard'

const getCardByNickName = function(nickName) {
  let card = checkGenshinNick(nickName);
  if (card === undefined) card = checkMonsterNick(nickName);
  return card;
};

function CharCard({ id, style, size }) {
  if(isGenshinCard(id)) return <GenshinCard id={id} style={style} size={size} className={"hhhhh"}></GenshinCard>
  if(isMonsterCard(id)) return <MonsterCard id={id} style={style} size={size} class={"hhhhh"}></MonsterCard>
  return <></>
}
export { 
  getCardByNickName,
  CharCard,
};
