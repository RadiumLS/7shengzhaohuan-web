// 行动牌，用于展示卡牌
import WeaponCard from './WeaponCard'
import EquipmentCard from './EquipmentCard'
import SupportCard from './SupportCard';
import CommonCard from './CommonCard';
import FoodCard from './FoodCard';
import ElementCard from './ElementCard';
import TalentCard from './TalentCard';

const weaponCardIds = [];
// 初始版本的武器卡牌id
for(let i = 5406; i<= 5420; i++) {
  weaponCardIds.push(`${i}`);
}
const equipmentCardIds = [];
// 初始版本的圣遗物卡牌id
for(let i = 5421; i<= 5440; i++) {
  equipmentCardIds.push(`${i}`);
}
// 初始版本的支援牌id
const supportCardIds = ['5483', '5484'];
for(let i = 5446; i<= 5463; i++) {
  supportCardIds.push(`${i}`);
}
// 初始版本的通用行动牌id
const commonCardIds = ['5492', '5530', '5480', '5481', '5482'];
for(let i = 5399; i<= 5402; i++) {
  commonCardIds.push(`${i}`);
}
for(let i = 5485; i<= 5490; i++) {
  commonCardIds.push(`${i}`);
}
// 初始版本的食物牌id
const foodCardIds = ['5491', '5529'];
for(let i = 5474; i<= 5479; i++) {
  foodCardIds.push(`${i}`);
}
// 初始版本的元素牌id
const elementCardIds = ['5377'];
for(let i = 5386; i<= 5398; i++) {
  elementCardIds.push(`${i}`);
}
// 初始版本的天赋牌id
const talentCardIds = [];
for(let i = 5441; i<= 5445; i++) {
  talentCardIds.push(`${i}`);
}
for(let i = 5496; i<= 5511; i++) {
  talentCardIds.push(`${i}`);
}
for(let i = 5379; i<= 5385; i++) {
  talentCardIds.push(`${i}`);
}

// XXX?: add sort function here

function ActionCard({ id, style, size }) {
  if(weaponCardIds.indexOf(id) > 0) return <WeaponCard id={id} style={style} size={size}></WeaponCard>
  if(equipmentCardIds.indexOf(id) > 0) return <EquipmentCard id={id} style={style} size={size}></EquipmentCard>
  if(supportCardIds.indexOf(id) > 0) return <SupportCard id={id} style={style} size={size}></SupportCard>
  if(commonCardIds.indexOf(id) > 0) return <CommonCard id={id} style={style} size={size}></CommonCard>
  if(foodCardIds.indexOf(id) > 0) return <FoodCard id={id} style={style} size={size}></FoodCard>
  if(elementCardIds.indexOf(id) > 0) return <ElementCard id={id} style={style} size={size}></ElementCard>
  if(talentCardIds.indexOf(id) > 0) return <TalentCard id={id} style={style} size={size}></TalentCard>
  return <TalentCard id={id} style={style} size={size}></TalentCard>
}
export default ActionCard;




