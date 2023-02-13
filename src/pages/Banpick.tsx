// bp模拟页
import { createPool } from '../redux/banpickCharPool'
import { useState } from 'react';
import { Button, Space } from 'antd';
import '../styles/bp.css';
import { useAppDispatch, useAppSelector } from './../redux/hooks';

// 未来扩展一下i18n，先放个函数包一下
const t = (i18n: string) => i18n;

// const Banpick = connect(mapStateToProps, mapDispatchToProps)(function({xx}: {xx:string[]}) {
const Banpick = (function() {
  // 是否正在进行bp
  const [ bping, setBping] = useState<Boolean>(false);
  const cc = useAppSelector((state) => state.banpick.xx);
  const dd = useAppDispatch();
  // 正在bp时展示bp的相关信息
  if(bping) {
    return <div className="bp-main-panel" style={{
       backgroundImage: 'url("/static/bg/bp_bg.png")',
    }}>
      <Button onClick={() => setBping(false)}>{t('返回BP页')}</Button>
      <br></br>
      {cc}
      TODO: main banpick page
    </div>;
  }
  return <>
    <Space>
      <Button onClick={() => setBping(true)}>{t('开始单人BP')}</Button>
      <Button onClick={() => dd(createPool('hhh'))}>{t('修改BP配置')}</Button>
    </Space>
    <br></br>TODO: 增加BP的相关配置
  </>
})

export {
  Banpick, 
};
