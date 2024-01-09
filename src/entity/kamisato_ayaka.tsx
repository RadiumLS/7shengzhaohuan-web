// 神里凌华角色牌 以及相关的卡牌的Entity实现
import { PlayerName, createCharState } from '../redux/play';
import { Weapon, Element, TriggerType } from '../type/enums';
import { CharEntity, CharStateEntity, EquipmentEngity, Trigger } from '../type/play';

// 预留的i18n函数
const t = (s: string) => s;

export class KamisatoAyaka implements CharEntity {
  constructor(player: PlayerName, index: number) {
    // 卡牌id, 用于展示卡牌
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
    // this.switchEndTriggers = [this.senhoTrigger];
    this.triggerMap = {
      [TriggerType.SwitchEnd]: [this.senhoTrigger],
    }
  }
  triggerMap: Partial<Record<TriggerType, Trigger[]>>;
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
  // 切换至神里绫华后, 附属角色状态霰步Senho
  senhoTrigger: Trigger = (state, actions) => {
    const playerState = this.player === 'boku' ? state.bokuState : state.kimiState;
    const {activeCharIndex, chars } = playerState;
    let indexAfterSwitch = activeCharIndex;
    // 检查actions以确认切换后的角色的index
    for(let i = 0; i < actions.length; i++) {
      // HACK: 这个type和payload的具体值是从switchChar的reducer拷贝过来的
      const payload = actions[i].payload as {player: PlayerName, charIndex: number};
      if(payload.player === this.player && actions[i].type === 'play/switchChar') {
        indexAfterSwitch = payload.charIndex;
      }
    }
    // 检查切换后的角色是否是神里绫华
    if(indexAfterSwitch === this.index && chars[indexAfterSwitch].id === this.id) {
      const existSenho = this.charState.find((oneCharState) => {
        return oneCharState instanceof Senho;
      })
      // 如果没有附属霰步, 则附属霰步
      if(!existSenho) {
        const senho = new Senho(this.player);
        const newAction = createCharState({
          charIndex: indexAfterSwitch,
          charStateEntity: senho,
        });
        actions.push(newAction);
      }
    }
    return actions;
  }
}
// TODO: 角色状态-霰步写在这里
export class Senho implements CharStateEntity {
  constructor(owner: PlayerName) {
    this.name = '霰步';
    this.player = owner;
    this.triggerMap = {};
  }
  triggerMap: Partial<Record<TriggerType, Trigger[]>>;
  player: PlayerName;
  name?: string;
  // TODO: 造成伤害前的Trigger, 伤害变更成冰伤害
  // TODO: 造成伤害前的Trigger, 如果装备了天赋牌, 那么冰伤害+1
  // TODO: 回合结束的Trigger, 移除角色状态
}
// TODO: 大招召唤物
// TODO: 天赋牌

