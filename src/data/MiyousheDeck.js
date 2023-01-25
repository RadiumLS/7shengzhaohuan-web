// 从米游社拉取卡组信息的方法
import axios from 'axios';
import cheerio from 'cheerio';

const getMiyousheDeckList = async function () {
  const api = 'https://api-static.mihoyo.com/common/blackboard/ys_strategy/v1/home/content/list?app_sn=ys_strategy&channel_id=279';
  const resp = await axios.get(api, {
  });
  const deckList = resp.data.data.list[0].children[0].list.map((oneDeck) => {
    return {
      ext: JSON.parse(oneDeck.ext).c_281,
      title: oneDeck.title,
      summary: oneDeck.summary,
      icon: oneDeck.icon,
      deckId: oneDeck.content_id,
    }
  });
  return deckList;
}
const getMiyousheDeck = async function (deckId) {
  const api = 'https://api-static.mihoyo.com/common/blackboard/ys_strategy/v1/content/info?app_sn=ys_strategy';
  const resp = await axios.get(api, {
    params: {
      content_id: deckId
    }
  });
  const $ = cheerio.load(resp.data.data.content.contents[0].text);
  const charCardNames = [0, 1, 2].map((index) => $(`div.group-item:nth(${index}) + p.card-name`).html());
  const allActionCards = $('a.group-center-item');
  const cardIds = [];
  for (let i = 0; i < allActionCards.length; i++) {
    const oneCard = allActionCards[i];
    const cardId = oneCard.attribs.href.split('/')[6];
    cardIds.push(cardId);
    const $a = cheerio.load(oneCard);
    if ($a.html().indexOf('wC+mZ7') != -1) {
      // 如果能找到这个串，则说明是两张
      cardIds.push(cardId);
    }
  }
  return {
    charCardNames,
    cardIds,
  }
}
// &content_id=2662'
export {
  getMiyousheDeck,
  getMiyousheDeckList,
};