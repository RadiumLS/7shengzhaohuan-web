import { Menu } from 'antd';
import { routerMap } from '../MyRouter';
import Wellcom from '../pages/Welcom';

const menuItems = [{
    key: 'wellcom',
    label: <a href={routerMap.wellcom.path}>欢迎页</a>,
  }, {
    key: 'share_deck',
    label: <a href={routerMap.shareDeck.path}>卡组管理（主要，可用，施工中）</a>,
  }, {
    key: 'play',
    label: <a href={routerMap.play.path}>对局模拟（主要，施工中）</a>,
  }, {
    key: 'miyoushe',
    label: <a href={routerMap.miyoushe.path}>米游社卡组（旧）</a>,
  }, {
    key: 'bp',
    label: <a href={routerMap.bp.path}>bp模拟</a>,
  }, {
    key: 'rules',
    label: <a href={routerMap.rules.path}>规则列表</a>,
  }, {
    key: 'about',
    label: <a href={routerMap.about.path}>关于</a>,
  }
];
function MyMenu() {
  return <Menu
    mode="inline"
    style={{
      height: '100%',
      borderRight: 0,
    }}
    items={menuItems}
  />;
}


export {
  MyMenu
};