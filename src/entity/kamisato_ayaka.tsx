// 神里凌华角色牌 以及相关的卡牌的Entity实现
import { CardCost } from '@src/type/card';
import play, { PlayState, PlayerName, appendHistoryMessages, changeCost, changeDamage, createCharState, dealDamage, getEntityId } from '../redux/play';
import { Weapon, Element, TriggerType, SkillType, DamageType } from '../type/enums';
import { CharEntity, CharStateEntity, DamageChange, DeltaCost, EquipmentEngity, Skill, Trigger } from '../type/play';

// 预留的i18n函数
const t = (s: string) => s;

export class KamisatoAyaka implements CharEntity {
  constructor(player: PlayerName, index: number) {
    // 实体id
    this.id = getEntityId();
    this.index = index;
    this.name = t('角色-神里绫华');
    this.icon = '/static/cards/5.png';
    this.smallIcon = '/static/cards/5.png';
    this.element = [Element.Cryo];
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
    };
    this.skills = [new KamisatoArtKabuki(player), new KamisatoArtHyouka(player), new KamisatoArtSoumetsu(player)];
  }
  triggerMap: Partial<Record<TriggerType, Trigger[]>>;
  weaponType: Weapon;
  weapon?: EquipmentEngity | undefined;
  equipment?: EquipmentEngity | undefined;
  talent?: EquipmentEngity | undefined;
  id: number;
  index: number;
  name: string;
  icon: string;
  smallIcon: string;
  health: number;
  energy: number;
  energyMax: number;
  charState: CharStateEntity[];
  appledElement: Element[];
  player: PlayerName;
  element?: Element[];
  skills: Skill[];
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
        const senho = new Senho(this.player, this.id);
        const newAction = createCharState({
          charIndex: indexAfterSwitch,
          charStateEntity: senho,
        });
        actions.push(newAction);
        actions.push(appendHistoryMessages({
          messages: [{
            message: `${this.name}附属了${senho.name}`,
          }]
        }));
      }
    }
    return actions;
  }
}
// WIP: 角色状态-霰步写在这里
export class Senho implements CharStateEntity {
  constructor(owner: PlayerName, charId: number) {
    this.id = getEntityId();
    this.name = '霰步';
    this.player = owner;
    this.triggerMap = {};
    this.charId = charId;
  }
  triggerMap: Partial<Record<TriggerType, Trigger[]>>;
  player: PlayerName;
  charId: number;
  name?: string;
  id: number;
  damageChangeTrigger: Trigger = (state, actions) => {
    const playerState = this.player === 'boku' ? state.bokuState : state.kimiState;
    const selfChar = playerState.chars.find((char) => char.id === this.charId);
    // 物理伤害转成冰伤害
    const elementChange: DamageChange = {
      damageTypes: [],
      element: ['physical'],
      delta: 0,
      damageElementChange: Element.Cryo,
      // 仅对自身附属的角色生效
      sourceIds: [this.charId],
      targetIds: [],
      entityId: this.id,
    };
    actions.push(changeDamage(elementChange));

    if(selfChar && selfChar.talent?.name === 'xxxx') {
      const cryoDamageChange: DamageChange = {
        damageTypes: [],
        element: [Element.Cryo],
        delta: 1,
        // 仅对自身附属的角色生效
        sourceIds: [this.charId],
        targetIds: [],
        entityId: this.id,
      }
      actions.push(changeDamage(cryoDamageChange));
    }
    return actions;
  }
  // TODO: 回合结束的Trigger, 移除角色状态
}
// TODO: 大招召唤物
// TODO: 天赋牌

/**
 * 普通攻击: 神里流·倾
 */
export class KamisatoArtKabuki implements Skill {
  constructor(player: PlayerName) {
    this.player = player;
    this.id = getEntityId();
    this.name = t('神里流·倾');
    this.desc = t('普通攻击, 造成两点物理伤害');
    // TODO: 使用普通攻击的图片
    this.icon = '';
    this.type = SkillType.NormalAttack;
    this.cost = [{
      type: Element.Cryo,
      cost: 1,
    }, {
      type: 'unaligned',
      cost: 2,
    }];
    this.effect = (state) => {
      const opponentState = this.player === 'boku' ? state.kimiState : state.bokuState;
      // 注意, 这里没有判断activeCharIndex为undefined的情况, 虽然理论上不会出现
      const targetChar = opponentState.chars[opponentState.activeCharIndex || 0];
      return [dealDamage({
        source: this.id,
        target: targetChar.id,
        damageType: DamageType.NormalAttack,
        element: 'physical',
        point: 2,
      })]
    }
  }
  player: PlayerName;
  id: number;
  icon?: string | undefined;
  name: string;
  type: SkillType;
  desc?: string | undefined;
  cost: CardCost;
  effect?: ((state: Readonly<PlayState>) => { payload: unknown; type: string; }[]) | undefined;
  // TODO: 增加对应的effect
}

/**
 * 元素战技: 神里流·冰华
 */
export class KamisatoArtHyouka implements Skill {
  constructor(player: PlayerName) {
    this.player = player;
    this.id = getEntityId();
    this.name = t('神里流·冰华');
    this.desc = t('元素战技, 造成三点冰元素伤害');
    // TODO: 使用神里流·冰华的图片
    this.icon = '';
    this.type = SkillType.ElementalSkill;
    this.cost = [{
      type: Element.Cryo,
      cost: 3,
    }];
  }
  player: PlayerName;
  id: number;
  icon?: string | undefined;
  name: string;
  type: SkillType;
  desc?: string | undefined;
  cost: CardCost;
  effect?: ((state: Readonly<PlayState>) => { payload: unknown; type: string; }[]) | undefined;
  // TODO: 增加对应的effect
}

/**
 * 元素爆发: 神里流·霜灭
 */
export class KamisatoArtSoumetsu implements Skill {
  constructor(player: PlayerName) {
    this.player = player;
    this.id = getEntityId();
    this.name = t('神里流·霜灭');
    this.desc = t('元素爆发, 造成四点冰元素伤害, 召唤霜见雪关扉');
    // TODO: 使用神里流·霜灭的图片
    this.icon = '';
    this.type = SkillType.ElementalBrust;
    this.cost = [{
      type: Element.Cryo,
      cost: 3,
    },{
      type: 'energy',
      cost: 3,
    }];
  }
  player: PlayerName;
  id: number;
  icon?: string | undefined;
  name: string;
  type: SkillType;
  desc?: string | undefined;
  cost: CardCost;
  effect?: ((state: Readonly<PlayState>) => { payload: unknown; type: string; }[]) | undefined;
  // TODO: 增加对应的effect
}