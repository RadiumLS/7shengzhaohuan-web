// 从米游社拉取卡组信息的方法
import axios from 'axios';
import cheerio from 'cheerio';

const api = 'https://api-static.mihoyo.com/common/blackboard/ys_strategy/v1/content/info?app_sn=ys_strategy';
const getMiyousheDeck = async function(deckId) {
  const resp = await axios.get(api, {
    params: {
      content_id: deckId
    }
  });
  console.log(resp);
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
};