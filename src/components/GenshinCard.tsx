// 原神角色卡牌，用于展示角色卡牌
import cardsPicBig from '../static/cards/character_big.jpg';
import cardsPicSmall from '../static/cards/character_small.jpg';
import { CardInfo, CardOption } from '../type/card';
// 未来扩展一下i18n，先放个函数包一下
const t = (i18n: string) => i18n;

const cardInfos: CardInfo[] = [{
  id: 6176,
  name: '优菈',
  icon: 'https://uploadstatic.mihoyo.com/ys-obc/2023/02/27/12109492/4e77b64507209b6abb78b60b9f207c29_4483675384405332711.png',
  life: 10,
  energy: 2,
  element: t('冰'),
  weapon: t('双手剑'),
  camp: t('蒙德'),
  title: '浪沫的旋舞',
  story: '这只是一场游戏，无论是取胜或落败，你都不会因此被添上罪状。',
}, {
  id: 6175,
  name: '珊瑚宫心海',
  icon: 'https://uploadstatic.mihoyo.com/ys-obc/2023/02/27/12109492/89d5a757e494bded4020080c075bf32e_4714202636125039878.png',
  life: 10,
  energy: 2,
  element: t('水'),
  weapon: t('法器'),
  camp: t('稻妻'),
  title: '真珠之智',
  story: '未雨绸缪，临危莫乱。',
}, {
  id: 6174,
  name: '九条裟罗',
  icon: 'https://uploadstatic.mihoyo.com/ys-obc/2023/02/27/12109492/7bef3d1a8bfd273866a62b05ce89c0c2_685916088757218873.png',
  life: 10,
  energy: 2,
  element: t('雷'),
  weapon: t('弓'),
  camp: t('稻妻'),
  title: '黑羽鸣镝',
  story: '「此为，大义之举。」',
}, {
  id: 5886,
  name: '北斗',
  icon: 'https://uploadstatic.mihoyo.com/ys-obc/2023/01/16/12109492/20a9053476de0a5b82ae38f678df287b_1479624244948739352.png',
  life: 10,
  energy: 3,
  element: t('雷'),
  weapon: t('双手剑'),
  camp: t('璃月'),
  title: '无冕的龙王',
  story: '「记住这一天，你差点赢了南十字船队老大的钱。」',
},{
  id: 5885,
  name: '可莉',
  icon: 'https://uploadstatic.mihoyo.com/ys-obc/2023/01/16/12109492/69fb352f7c86836d42648a2bd9c61773_8899766719245799680.png',
  life: 10,
  energy: 3,
  element: t('火'),
  weapon: t('法器'),
  camp: t('蒙德'),
  title: '逃跑的太阳',
  story: '每一次抽牌，都可能带来一次「爆炸性惊喜」。',
},{
  id: 5376,
  name: '甘雨',
  icon: 'https://uploadstatic.mihoyo.com/ys-obc/2022/12/07/195563531/e5c7d702f8033c4361f3b25a7f0b8b30_7432225060782505988.png',
  life: 10,
  energy: 2,
  element: t('火'),
  weapon: t('弓'),
  camp: t('璃月'),
  title: '循循守月',
  story: '「既然是明早前要，那这份通稿，只要熬夜写完就好。」',
}, {
  id: 5375,
  name: "凯亚",
  icon: "https://uploadstatic.mihoyo.com/ys-obc/2022/11/26/12109492/d3ab756f76c6635d64222a30d27735d9_5509844004827284716.png",
  life: 10,
  energy: 2,
  element: t('冰'),
  weapon: t('单手剑'),
  camp: t('蒙德'),
  title: '寒风剑士',
  story: '他很擅长在他人身上发掘出「骑士般的美德」。',
}, {
  id: 5374,
  name: "重云",
  life: 10,
  energy: 3,
  element: t('冰'),
  weapon: t('双手剑'),
  camp: t('璃月'),
  title: '雪融有踪',
  icon: "https://uploadstatic.mihoyo.com/ys-obc/2022/12/05/12109492/5192016de21d9f10eb851387bdf2ef39_7120598137698198121.png",
  story: "「夏天啊，你还是悄悄过去吧…」"
}, {
  id: 5373,
  name: "神里绫华",
  life: 10,
  energy: 3,
  element: t('冰'),
  weapon: t('单手剑'),
  camp: t('稻妻'),
  title: '白鹭霜华',
  icon: "https://uploadstatic.mihoyo.com/ys-obc/2022/12/05/12109492/755cad41d2f5d2cc97e7917ab53abd6a_7168443718833391056.png",
  story: "如霜凝华，如鹭在庭。"
}, {
  id: 5372,
  name: "芭芭拉",
  life: 10,
  energy: 3,
  element: t('水'),
  weapon: t('法器'),
  camp: t('蒙德'),
  title: '闪耀偶像',
  icon: "https://uploadstatic.mihoyo.com/ys-obc/2022/12/05/12109492/f3e20082ab5ec42e599bac75159e5219_4763130586493973494.png",
  story: "无论何时都能治愈人心。"
}, {
  id: 5371,
  name: "行秋",
  life: 10,
  energy: 2,
  element: t('水'),
  weapon: t('单手剑'),
  camp: t('璃月'),
  title: '古华飞云',
  icon: "https://uploadstatic.mihoyo.com/ys-obc/2022/12/05/12109492/e522e3d11a6de75d38264655a531adf2_7851757574509931010.png",
  story: "「怎么最近小说里的主角，都是些私塾里的学生…」"
}, {
  id: 5370,
  name: "莫娜",
  life: 10,
  energy: 3,
  element: t('水'),
  weapon: t('法器'),
  camp: t('蒙德'),
  title: '星天水镜',
  icon: "https://uploadstatic.mihoyo.com/ys-obc/2022/12/05/12109492/b48dbc3857d34dac326ae26c8c6cf779_7539290207152462173.png",
  story: "无论胜负平弃，都是命当如此。"
}, {
  id: 5369,
  name: "迪卢克",
  nickName: ['卢姥爷', '卢锅巴', '卢卢伯爵', '地卢克', '卢迪克'],
  life: 10,
  energy: 3,
  element: t('火'),
  weapon: t('双手剑'),
  camp: t('蒙德'),
  title: '晨曦暗面',
  icon: "https://uploadstatic.mihoyo.com/ys-obc/2022/12/05/12109492/62a4fe60bee58508b5cb8ea1379bc975_4721560152787909057.png",
  story: "他的心是他最大的敌人。"
}, {
  id: 5368,
  name: "香菱",
  life: 10,
  energy: 2,
  element: t('火'),
  weapon: t('长柄武器'),
  camp: t('璃月'),
  title: '万民百味',
  icon: "https://uploadstatic.mihoyo.com/ys-obc/2022/12/05/12109492/db00cd121173cb6fcfefcd2269fffe8d_4269206889525716747.png",
  story: "身为一个厨师，她几乎什么都做得到。"
}, {
  id: 5367,
  name: "班尼特",
  life: 10,
  energy: 2,
  element: t('火'),
  weapon: t('单手剑'),
  camp: t('蒙德'),
  title: '命运试金石',
  icon: "https://uploadstatic.mihoyo.com/ys-obc/2022/12/05/12109492/d89f82644792213864d7882f1e6a6d57_3953477015468468294.png",
  story: "当你知道自己一定会输时，那你肯定也知道如何能赢。"
}, {
  id: 5366,
  name: "宵宫",
  life: 10,
  energy: 2,
  element: t('火'),
  weapon: t('弓'),
  camp: t('稻妻'),
  title: '琉焰华舞',
  icon: "https://uploadstatic.mihoyo.com/ys-obc/2022/12/05/12109492/0ab761b86c16f0c1f8088132e488d641_2929136467596915626.png",
  story: "花见坂第十一届全街邀请赛「长野原队」队长兼首发牌手。"
}, {
  id: 5365,
  name: "菲谢尔",
  life: 10,
  energy: 3,
  element: t('雷'),
  weapon: t('弓'),
  camp: t('蒙德'),
  title: '断罪皇女！！',
  icon: "https://uploadstatic.mihoyo.com/ys-obc/2022/12/05/12109492/7f4149c2d70eba9c08499eb42b820228_7965722296767935159.png",
  story: "「奥兹！我之眷属，展开羽翼，替我在幽夜中寻求全新的命运之线吧！」「小姐，我可没办法帮你换一张牌啊…」"
}, {
  id: 5364,
  name: "雷泽",
  life: 10,
  energy: 3,
  element: t('雷'),
  weapon: t('双手剑'),
  camp: t('蒙德'),
  title: '狼少年',
  icon: "https://uploadstatic.mihoyo.com/ys-obc/2022/12/05/12109492/52cc6519a87290840830b64f25117070_635776424632334205.png",
  story: "「牌，难。」「但，有朋友…」"
}, {
  id: 5363,
  name: "刻晴",
  life: 10,
  energy: 3,
  element: t('雷'),
  weapon: t('单手剑'),
  camp: t('璃月'),
  title: '霆霓快雨',
  icon: "https://uploadstatic.mihoyo.com/ys-obc/2022/12/05/12109492/2dd94ec81fda4b55e9d90ae89de4cf80_3180440466367335590.png",
  story: "她能构筑出许多从未设想过的牌组，拿下许多难以想象的胜利。"
}, {
  id: 5362,
  name: "赛诺",
  life: 10,
  energy: 2,
  element: t('雷'),
  weapon: t('长柄武器'),
  camp: t('须弥'),
  title: '缄秘的裁遣',
  icon: "https://uploadstatic.mihoyo.com/ys-obc/2022/12/05/12109492/7f62549984cde8b10d694d05c0618a06_5477374575707227251.png",
  story: "卡牌中蕴藏的，是大风纪官如沙漠烈日般炙热的喜爱之情。"
}, {
  id: 5361,
  name: "砂糖",
  life: 10,
  energy: 2,
  element: t('风'),
  weapon: t('法器'),
  camp: t('蒙德'),
  title: '无害甜度',
  icon: "https://uploadstatic.mihoyo.com/ys-obc/2022/12/05/12109492/a6944247959cfa7caa4d874887b40aaa_8292762834202401900.png",
  story: "「没有实战过的牌组不值得判断强度！」"
}, {
  id: 5360,
  name: "琴",
  life: 10,
  energy: 3,
  element: t('风'),
  weapon: t('单手剑'),
  camp: t('蒙德'),
  title: '蒲公英骑士',
  icon: "https://uploadstatic.mihoyo.com/ys-obc/2022/12/05/12109492/88b869ceca8108bfd6dd14a68d5e9610_8266430621016902301.png",
  story: "在夺得最终的胜利之前，她总是认为自己做得还不够好。"
}, {
  id: 5359,
  name: "凝光",
  life: 10,
  energy: 3,
  element: t('岩'),
  weapon: t('法器'),
  camp: t('璃月'),
  title: '掩月天权',
  icon: "https://uploadstatic.mihoyo.com/ys-obc/2022/12/05/12109492/6105ce8dd57dfd2efbea4d4e9bc99a7f_8256168788529926363.png",
  story: "她保守着一个最大的秘密，那就是自己保守着璃月港的许多秘密。"
}, {
  id: 5358,
  name: "诺艾尔",
  nickName: ['女仆'],
  life: 10,
  energy: 2,
  element: t('岩'),
  weapon: t('双手剑'),
  camp: t('蒙德'),
  title: '未授勋之花',
  icon: "https://uploadstatic.mihoyo.com/ys-obc/2022/12/05/12109492/e985b9bc4ec19c9e982c5b018ebbd74e_8142847329258463430.png",
  story: "整理牌桌这种事，真的可以交给她。"
}, {
  id: 5357,
  name: "柯莱",
  life: 10,
  energy: 2,
  element: t('草'),
  weapon: t('弓'),
  camp: t('须弥'),
  title: '萃念初蘖',
  icon: "https://uploadstatic.mihoyo.com/ys-obc/2022/12/05/12109492/cca275e9c7e6fa6cf61c5e1d6768db9d_3947546790342705142.png",
  story: "「大声喊出卡牌的名字会让它威力加倍…这一定是虚构的吧?」"
}, {
  id: 5356,
  name: "迪奥娜",
  life: 10,
  energy: 3,
  element: t('冰'),
  weapon: t('弓'),
  camp: t('蒙德'),
  title: '猫尾特调',
  story: "用1%的力气调酒，99%的力气⋯拒绝失败。"
}];
const cardIdMap: {[key: number]: CardInfo} = {};
const cardNameMap: {[key: string]: CardInfo} = {};
for(let i = 0; i < cardInfos.length; i++) {
  const oneCard = cardInfos[i];
  cardIdMap[oneCard.id] = oneCard;
  cardNameMap[oneCard.name] = oneCard;
}

