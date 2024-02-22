// 游玩页, 用于对局模拟
import data from '@gi-tcg/data';
import { Game } from '@gi-tcg/core';
import { createPlayer } from '@gi-tcg/webui';

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
export const playerConfigs = [playerConfig0, playerConfig1];



// game.start();


function Play() {
  const startGame = () => {
    const standalone = document.querySelector('#standalone');

    const uiIo = createPlayer(document.querySelector('#player0'), 0, {
      onGiveUp: () => {
        io0.giveUp = true;
      },
    });
    const io0 = {
      ...uiIo,
      /*
      notify: (msg) => {
        // Example for using <gi-tcg-standalone-chessboard>.
        // Setting "stateData" and "events" prop of this element
        // will trigger chessboard update.
        standalone.stateData = msg.newState;
        standalone.events = msg.events;
        uiIo.notify(msg);
      },
      */
    };

    const io1 = createPlayer(document.querySelector('#player1'), 1);

    const game = new Game({
      data,
      io: {
        pause: async () => new Promise((r) => setTimeout(r, 500)),
        players: [io0, io1],
      },
      playerConfigs,
    });
    game.start();
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
    <div style={{width: '100%', height: '800px'}}>
      <details>
          <summary>Show standalone chessboard</summary>
      </details>
      <div id="player0"></div>
      <div id="player1"></div>

    </div>
  </div>
}
/*
        <gi-tcg-standalone-chessboard
          who="0"
          id="standalone"
        ></gi-tcg-standalone-chessboard>
  const startGame = () => {
*/

export default Play;
