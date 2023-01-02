// 行动牌，用于展示卡牌
import WeaponCard from './WeaponCard'
import EquipmentCard from './EquipmentCard'
import SupportCard from './SupportCard';

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
const supportCardIds = [5483, 5484];
for(let i = 5446; i<= 5463; i++) {
  supportCardIds.push(`${i}`);
}

// XXX?: add sort function here

function ActionCard({ id, style, size }) {
  if(weaponCardIds.indexOf(id) > 0) return <WeaponCard id={id} style={style} size={size}></WeaponCard>
  if(equipmentCardIds.indexOf(id) > 0) return <EquipmentCard id={id} style={style} size={size}></EquipmentCard>
  if(supportCardIds.indexOf(id) > 0) return <SupportCard id={id} style={style} size={size}></SupportCard>
  return <SupportCard id={id} style={style} size={size}></SupportCard>
}
export default ActionCard;




