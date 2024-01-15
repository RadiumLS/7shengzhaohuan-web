// 应用在play页面下的玩家手牌组件
// 预计会是非常复杂的组件，因为需要处理很多的逻辑

import { useAppDispatch, useAppSelector } from "../../redux/hooks";
import { PlayerName } from "../../redux/play"

type HandsPorp = {
  player: PlayerName,
}
const Hands : React.FC<HandsPorp> = (prop) => {
  // TODO: 手牌展示
  // TODO: 手牌打出
  // TODO: 手牌牌序
  // TODO: 手牌动画……
  const { player } = prop;
  const dispatch = useAppDispatch();

  const currPhase = useAppSelector((state) => state.play.currPhase);
  const handCards = useAppSelector((state) => player === 'boku' ? state.play.bokuState.hand : state.play.kimiState.hand);
  return <div className="flex">
    {handCards.map((oneCard, index) => {
      const {id} = oneCard;
      return <div className="flex-1 relative" key={`temp_card_${index}`}>
        <img src={`/static/cards/${id}.png`} 
          className="w-full max-w-16"
        />
      </div>
    })}
  </div>
}

export default Hands;