const getCardByNickName = function(nickName:string) {
  let card = cardNameMap[nickName];
  if (card === undefined) {
    for(let i = 0; i < cardInfos.length; i++) {
      const oneCard = cardInfos[i];
      if(oneCard.nickName && oneCard.nickName.indexOf(nickName) > -1) {
        card = oneCard;
      }
    }
  }
  return card;
};
const isGenshinCard = function(id: number) {
  return cardIdMap[id] !== undefined;
}

// 图片的规格，3行7列
const picRow = 3;
const picColumn = 7;
const getPosition = function(id: number) {
  let row = 0;
  let column = 0;
  if(id >= 5356 && id <= 5376) {
    const index = id - 5356;
    row = Math.floor(index / picColumn);
    column = index - row * picColumn;
  }
  // XXX: 后续的更多角色卡组可能不符合这个规律，需要额外处理
  return {
    row,
    column,
  }
};

function GenshinCard({ id, style, size }: CardOption) {
  const pic = size === 'small' ? cardsPicSmall : cardsPicBig;
  const { row, column } = getPosition(parseInt(id, 10));
  return <div style={style}>
    <div style={{
      width: '100%',
      height: '100%',
      backgroundImage: `url(${pic})`,
      backgroundSize: `${picColumn * 100}%`,
      backgroundPosition: `-${100 * column}% ${row * (100/(picRow - 1))}%`
    }}>
    </div>
  </div>;
}
export {
  GenshinCard,
  getCardByNickName,
  isGenshinCard,
  cardInfos,
};
