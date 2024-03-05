// 游玩页, 用于对局模拟
import data from '@gi-tcg/data';
import { Game, GameState, GameStateLogEntry, NotificationMessage, PlayerConfig, PlayerData, PlayerIO, RpcRequest, RpcResponse, StateData } from '@gi-tcg/core';
import { createPlayer } from '@gi-tcg/webui';
import { createContext, useState } from 'react';
import CardImg from '../components/play/card_img';
import { RpcWaitNotify, useRpcWaitNotify, useWaitNotify } from '../hooks/useWaitNotify';
import { Chessboard } from '../components/play/chessboard';

const playerConfig0 = {
  characters: [1204, 2301, 1705],
  cards: [
    331701, 331501, 332016, 332020, 332014, 332004, 332018, 332005, 332006,
    332024, 332010, 331804, 332023, 332017, 332012, 332021, 332013, 332008,
    331802, 332004, 332001, 332019, 331803, 332003, 332007, 332022, 331801,
    332011, 330006, 330005,
  ],
};
const playerConfig1 = {
  characters: [1502, 1201, 1303],
  cards: [
    332015, 332009, 332002, 331602, 331302, 331402, 331502, 331102, 331202,
    331702, 331301, 331101, 331601, 331401, 331201, 331701, 331501, 332016,
    332020, 332014, 332004, 332018, 332005, 332006, 332024, 332010, 331804,
    332023, 332017, 332012,
  ],
};
// TODO: 从shareCode获取PlayerConfigs, 主要是卡牌信息
export const playerConfigs: readonly [PlayerConfig, PlayerConfig] = [playerConfig0, playerConfig1];

type GameContextValue = {
  gameState?: GameState;
  playerData: [PlayerData?, PlayerData?];
  rpcWaitNotify: [RpcWaitNotify, RpcWaitNotify];
};
export const GameContext = createContext<GameContextValue | null>(null);

function Play() {
  const [game, setGame] = useState<Game | null>(null);
  const [currentState, setCurrentState] = useState<GameState | undefined>(undefined);
  const [playerData1, setPlayerData1] = useState<PlayerData | undefined>(undefined);
  const [playerData2, setPlayerData2] = useState<PlayerData | undefined>(undefined);
  const rpcWaitNotify1 = useRpcWaitNotify();
  const rpcWaitNotify2 = useRpcWaitNotify();

  const startGame = async () => {
    // TODO: 此时需要使用到的图片资源已经基本确定, 能做个预加载就最好了
    const playerIO1: PlayerIO = {
      giveUp: false,
      notify: function (notification: NotificationMessage): void {
        const { newState } = notification;
        setPlayerData1(newState.players[0]);
      },
      rpc: function <M extends keyof RpcRequest>(method: M, data: RpcRequest[M]): Promise<RpcResponse[M]> {
        console.log(`======10001 player01 rpc`)
        console.log(`======10001 mthod: ${method}`)
        console.log(`======10001 data: ${data}`)
        return new Promise<any>((resolve, reject) => {
          if(rpcWaitNotify1[method]) {
            rpcWaitNotify1[method].wait().then(resolve).catch(reject);
          } else {
            reject("Unknown method");
          }
        });
      }
    }
    const playerIO2: PlayerIO = {
      giveUp: false,
      notify: function (notification: NotificationMessage): void {
        const { newState } = notification;
        console.log(`======20000 player02 notify`)
        setPlayerData2(newState.players[1]);
      },
      rpc: function <M extends keyof RpcRequest>(method: M, data: RpcRequest[M]): Promise<RpcResponse[M]> {
        console.log(`======20001 player02 rpc`)
        console.log(`======20001 mthod: ${method}`)
        console.log(`======20001 data: ${data}`)
        return new Promise<any>((resolve, reject) => {
          if(rpcWaitNotify2[method]) {
            rpcWaitNotify2[method].wait().then(resolve).catch(reject);
          } else {
            reject("Unknown method");
          }
        });
      }
    }
    const game = new Game({
      data,
      io: {
        pause: async (gameState) => {
          await  new Promise((r) => {
            setCurrentState(gameState);
            console.log('pause');
            const rr = () => {
              console.log('pause resolve after 1500ms');
              r(undefined);
            }
            setTimeout(rr, 1500);
          })
        },
        players: [playerIO1, playerIO2],
      },
      playerConfigs,
    });
    setGame(game);
    await game.start();
    // setCurrentState(game.stateLog[game.stateLog.length - 1].state);
  };
  const initHand = () => {
    rpcWaitNotify1.switchHands.notify({
      removedHands: []
    });
    rpcWaitNotify2.switchHands.notify({
      removedHands: []
    });
  };
  return <div className="bp-main-panel" style={{
    backgroundImage: 'url("/static/bg/bp_bg.png")',
  }}>
    <h1 className='text-white'>TODO: 让玩家输入卡组分享码，然后再开始对局</h1>
    <button onClick={startGame}>TTTTT </button>
    <button onClick={initHand}>HHHH </button>
    <GameContext.Provider value={{
      gameState: currentState,
      playerData: [playerData1, playerData2],
      rpcWaitNotify: [rpcWaitNotify1, rpcWaitNotify2],
    }}>
      <div style={{width: '100%', height: '800px'}}>
        <Chessboard />
      </div>
    </GameContext.Provider>
  </div>
}

export default Play;
