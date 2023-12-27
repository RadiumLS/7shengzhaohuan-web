// 神里凌华角色牌 以及相关的卡牌的Entity实现
import { PlayerName } from '../redux/play';
import { Weapon } from '../type/enums';
import { CharEntity, CharStateEntity, EquipmentEngity, Trigger } from '../type/play';

// 预留的i18n函数
const t = (s: string) => s;

class KamisatoAyaka implements CharEntity {
  constructor(owner: PlayerName) {
    // TODO: 考虑使用卡牌的id
    this.id = 0;
    this.name = t('神里绫华');
    this.owner = owner;
    this.health = 10;
    this.energy = 0;
    this.energyMax = 3;
    this.charState = [];
    this.appledElement = [];
    this.weaponType = Weapon.Sword;
  }
  weaponType: Weapon;
  weapon?: EquipmentEngity | undefined;
  equipment?: EquipmentEngity | undefined;
  talent?: EquipmentEngity | undefined;
  id: number;
  name: string;
  health: number;
  energy: number;
  energyMax: number;
  charState: CharStateEntity[];
  appledElement: Element[];
  owner: PlayerName;
  // pon?: EquipmentEngity | undefined;
  diceTrigger?: Trigger[] | undefined;
  damageTrigger?: Trigger[] | undefined;
  hitTirgger?: Trigger[] | undefined;
  enemySkillTrigger?: Trigger[] | undefined;
  reactionTrigger?: Trigger[] | undefined;
  switchEndTrigger?: Trigger[] | undefined;
  switchStartTrigger?: Trigger[] | undefined;
}
// TODO: 角色状态-霰步写在这里
// TODO: 大招召唤物
// TODO: 天赋牌

