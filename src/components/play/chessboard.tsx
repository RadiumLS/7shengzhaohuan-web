import { useContext } from "react"
import { GameContext } from "../../pages/Play"
import CardImg from "./card_img"

export const Chessboard: React.FC = () => {
  const contextValue = useContext(GameContext);
  const gameState = contextValue?.gameState;
  return <div>
    <h1>TODO: chessboard组件Here</h1>
      {gameState && <div>
        <h1>当前阶段{gameState.phase}</h1>
        <div>
          <h2>玩家1</h2>
          <h3>骰子{gameState.players[0]?.dice}</h3>
          <h3>手牌</h3>
          <div className='flex w-[50%]'>
            {gameState.players[0].hands.map((card) => 
              <div className='w-20 flex-1'>
                <CardImg definitionId={card.definition.id} />
              </div>
            )}
          </div>
          <h3>角色</h3>
          <div className='flex w-[50%]'>
            {gameState.players[0].characters.map((char) =>
              <div className='w-20 flex-1'>
                <CardImg definitionId={char.definition.id} />
              </div>
            )}
          </div>
          <h3>json{}</h3>
        </div>
        <div>
          <h2>玩家2</h2>
          <h3>骰子{gameState.players[1]?.dice}</h3>
          <h3>手牌</h3>
          <div className='flex w-[50%]'>
            {gameState.players[1].hands.map((card) => 
              <div className='w-20 flex-1'>
                <CardImg definitionId={card.definition.id} />
              </div>
            )}
          </div>
          <h3>角色</h3>
          <div className='flex w-[50%]'>
            {gameState.players[1].characters.map((char) =>
              <div className='w-20 flex-1'>
                <CardImg definitionId={char.definition.id} />
              </div>
            )}
          </div>
          <h3>json{}</h3>
        </div>
      </div>}
  </div>
}