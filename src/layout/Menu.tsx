import { Menu } from 'antd';
import { routerMap } from '../MyRouter';
import Wellcom from '../pages/Welcom';

const menuItems = [{
    key: 'wellcom',
    label: <a href={routerMap.wellcom.path}>欢迎页</a>,
  }, {
    key: 'deck',
    label: <a href={routerMap.deck.path}>卡组模拟</a>,
  }, {
    key: 'miyoushe',
    label: <a href={routerMap.miyoushe.path}>米游社卡组</a>,
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