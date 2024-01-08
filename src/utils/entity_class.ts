// 提供一个用id获取Entity的具体Class的方法
import { CharEntity, LogicEntity } from '../type/play';
import { KamisatoAyaka } from '../entity/kamisato_ayaka';
import { PlayerName } from '../redux/play';



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