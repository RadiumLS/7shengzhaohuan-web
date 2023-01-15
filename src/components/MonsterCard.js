// 原魔角色卡牌，用于展示角色卡牌
import cardsPicBig from '../static/cards/monster_big.jpg';
import cardsPicSmall from '../static/cards/monster_small.jpg';
// 未来扩展一下i18n，先放个函数包一下
const t = (i18n) => i18n;

const cardInfos = [
  {
    id: 5528,
    name: "纯水精灵·洛蒂娅",
    icon: "https://uploadstatic.mihoyo.com/ys-obc/2022/12/05/12109492/322de5ae9b660a9bf16eb96908949f20_447198189895078860.png",
    life: 10,
    energy: 3,
    element: t('水'),
    weapon: t('其他'),
    camp: t('原魔'),
    title: '净水之主·洛蒂娅',
    story: '「但，只要百川奔流，雨露不休，水就不会消失…」',
  },
  {
    id: 5527,
    name: "愚人众·藏镜仕女",
    icon: "https://uploadstatic.mihoyo.com/ys-obc/2022/12/05/12109492/3fc3ca86fcfc5333343aed2bb93f972c_4056005914865201079.png",
    life: 10,
    energy: 2,
    element: t('水'),
    weapon: t('其他'),
    camp: t('愚人众'),
    title: '冬国仕女·水镜使者',
    story: '一切隐秘，都将深藏于潋光的水镜之中吧…',
  },
  {
    id: 5526,
    name: "愚人众·火之债务处理人",
    icon: "https://uploadstatic.mihoyo.com/ys-obc/2022/12/05/12109492/9f134f05bb71f0ee1afb33785cf945e9_8328484566733664558.png",
    life: 10,
    energy: 2,
    element: t('火'),
    weapon: t('其他'),
    camp: t('愚人众'),
    title: '清算之刃·债务处理人',
    story: '「死债不可免，活债更难逃…」',
  },
  {
    id: 5525,
    name: "魔偶剑鬼",
    nickName: ['魔剑偶鬼', '魔鬼剑偶', '魔剑鬼偶'],
    icon: "https://uploadstatic.mihoyo.com/ys-obc/2022/12/05/12109492/5b21d3abb8dd7245a8f5f540d8049fcb_8786428691685397533.png",
    life: 10,
    energy: 3,
    element: t('风'),
    weapon: t('其他'),
    camp: t('原魔'),
    title: '万般机巧·魔偶剑鬼',
    story: '今日，其仍徘徊在因缘断绝之地。',
  },
  {
    id: 5524,
    name: "丘丘岩盔王",
    nickName: ['岩盔丘丘王'],
    icon: "https://uploadstatic.mihoyo.com/ys-obc/2022/12/05/12109492/db05474f6bdc3a5080e141d72c876548_7546553703798415565.png",
    life: 8,
    energy: 2,
    element: t('岩'),
    weapon: t('其他'),
    camp: t('原魔'),
    title: '千嶂漫行·丘丘岩盔王',
    story: '绕道而行吧，因为前方是属于「王」的领域。',
  },
  {
    id: 5523,
    name: "翠翎恐蕈",
    icon: "https://uploadstatic.mihoyo.com/ys-obc/2022/12/05/12109492/83e1eecf95f1e3ba10afad2e2a4de03c_1746539124870771061.png",
    life: 10,
    energy: 2,
    element: t('草'),
    weapon: t('其他'),
    camp: t('原魔'),
    title: '幽蕈之王·翠翎恐蕈',
    story: '悄声静听，可以听到幽林之中，蕈类王者巡视领土的脚步…',
  },
];
const cardIdMap = {};
const cardNameMap = {};
for(let i = 0; i < cardInfos.length; i++) {
  const oneCard = cardInfos[i];
  cardIdMap[oneCard.id] = oneCard;
  cardNameMap[oneCard.name] = oneCard;
}

const getCardByNickName = function(nickName) {
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
const isMonsterCard = function(id) {
  return cardIdMap[id] !== undefined;
}

const picRow = 2;
const picColumn = 4;

const getPosition = function(id) {
  let row = 0;
  let column = 0;
  let index = 0
  if(id >= 5523 && id <= 5528) {
    index = id - 5523;
    row = Math.floor(index / 4);
    column = index - row * 4;
  }
  // XXX: 后续的更多卡牌可能不符合这个规律，需要额外处理
  return {
    row,
    column,
  }
};

function MonsterCard({ id, style, size }) {
  const pic = size === 'small' ? cardsPicSmall : cardsPicBig;
  const { row, column } = getPosition(id);
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
  MonsterCard,
  getCardByNickName,
  isMonsterCard,
};
