// 游玩页, 用于对局模拟
import data from '@gi-tcg/data';
import { Game, GameState, GameStateLogEntry, NotificationMessage, PlayerConfig, PlayerData, PlayerIO, RpcRequest, RpcResponse, StateData } from '@gi-tcg/core';
import { createPlayer } from '@gi-tcg/webui';
import { useState } from 'react';

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
export const playerConfigs: readonly [PlayerConfig, PlayerConfig] = [playerConfig0, playerConfig1];



// game.start();


function Play() {
  const [game, setGame] = useState<Game | null>(null);
  const [stateLogs, setStateLogs] = useState<GameStateLogEntry[]>([]);
  const [currentState, setCurrentState] = useState<GameState | null>(null);
  const [playerData1, setPlayerData1] = useState<PlayerData | null>(null);
  const [playerData2, setPlayerData2] = useState<PlayerData | null>(null);
  const startGame = async () => {
    const playerIO1: PlayerIO = {
      giveUp: false,
      notify: function (notification: NotificationMessage): void {
        const { newState } = notification;
        console.log(`======10000 player01 notify`)
        setPlayerData1(newState.players[0]);
        // throw new Error('Function not implemented.');
      },
      rpc: function <M extends keyof RpcRequest>(method: M, data: RpcRequest[M]): Promise<RpcResponse[M]> {
        console.log(`======10001 player01 rpc`)
        console.log(`======10001 mthod: ${method}`)
        console.log(`======10001 data: ${data}`)
        return new Promise((r) => {});
        // throw new Error('Function not implemented.');
      }
    }
    const playerIO2: PlayerIO = {
      giveUp: false,
      notify: function (notification: NotificationMessage): void {
        const { newState } = notification;
        console.log(`======20000 player02 notify`)
        setPlayerData2(newState.players[1]);
        // throw new Error('Function not implemented.');
      },
      rpc: function <M extends keyof RpcRequest>(method: M, data: RpcRequest[M]): Promise<RpcResponse[M]> {
        console.log(`======20001 player02 rpc`)
        return new Promise((r) => {});
        // throw new Error('Function not implemented.');
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
    setStateLogs(game.stateLog);
    // setCurrentState(game.stateLog[game.stateLog.length - 1].state);
  };
  const initHand = () => {
  };
  return <div className="bp-main-panel" style={{
    backgroundImage: 'url("/static/bg/bp_bg.png")',
  }}>
    <p style={{
      color: 'white',
      fontSize: '30px',
    }}>
      正在尝试使用谷雨同学的核心库进行开发，目前还在施工中。
    </p>
    <p style={{
      color: 'white',
      fontSize: '30px',
    }}>
      谷雨同学已经有了可用的版本，可以从以下链接访问试用：
      <br />
      <a href="https://gi-tcg.vercel.app">https://gi-tcg.vercel.app</a>
      <br />
      <a href="https://gi-tcg.guyutongxue.site">https://gi-tcg.guyutongxue.site</a>
    </p>
    <button onClick={startGame}>TTTTT </button>
    <button onClick={initHand}>TTTTT </button>
    <div style={{width: '100%', height: '800px'}}>
      {stateLogs && <div>
        stateLogs.length: {stateLogs.length}
      </div>}
      {currentState && <div>
        <h1>当前阶段{currentState.phase}</h1>
        <div>
          <h2>玩家1</h2>
          <h3>骰子{playerData1?.dice}</h3>
          <h3>手牌{playerData1?.hands.map((card) => card.definitionId)}</h3>
          <h3>角色{playerData1?.characters.map((char) => char.definitionId)}</h3>
          <h3>json{}</h3>
        </div>
        <div>
          <h2>玩家2</h2>
          <h3>骰子{playerData2?.dice}</h3>
          <h3>手牌{playerData2?.hands.map((card) => card.definitionId)}</h3>
          <h3>角色{playerData2?.characters.map((char) => char.definitionId)}</h3>
          <h3>json{}</h3>
        </div>
      </div>}
    </div>
  </div>
}
/*
        <h1>{JSON.stringify(currentState)}</h1>
        <gi-tcg-standalone-chessboard
          who="0"
          id="standalone"
        ></gi-tcg-standalone-chessboard>
  const startGame = () => {
*/

export default Play;
