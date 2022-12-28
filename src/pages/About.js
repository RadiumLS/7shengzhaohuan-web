// 关于页，放点工程的相关信息在这里
import { Layout } from 'antd';

function About({ children }) {
  return <Layout>
      <p>
          本工程主要目标是《原神》中的七圣召唤卡牌游戏模拟。
      </p>
      <p>
          终极目标是实现在浏览器中模拟游玩七圣召唤。
      </p>
      <p>
          会不定时的在 BiliBili上直播，直播间地址：https://live.bilibili.com/14904069
      </p>
      <p>
          交流企鹅群: 730960047
      </p>
  </Layout>
}

export default About;


