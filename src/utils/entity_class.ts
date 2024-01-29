// 提供一个用id获取Entity的具体Class的方法
import { CharEntity, LogicEntity } from '../type/play';
import { KamisatoAyaka } from '../entity/char/cryo/kamisato_ayaka';
import { PlayState, PlayerName, getAllEntity } from '../redux/play';



const entityClassMap: Map<number, (player: PlayerName, index: number) => CharEntity> = new Map([
  [5, (player: PlayerName, index: number) => new KamisatoAyaka(player, index)],
]);
type CharacterClass = (player: PlayerName, index: number) => CharEntity ;


export function getCharacterEntityClassById(id: number): CharacterClass  {
  const charEntityClass = entityClassMap.get(id);
  if(charEntityClass) {
    return charEntityClass;
  }
  return entityClassMap.get(5) as CharacterClass;
}

/** 工具函数, 返回指定实体的一句话指代词 */
export function spellEntityById(state: Readonly<PlayState>, entiryId?: number): string {
  const defeaultSpell = '未知实体';
  if(entiryId === undefined) return defeaultSpell;
  const allEntity = getAllEntity(state);
  const entity = allEntity.find((oneEntity) => oneEntity.id === entiryId);
  // TODO: 继续细化描述
  return (entity && entity.name) ? entity.name : defeaultSpell;
}
