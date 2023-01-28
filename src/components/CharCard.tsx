// 角色卡牌，用于展示角色卡牌
import { CardOption } from '../type/card';
import { GenshinCard, isGenshinCard, getCardByNickName as checkGenshinNick } from './GenshinCard'
import { MonsterCard, isMonsterCard, getCardByNickName as checkMonsterNick}from './MonsterCard'

const getCardByNickName = function(nickName: string) {
  let card = checkGenshinNick(nickName);
  if (card === undefined) card = checkMonsterNick(nickName);
  return card;
};

function CharCard({ id, style, size }: CardOption) {
  if(isGenshinCard(parseInt(id, 10))) return <GenshinCard id={id} style={style} size={size}></GenshinCard>
  if(isMonsterCard(parseInt(id, 10))) return <MonsterCard id={id} style={style} size={size}></MonsterCard>
  return <></>
}
export { 
  getCardByNickName,
  CharCard,
};
