// 神里凌华角色牌 以及相关的卡牌的Entity实现
import { PlayerName, createCharState } from '../redux/play';
import { Weapon, Element } from '../type/enums';
import { CharEntity, CharStateEntity, EquipmentEngity, Trigger } from '../type/play';

// 预留的i18n函数
const t = (s: string) => s;

export class KamisatoAyaka implements CharEntity {
  constructor(player: PlayerName, index: number) {
    // FIXME: 使用具体的卡牌id
    this.id = 5;
    this.index = index;
    this.name = t('神里绫华');
    this.player = player;
    this.health = 10;
    this.energy = 0;
    this.energyMax = 3;
    this.charState = [];
    this.appledElement = [];
    this.weaponType = Weapon.Sword;
    this.switchEndTriggers = [this.senhoTrigger];
  }
  weaponType: Weapon;
  weapon?: EquipmentEngity | undefined;
  equipment?: EquipmentEngity | undefined;
  talent?: EquipmentEngity | undefined;
  id: number;
  index: number;
  name: string;
  health: number;
  energy: number;
  energyMax: number;
  charState: CharStateEntity[];
  appledElement: Element[];
  player: PlayerName;
  switchEndTriggers: Trigger[];
  // 切换至神里绫华后, 附属角色状态霰步Senho
  senhoTrigger: Trigger = (state, actions) => {
    const playerState = this.player === 'boku' ? state.bokuState : state.kimiState;
    const {activeCharIndex, chars } = playerState;
    // 检查切换后的角色是否是神里绫华
    if(activeCharIndex && chars[activeCharIndex].id === this.id) {
      const senho = new Senho(this.player);
      const newAction = createCharState({
        charIndex: activeCharIndex,
        charStateEntity: senho,
      });
      return actions.concat(newAction);
    }
    return actions;
  }
}
// TODO: 角色状态-霰步写在这里
export class Senho implements CharStateEntity {
  constructor(owner: PlayerName) {
    this.player = owner;
  }
  
  player: PlayerName;
  // TODO: 造成伤害前的Trigger, 伤害变更成冰伤害
  // TODO: 造成伤害前的Trigger, 如果装备了天赋牌, 那么冰伤害+1
  diceTrigger?: Trigger[] | undefined;
  damageTrigger?: Trigger[] | undefined;
  hitTirgger?: Trigger[] | undefined;
  enemySkillTrigger?: Trigger[] | undefined;
  reactionTrigger?: Trigger[] | undefined;
  switchEndTrigger?: Trigger[] | undefined;
  switchStartTrigger?: Trigger[] | undefined;
}
// TODO: 大招召唤物
// TODO: 天赋牌

